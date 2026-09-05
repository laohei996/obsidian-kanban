import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import {
  DEFAULT_SYMBOLS,
  extractInlineFields,
} from '../src/parsers/helpers/inlineMetadata.ts';

describe('inline metadata with real plugin enablement checks', { concurrency: false }, () => {
  let descriptor;
  let plugins;

  beforeEach(() => {
    descriptor = Object.getOwnPropertyDescriptor(globalThis, 'app');
    plugins = {
      enabledPlugins: new Set(['dataview']),
      plugins: { dataview: {}, 'obsidian-tasks-plugin': {} },
    };
    Object.defineProperty(globalThis, 'app', {
      configurable: true,
      value: { plugins },
    });
  });

  afterEach(() => {
    if (descriptor) Object.defineProperty(globalThis, 'app', descriptor);
    else delete globalThis.app;
  });

  it('ignores Dataview fields when its plugin object exists but is disabled', () => {
    plugins.enabledPlugins.clear();
    assert.deepEqual(extractInlineFields('[owner:: Ada] (status:: ready)'), []);
  });

  it('requires a truthy Dataview plugin instance as well as an enabled ID', () => {
    delete plugins.plugins.dataview;
    assert.deepEqual(extractInlineFields('[owner:: Ada]'), []);
    plugins.plugins.dataview = null;
    assert.deepEqual(extractInlineFields('[owner:: Ada]'), []);
  });

  it('extracts both wrappers with trimmed values and exact source positions', () => {
    assert.deepEqual(extractInlineFields('Lead [owner:: Ada] tail (status:: ready)'), [
      { key: 'owner', value: 'Ada', start: 5, startValue: 13, end: 18, wrapping: '[' },
      { key: 'status', value: 'ready', start: 24, startValue: 33, end: 40, wrapping: '(' },
    ]);
  });

  it('keeps nested brackets in the value and suppresses overlapping nested fields', () => {
    assert.deepEqual(extractInlineFields('[note:: outer [inner] (child:: hidden)]'), [
      {
        key: 'note',
        value: 'outer [inner] (child:: hidden)',
        start: 0,
        startValue: 7,
        end: 39,
        wrapping: '[',
      },
    ]);
  });

  it('does not close a field at an escaped closing bracket', () => {
    assert.deepEqual(extractInlineFields(String.raw`[note:: left\] right] suffix`), [
      { key: 'note', value: String.raw`left\] right`, start: 0, startValue: 7, end: 21, wrapping: '[' },
    ]);
  });

  it('allows a closing bracket after a double-escaped backslash', () => {
    assert.deepEqual(extractInlineFields(String.raw`[note:: slash\\] tail`), [
      { key: 'note', value: String.raw`slash\\`, start: 0, startValue: 7, end: 16, wrapping: '[' },
    ]);
  });

  it('skips an unclosed field without losing a later complete field', () => {
    assert.deepEqual(extractInlineFields('[note:: unfinished'), []);
    assert.deepEqual(extractInlineFields('[broken:: unfinished (status:: ready)'), [
      { key: 'status', value: 'ready', start: 21, startValue: 30, end: 37, wrapping: '(' },
    ]);
  });

  it('rejects wrapper characters in field keys and ignores plain unwrapped metadata', () => {
    assert.deepEqual(extractInlineFields('[bad(key):: value]'), []);
    assert.deepEqual(extractInlineFields('owner:: Ada'), []);
    assert.deepEqual(extractInlineFields('[not a field]'), []);
  });

  it('does not extract Tasks dates by default or with includeTaskFields false', () => {
    plugins.enabledPlugins.add('obsidian-tasks-plugin');
    const line = `Do ${DEFAULT_SYMBOLS.dueDateSymbol} 2026-09-05`;
    assert.deepEqual(extractInlineFields(line), []);
    assert.deepEqual(extractInlineFields(line, false), []);
  });

  it('requires both Tasks enablement and a plugin instance even with includeTaskFields true', () => {
    const line = `Do ${DEFAULT_SYMBOLS.dueDateSymbol} 2026-09-05`;
    assert.deepEqual(extractInlineFields(line, true), []);
    plugins.enabledPlugins.add('obsidian-tasks-plugin');
    delete plugins.plugins['obsidian-tasks-plugin'];
    assert.deepEqual(extractInlineFields(line, true), []);
  });

  it('extracts a Tasks due date without Dataview when explicitly requested', () => {
    plugins.enabledPlugins = new Set(['obsidian-tasks-plugin']);
    const fields = extractInlineFields(`Do ${DEFAULT_SYMBOLS.dueDateSymbol} 2026-09-05`, true);
    assert.deepEqual(fields.map(({ startValue, ...field }) => field), [
      { key: 'due', value: '2026-09-05', start: 3, end: 16, wrapping: 'emoji-shorthand' },
    ]);
    assert.deepEqual(extractInlineFields(`Do ${DEFAULT_SYMBOLS.dueDateSymbol} 2026-9-5`, true), []);
    assert.deepEqual(extractInlineFields(`Do ${DEFAULT_SYMBOLS.dueDateSymbol}`, true), []);
  });

  it('merges Dataview and Tasks fields in source order only when task fields are requested', () => {
    plugins.enabledPlugins.add('obsidian-tasks-plugin');
    const line = `(owner:: Ada) ${DEFAULT_SYMBOLS.dueDateSymbol} 2026-09-05`;
    assert.deepEqual(extractInlineFields(line), [
      { key: 'owner', value: 'Ada', start: 0, startValue: 8, end: 13, wrapping: '(' },
    ]);
    const fields = extractInlineFields(line, true);
    assert.equal(fields.length, 2);
    assert.deepEqual(fields[0], {
      key: 'owner', value: 'Ada', start: 0, startValue: 8, end: 13, wrapping: '(',
    });
    const { startValue, ...due } = fields[1];
    assert.deepEqual(due, {
      key: 'due', value: '2026-09-05', start: 14, end: 27, wrapping: 'emoji-shorthand',
    });
  });
});
