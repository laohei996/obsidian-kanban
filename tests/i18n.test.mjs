import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import {
  getCurrentLocaleCode,
  normalizeLocaleCode,
  t,
} from '../src/lang/helpers.ts';

describe('locale normalization', { concurrency: false }, () => {
  it('normalizes case, surrounding whitespace, and underscore separators', () => {
    assert.equal(normalizeLocaleCode('  PT_BR  '), 'pt-br');
    assert.equal(normalizeLocaleCode('  ZH_TW  '), 'zh-tw');
    assert.equal(normalizeLocaleCode('EN'), 'en');
  });

  it('resolves supported historical and script aliases', () => {
    for (const [raw, expected] of [
      ['cz', 'cs'],
      ['nb', 'no'],
      ['nn', 'nn'],
      ['zh', 'zh-cn'],
      ['zh-hans', 'zh-cn'],
      ['zh-sg', 'zh-cn'],
      ['zh-hant', 'zh-tw'],
      ['zh-hk', 'zh-tw'],
      ['zh-mo', 'zh-tw'],
    ]) {
      assert.equal(normalizeLocaleCode(raw), expected, raw);
    }
  });

  it('falls back from regional tags to the longest supported prefix', () => {
    assert.equal(normalizeLocaleCode('zh-Hant-HK'), 'zh-tw');
    assert.equal(normalizeLocaleCode('zh_Hans_CN'), 'zh-cn');
    assert.equal(normalizeLocaleCode('pt-BR-x-custom'), 'pt-br');
    assert.equal(normalizeLocaleCode('fr-CA'), 'fr');
    assert.equal(normalizeLocaleCode('nb-NO'), 'no');
  });

  it('defaults empty, unknown, and object-prototype names to English', () => {
    for (const raw of [undefined, null, '', '   ', 'xx-ZZ', 'constructor', '__proto__', 'toString']) {
      assert.equal(normalizeLocaleCode(raw), 'en', String(raw));
    }
  });
});

describe('live locale selection and real translations', { concurrency: false }, () => {
  let descriptor;
  let language;

  beforeEach(() => {
    descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
    language = 'en';
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        localStorage: {
          getItem(key) {
            assert.equal(key, 'language');
            return language;
          },
        },
      },
    });
  });

  afterEach(() => {
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
    else delete globalThis.window;
  });

  it('uses English when the language storage key is absent or unknown', () => {
    language = null;
    assert.equal(getCurrentLocaleCode(), 'en');
    assert.equal(t('Add a card'), 'Add a card');
    language = 'unknown-REGION';
    assert.equal(getCurrentLocaleCode(), 'en');
    assert.equal(t('Cancel'), 'Cancel');
  });

  it('updates cached locale and translations on the same imported instance', () => {
    language = 'zh_CN';
    assert.equal(getCurrentLocaleCode(), 'zh-cn');
    assert.equal(t('Add a card'), '添加卡片');
    assert.equal(getCurrentLocaleCode(), 'zh-cn');

    language = 'de-DE';
    assert.equal(getCurrentLocaleCode(), 'de');
    assert.equal(t('Add a card'), 'Füge eine Karte hinzu');

    language = 'en';
    assert.equal(getCurrentLocaleCode(), 'en');
    assert.equal(t('Add a card'), 'Add a card');
  });

  it('falls back through the real empty Hindi dictionary without changing the selected locale', () => {
    language = 'hi-IN';
    assert.equal(getCurrentLocaleCode(), 'hi');
    assert.equal(t('Add a list'), 'Add a list');
    assert.equal(t('Sort by {{field}}', { field: 'Priority' }), 'Sort by Priority');
    assert.equal(getCurrentLocaleCode(), 'hi');
  });

  it('uses real localized text and leaves placeholders intact when replacements are absent', () => {
    language = 'zh-Hans-CN';
    assert.equal(t('Cancel'), '取消');
    assert.equal(t('Sort by {{field}}'), '按{{field}}排序');
    assert.equal(t('Sort by {{field}}', { field: '优先级' }), '按优先级排序');
  });

  it('inserts dollar replacement tokens literally instead of expanding matched text', () => {
    assert.equal(t('Sort by {{field}}', { field: '$&' }), 'Sort by $&');
    assert.equal(t('Sort by {{field}}', { field: "$$ $` $'" }), "Sort by $$ $` $'");
  });

  it('stringifies numeric replacements including zero', () => {
    assert.equal(t('Sort by {{field}}', { field: 0 }), 'Sort by 0');
    language = 'zh-cn';
    assert.equal(t('Sort by {{field}}', { field: 42 }), '按42排序');
  });
});
