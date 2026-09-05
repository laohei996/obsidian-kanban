import { build, stop } from 'esbuild';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { run } from 'node:test';
import { fileURLToPath } from 'node:url';
import { inspect } from 'node:util';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const controller = new AbortController();
// esbuild does not accept AbortSignal; stop its service to interrupt a pending build.
controller.signal.addEventListener('abort', stop, { once: true });
let outputDir;
let interrupted;
const onInterrupt = () => {
  interrupted = 130;
  controller.abort(new Error('Test run interrupted'));
};
const onTerminate = () => {
  interrupted = 143;
  controller.abort(new Error('Test run terminated'));
};
process.once('SIGINT', onInterrupt);
process.once('SIGTERM', onTerminate);
const deadline = setTimeout(() => controller.abort(new Error('Test run timed out')), 120_000);
deadline.unref();

try {
  const files = (await readdir(path.join(rootDir, 'tests'), { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.test.mjs'))
    .map((entry) => entry.name)
    .sort();
  if (!files.length) throw new Error('No tests/*.test.mjs files found');

  outputDir = await mkdtemp(path.join(tmpdir(), 'kanban-tests-'));
  controller.signal.throwIfAborted();
  let onBuildAbort;
  const buildAborted = new Promise((_, reject) => {
    onBuildAbort = () => reject(controller.signal.reason);
    controller.signal.addEventListener('abort', onBuildAbort, { once: true });
  });
  try {
    await Promise.race([
      build({
        absWorkingDir: rootDir,
        entryPoints: files.map((file) => path.join('tests', file)),
        outdir: outputDir,
        outExtension: { '.js': '.mjs' },
        bundle: true,
        platform: 'node',
        target: 'node24',
        format: 'esm',
        sourcemap: 'inline',
        logLevel: 'warning',
      }),
      buildAborted,
    ]);
  } finally {
    controller.signal.removeEventListener('abort', onBuildAbort);
  }
  controller.signal.throwIfAborted();

  let executed = 0;
  let summary;
  const events = run({
    files: files.map((file) => path.join(outputDir, file)),
    concurrency: 1,
    execArgv: ['--enable-source-maps'],
    timeout: 30_000,
    signal: controller.signal,
  });
  for await (const { type, data } of events) {
    if (type === 'test:stdout' || type === 'test:stderr') {
      (type === 'test:stdout' ? process.stdout : process.stderr).write(data.message);
    } else if (type === 'test:pass' || type === 'test:fail') {
      // Node reports an empty file as a passing synthetic test named after that file.
      const isTest = data.details.type !== 'suite' && data.name !== data.file;
      if (isTest && !data.skip && !data.todo) executed++;
      const status = data.skip ? 'SKIP' : data.todo ? 'TODO' : type === 'test:pass' ? 'PASS' : 'FAIL';
      console.log(`${status} ${data.name}`);
      if (data.details.error) console.error(inspect(data.details.error, { depth: 5, colors: false }));
    } else if (type === 'test:summary') {
      summary = data;
    }
  }
  controller.signal.throwIfAborted();
  if (!summary) throw new Error('Node test runner did not produce a summary');
  console.log(JSON.stringify({ ...summary.counts, executed }, null, 2));
  if (!executed) throw new Error('No non-skipped tests executed');
  if (!summary.success) throw new Error('Regression tests failed');
} catch (error) {
  console.error(controller.signal.aborted ? controller.signal.reason : error);
  process.exitCode = interrupted || 1;
} finally {
  clearTimeout(deadline);
  controller.signal.removeEventListener('abort', stop);
  stop();
  process.removeListener('SIGINT', onInterrupt);
  process.removeListener('SIGTERM', onTerminate);
  if (outputDir) await rm(outputDir, { recursive: true, force: true });
}
