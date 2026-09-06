import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateReleaseVersions, validateVersions } from '../scripts/validate-versions.mjs';

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

describe('release tag metadata', () => {
  function validateRelease(data, tag) {
    validateReleaseVersions(data.pkg, data.manifest, data.versions, tag);
  }

  for (const version of validVersions) {
    it(`accepts an exact release tag ${JSON.stringify(version)}`, () => {
      assert.doesNotThrow(() => validateRelease(metadata(version), version));
    });
  }

  for (const tag of [undefined, null, '', 52]) {
    it(`requires an explicit nonempty string tag: ${JSON.stringify(tag)}`, () => {
      assert.throws(() => validateRelease(metadata(), tag), /Release tag is required/);
    });
  }

  for (const tag of ['v2.0.52-beta.6', ' 2.0.52-beta.6', '2.0.52-beta.6\n', '2.0.52-beta.7']) {
    it(`rejects a nonmatching tag ${JSON.stringify(tag)}`, () => {
      assert.throws(() => validateRelease(metadata(), tag), /Release tag and manifest version differ/);
    });
  }

  for (const version of invalidVersions) {
    it(`rejects invalid metadata even when the tag agrees: ${JSON.stringify(version)}`, () => {
      assert.throws(() => validateRelease(metadata(version), version), /Invalid plugin version/);
    });
  }

  it('preserves the package version check', () => {
    const data = metadata();
    data.pkg.version = '2.0.52-beta.7';
    assert.throws(
      () => validateRelease(data, data.manifest.version),
      /Package and manifest versions differ/
    );
  });

  it('preserves the minimum app version check', () => {
    const data = metadata('2.0.52-beta.6', 'v1.0.0');
    assert.throws(() => validateRelease(data, data.manifest.version), /Invalid minimum app version/);
  });

  it('rejects incorrect compatibility metadata', () => {
    const data = metadata();
    data.versions[data.manifest.version] = '1.1.0';
    assert.throws(() => validateRelease(data, data.manifest.version), /Inconsistent compatibility version/);
  });

  it('rejects missing compatibility metadata', () => {
    const data = metadata();
    data.versions = {};
    assert.throws(() => validateRelease(data, data.manifest.version), /Inconsistent compatibility version/);
  });

  it('does not accept an inherited compatibility entry', () => {
    const data = metadata();
    data.versions = Object.create(data.versions);
    assert.throws(() => validateRelease(data, data.manifest.version), /Missing release compatibility entry/);
  });
});
