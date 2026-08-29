import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const localeDir = path.join(rootDir, 'src', 'lang', 'locale');
const localeFiles = fs
  .readdirSync(localeDir)
  .filter((file) => file.endsWith('.ts'))
  .sort();

const errors = [];

function getPropertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name)) return name.text;
  return null;
}

function readCatalog(file) {
  const filePath = path.join(localeDir, file);
  const source = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  let defaultExportName;
  let catalog;

  source.forEachChild((node) => {
    if (ts.isExportAssignment(node) && ts.isIdentifier(node.expression)) {
      defaultExportName = node.expression.text;
    }
  });

  source.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;

    node.declarationList.declarations.forEach((declaration) => {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === defaultExportName &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        catalog = declaration.initializer;
      }
    });
  });

  if (!defaultExportName || !catalog) {
    errors.push(`${file}: default-exported translation object not found`);
    return new Map();
  }

  const entries = new Map();

  catalog.properties.forEach((property) => {
    if (!ts.isPropertyAssignment(property)) {
      errors.push(
        `${file}:${source.getLineAndCharacterOfPosition(property.getStart()).line + 1}: unsupported property`
      );
      return;
    }

    const key = getPropertyName(property.name);
    const line = source.getLineAndCharacterOfPosition(property.getStart()).line + 1;
    if (!key) {
      errors.push(`${file}:${line}: unsupported translation key`);
      return;
    }
    if (entries.has(key)) {
      errors.push(`${file}:${line}: duplicate key ${JSON.stringify(key)}`);
      return;
    }
    if (!ts.isStringLiteralLike(property.initializer)) {
      errors.push(
        `${file}:${line}: translation for ${JSON.stringify(key)} must be a string literal`
      );
      return;
    }

    const value = property.initializer.text;
    if (!value.trim()) {
      errors.push(`${file}:${line}: translation for ${JSON.stringify(key)} is empty`);
    }
    entries.set(key, value);
  });

  return entries;
}

function getPlaceholders(value) {
  const placeholders = new Set();
  const pattern = /{{\s*([A-Za-z0-9_.-]+)\s*}}/g;
  let match;

  while ((match = pattern.exec(value))) {
    placeholders.add(match[1]);
  }

  return [...placeholders].sort();
}

const catalogs = new Map(localeFiles.map((file) => [file, readCatalog(file)]));
const english = catalogs.get('en.ts');

if (!english) {
  errors.push('en.ts: English catalog not found');
} else {
  const englishKeys = new Set(english.keys());
  const englishPlaceholders = new Map(
    [...english].map(([key, value]) => [key, getPlaceholders(value)])
  );

  localeFiles.forEach((file) => {
    if (file === 'en.ts') return;

    const catalog = catalogs.get(file);
    const extra = [...catalog.keys()].filter((key) => !englishKeys.has(key));
    extra.forEach((key) => errors.push(`${file}: unknown key ${JSON.stringify(key)}`));

    catalog.forEach((value, key) => {
      const englishValue = english.get(key);
      if (englishValue === undefined) return;

      const expected = englishPlaceholders.get(key);
      const actual = getPlaceholders(value);
      if (expected.join('\0') !== actual.join('\0')) {
        errors.push(
          `${file}: placeholders for ${JSON.stringify(key)} are [${actual.join(', ')}], expected [${expected.join(', ')}]`
        );
      }
    });

    const missing = [...englishKeys].filter((key) => !catalog.has(key));
    const coverage = ((catalog.size / english.size) * 100).toFixed(0);
    console.log(
      `${file.padEnd(12)} ${String(catalog.size).padStart(3)}/${english.size} (${coverage}%)`
    );

    if (file === 'zh-cn.ts' && missing.length) {
      errors.push(
        `zh-cn.ts: missing keys: ${missing.map((key) => JSON.stringify(key)).join(', ')}`
      );
    }
  });
}

if (errors.length) {
  console.error('\ni18n validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log('\ni18n validation passed');
}
