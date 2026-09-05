import semver from 'semver';

function isStrictSemVer(value) {
  const parsed = semver.parse(value);
  if (!parsed) return false;
  // semver also accepts a v prefix or surrounding whitespace; manifest values must be canonical.
  const build = parsed.build.length ? `+${parsed.build.join('.')}` : '';
  return value === `${parsed.version}${build}`;
}

export function validateVersions(pkg, manifest, versions) {
  if (!isStrictSemVer(manifest.version)) throw new Error('Invalid plugin version');
  if (!isStrictSemVer(manifest.minAppVersion)) throw new Error('Invalid minimum app version');
  if (pkg.version !== manifest.version) throw new Error('Package and manifest versions differ');
  if (versions[manifest.version] !== manifest.minAppVersion) {
    throw new Error('Inconsistent compatibility version');
  }
}
