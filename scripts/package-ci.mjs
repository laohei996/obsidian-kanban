import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { lstat, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateVersions } from './validate-versions.mjs';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const files = ['main.js', 'manifest.json', 'styles.css'];
const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const readJson = async (file) => JSON.parse(await readFile(path.join(rootDir, file), 'utf8'));

try {
  if (process.argv.length !== 3) throw new Error('Usage: node scripts/package-ci.mjs <new-output-directory>');
  const outputDir = path.resolve(process.argv[2]);
  const pkg = await readJson('package.json');
  const manifest = await readJson('manifest.json');
  const versions = await readJson('versions.json');
  for (const field of ['id', 'name', 'version', 'minAppVersion', 'description', 'author']) {
    if (typeof manifest[field] !== 'string' || !manifest[field].trim()) {
      throw new Error(`manifest.json: missing or invalid ${field}`);
    }
  }
  if (manifest.id !== 'obsidian-kanban' || pkg.name !== manifest.id) {
    throw new Error('Unexpected plugin identity');
  }
  if (typeof manifest.isDesktopOnly !== 'boolean') throw new Error('Invalid isDesktopOnly');
  validateVersions(pkg, manifest, versions);

  const assets = {};
  for (const file of files) {
    const source = path.join(rootDir, file);
    const stat = await lstat(source);
    if (!stat.isFile() || !stat.size) throw new Error(`Missing, empty or non-regular asset: ${file}`);
    assets[file] = { bytes: stat.size, sha256: sha256(await readFile(source)) };
  }

  let checkoutSha = null;
  let dirty = null;
  try {
    checkoutSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    dirty = !!execFileSync('git', ['status', '--porcelain'], { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch {
    // A local isolated copy may deliberately omit .git; never invent a commit for it.
  }
  const isActions = process.env.GITHUB_ACTIONS === 'true';
  if (isActions && (!checkoutSha || dirty !== false || checkoutSha !== process.env.GITHUB_SHA)) {
    throw new Error('Actions package must come from the clean checkout of GITHUB_SHA');
  }
  const headSha = process.env.PR_HEAD_SHA || null;
  if (headSha && !/^[a-f0-9]{40}$/.test(headSha)) throw new Error('Invalid PR head SHA');
  const prNumber = process.env.PR_NUMBER || null;
  if (prNumber && !/^\d+$/.test(prNumber)) throw new Error('Invalid PR number');

  // A fresh destination prevents overwriting an earlier test package.
  await mkdir(outputDir);
  const archiveName = 'kanban-plugin.zip';
  const archivePath = path.join(outputDir, archiveName);
  execFileSync('zip', ['-q', '-X', '-j', archivePath, ...files.map((file) => path.join(rootDir, file))], { cwd: rootDir });
  const archive = await readFile(archivePath);
  assets[archiveName] = { bytes: archive.length, sha256: sha256(archive) };

  const info = {
    purpose: 'Unreleased test build; install only in a disposable test vault',
    pluginVersion: manifest.version,
    checkoutSha,
    dirty,
    event: isActions ? process.env.GITHUB_EVENT_NAME : 'local',
    prNumber,
    prHeadSha: headSha,
    runId: isActions ? process.env.GITHUB_RUN_ID : null,
    runAttempt: isActions ? process.env.GITHUB_RUN_ATTEMPT : null,
    node: process.version,
    yarn: execFileSync('yarn', ['--version'], { cwd: rootDir, encoding: 'utf8' }).trim(),
    assets,
  };
  await writeFile(path.join(outputDir, 'build-info.json'), JSON.stringify(info, null, 2) + '\n');
  await writeFile(path.join(outputDir, 'SHA256SUMS.txt'), Object.entries(assets).map(([name, data]) => `${data.sha256}  ${name}\n`).join(''));
  console.log(`Test package: ${archivePath}`);
  console.log(JSON.stringify(info, null, 2));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
