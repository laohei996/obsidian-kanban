import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fromMarkdown } from 'mdast-util-from-markdown';

import {
  gfmTaskListItem,
  gfmTaskListItemFromMarkdown,
} from '../src/parsers/extensions/taskList.ts';
import {
  addBlockId,
  dedentNewLines,
  indentNewLines,
  parseLaneTitle,
  removeBlockId,
  replaceBrs,
  replaceNewLines,
} from '../src/parsers/helpers/parser.ts';

function parse(markdown) {
  return fromMarkdown(markdown, {
    extensions: [gfmTaskListItem],
    mdastExtensions: [gfmTaskListItemFromMarkdown],
  });
}

function stubUseTab(context, useTab) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'app');
  context.after(() => {
    if (descriptor) Object.defineProperty(globalThis, 'app', descriptor);
    else delete globalThis.app;
  });
  Object.defineProperty(globalThis, 'app', {
    configurable: true,
    value: {
      vault: {
        getConfig(key) {
          assert.equal(key, 'useTab');
          return useTab;
        },
      },
    },
  });
}

describe('task-list extension with the real Markdown parser', { concurrency: false }, () => {
  for (const [name, checkChar, checked] of [
    ['space', ' ', false],
    ['lowercase x', 'x', true],
    ['uppercase X', 'X', true],
    ['slash', '/', true],
    ['minus', '-', true],
  ]) {
    it(`preserves the ${name} checkChar and task body`, () => {
      const item = parse(`- [${checkChar}] Ship release`).children[0].children[0];
      assert.equal(item.type, 'listItem');
      assert.equal(item.checked, checked);
      assert.equal(item.checkChar, checkChar);
      assert.equal(item.children[0].children.length, 1);
      assert.equal(item.children[0].children[0].value, 'Ship release');
    });
  }

  it('preserves formatted body nodes without an empty checkbox text node', () => {
    const paragraph = parse('- [x] **Ship** release').children[0].children[0].children[0];
    assert.equal(paragraph.children.length, 2);
    assert.equal(paragraph.children[0].type, 'strong');
    assert.equal(paragraph.children[0].children[0].value, 'Ship');
    assert.equal(paragraph.children[1].value, ' release');
  });

  it('keeps parent and nested task markers independent', () => {
    const parent = parse('- [ ] Parent\n  - [/] Child').children[0].children[0];
    const child = parent.children[1].children[0];
    assert.equal(parent.checked, false);
    assert.equal(parent.checkChar, ' ');
    assert.equal(parent.children[0].children[0].value, 'Parent');
    assert.equal(child.checked, true);
    assert.equal(child.checkChar, '/');
    assert.equal(child.children[0].children[0].value, 'Child');
  });

  it('does not recognize inline markers or markers in a later paragraph', () => {
    const inline = parse('- Prefix [x] body').children[0].children[0];
    assert.equal(inline.checked, null);
    assert.equal(inline.checkChar, undefined);
    assert.equal(inline.children[0].children[0].value, 'Prefix [x] body');

    const later = parse('- First paragraph\n\n  [x] Later paragraph').children[0].children[0];
    assert.equal(later.checked, null);
    assert.equal(later.checkChar, undefined);
    assert.equal(later.children[1].children[0].value, '[x] Later paragraph');

    const standalone = parse('[x] Not a list').children[0];
    assert.equal(standalone.type, 'paragraph');
    assert.equal(standalone.children[0].value, '[x] Not a list');
  });

  it('requires one marker character followed by whitespace and a body', () => {
    for (const body of ['[] body', '[xx] body', '[x]body', '[x]']) {
      const item = parse(`- ${body}`).children[0].children[0];
      assert.equal(item.checked, null, body);
      assert.equal(item.checkChar, undefined, body);
      assert.equal(item.children[0].children[0].value, body);
    }
  });
});

describe('Markdown string helpers', { concurrency: false }, () => {
  it('normalizes LF and CRLF to br tags while trimming outer whitespace', () => {
    assert.equal(replaceNewLines('  first\r\nsecond\n\nthird  '), 'first<br>second<br><br>third');
    assert.equal(replaceNewLines(' \n '), '');
  });

  it('decodes literal br tags and preserves other HTML spellings', () => {
    assert.equal(replaceBrs('  first<br>second<br><br>third  '), 'first\nsecond\n\nthird');
    assert.equal(replaceBrs('first<br/>second<BR>third'), 'first<br/>second<BR>third');
  });

  it('indents every continuation line with four spaces when useTab is false', (context) => {
    stubUseTab(context, false);
    assert.equal(indentNewLines('  first\r\nsecond\n\nthird  '), 'first\n    second\n    \n    third');
  });

  it('indents every continuation line with a tab when useTab is true', (context) => {
    stubUseTab(context, true);
    assert.equal(indentNewLines('  first\r\nsecond\nthird  '), 'first\n\tsecond\n\tthird');
  });

  it('dedents exactly one four-space or tab level and preserves shorter indentation', () => {
    assert.equal(
      dedentNewLines(' first\r\n    second\n\tthird\n        fourth\n  fifth '),
      'first\nsecond\nthird\n    fourth\n  fifth'
    );
  });

  it('adds item.data.blockId only to the first line and leaves ID-less items unchanged', () => {
    assert.equal(
      addBlockId('First\r\nSecond', { data: { blockId: 'card-42' } }),
      'First ^card-42\nSecond'
    );
    assert.equal(addBlockId('First\r\nSecond', { data: {} }), 'First\r\nSecond');
  });

  it('removes only a valid trailing first-line block ID', () => {
    assert.equal(removeBlockId('First ^card-42\r\nSecond ^keep-me'), 'First\nSecond ^keep-me');
    assert.equal(removeBlockId('First ^card-42 middle\nSecond'), 'First ^card-42 middle\nSecond');
    assert.equal(removeBlockId('First ^invalid_id'), 'First ^invalid_id');
  });

  it('extracts a trailing nonnegative integer WIP limit and trims its separator', () => {
    assert.deepEqual(parseLaneTitle('  In progress   (12)  '), { title: 'In progress', maxItems: 12 });
    assert.deepEqual(parseLaneTitle('Backlog (0)'), { title: 'Backlog', maxItems: 0 });
    assert.deepEqual(parseLaneTitle('Review(3)'), { title: 'Review', maxItems: 3 });
  });

  it('preserves non-WIP title text and decodes multiline lane titles', () => {
    for (const title of ['Review (-1)', 'Review (1.5)', 'Review (many)', 'Review (3) later']) {
      assert.deepEqual(parseLaneTitle(title), { title, maxItems: 0 });
    }
    assert.deepEqual(parseLaneTitle('  First<br>Second  '), { title: 'First\nSecond', maxItems: 0 });
  });
});
