import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateVersions } from '../scripts/validate-versions.mjs';

function metadata(version = '2.0.52-beta.6', minAppVersion = '1.0.0') {
  return {
    pkg: { version },
    manifest: { version, minAppVersion },
    versions: { [version]: minAppVersion },
  };
}

function validate({ pkg, manifest, versions }) {
  validateVersions(pkg, manifest, versions);
}

const validVersions = [
  '0.0.0',
  '1.0.0',
  '2.0.52-beta.6',
  '1.2.3+build.001',
  '1.2.3-rc.0+sha.abc123',
];
const invalidVersions = [
  '2.0.52-beta_7',
  '02.0.52-beta.6',
  '1.2.3-beta.01',
  '1.2.3-beta..1',
  '1.2.3+',
  'v1.2.3',
  ' 1.2.3',
  '1.2.3\n',
  '1.2',
  'not-a-version',
  '',
];

describe('strict build metadata versions', () => {
  for (const version of validVersions) {
    it(`accepts plugin version ${JSON.stringify(version)}`, () => {
      assert.doesNotThrow(() => validate(metadata(version)));
    });
    it(`accepts minimum app version ${JSON.stringify(version)}`, () => {
      assert.doesNotThrow(() => validate(metadata('2.0.52-beta.6', version)));
    });
  }

  for (const version of invalidVersions) {
    it(`rejects plugin version ${JSON.stringify(version)} even when metadata agrees`, () => {
      assert.throws(() => validate(metadata(version)), /Invalid plugin version/);
    });
    it(`rejects minimum app version ${JSON.stringify(version)} even when metadata agrees`, () => {
      assert.throws(
        () => validate(metadata('2.0.52-beta.6', version)),
        /Invalid minimum app version/
      );
    });
  }

  it('still rejects inconsistent package and manifest versions', () => {
    const data = metadata();
    data.pkg.version = '2.0.52-beta.7';
    assert.throws(() => validate(data), /Package and manifest versions differ/);
  });

  it('still rejects inconsistent compatibility versions', () => {
    const data = metadata();
    data.versions[data.manifest.version] = '1.1.0';
    assert.throws(() => validate(data), /Inconsistent compatibility version/);
  });

  it('rejects a missing compatibility entry', () => {
    const data = metadata();
    data.versions = {};
    assert.throws(() => validate(data), /Inconsistent compatibility version/);
  });
});
