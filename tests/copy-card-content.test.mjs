import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { copyCardContent } from '../src/components/Item/copyCardContent.ts';

function card(titleRaw) {
  return Object.freeze({
    id: 'card-1',
    data: Object.freeze({
      titleRaw,
      title: 'Display text with metadata hidden',
      checked: true,
      checkChar: 'x',
      blockId: 'existing-block',
    }),
  });
}

describe('copying card content', () => {
  for (const [name, content] of [
    ['plain text', 'Card text'],
    ['multiple lines and blank lines', 'First line\nSecond line\n\nLast line'],
    ['CRLF line endings', 'First line\r\nSecond line'],
    ['Markdown and nested tasks', '**Bold** and `code`\n- [ ] Nested task\n  - Nested list'],
    ['links and embeds', '[[Note|Alias]] ![[image.png]] [Link](https://example.com)'],
    ['tags, dates and inline metadata', '#tag @{2026-09-06} [owner:: Team] 📅 2026-09-07'],
    ['Chinese and emoji', '中文卡片 👩🏽‍💻 ✅'],
    ['leading and trailing whitespace', '  \tCard text  \n\n'],
    ['empty legacy content', ''],
  ]) {
    it(`preserves ${name} instead of copying the display title`, async () => {
      const writes = [];
      const item = card(content);
      assert.notEqual(item.data.titleRaw, item.data.title);

      await copyCardContent(item, {
        async writeText(text) {
          writes.push(text);
        },
      });

      assert.deepEqual(writes, [content]);
    });
  }

  it('does not add the card checkbox, list marker or block ID', async () => {
    const writes = [];
    await copyCardContent(card('Body'), {
      async writeText(text) {
        writes.push(text);
      },
    });
    assert.deepEqual(writes, ['Body']);
  });

  it('does not mutate the card data', async () => {
    const item = card('Body #tag');
    const before = structuredClone(item);
    await copyCardContent(item, { async writeText() {} });
    assert.deepEqual(item, before);
  });

  it('starts exactly one write immediately, without waiting for another task', async () => {
    const writes = [];
    const pending = copyCardContent(card('Body'), {
      async writeText(text) {
        writes.push(text);
      },
    });
    assert.deepEqual(writes, ['Body']);
    await pending;
    assert.deepEqual(writes, ['Body']);
  });

  it('preserves the clipboard method receiver', async () => {
    const clipboard = {
      async writeText(text) {
        assert.equal(this, clipboard);
        assert.equal(text, 'Body');
      },
    };
    await copyCardContent(card('Body'), clipboard);
  });

  for (const [name, clipboard] of [
    ['undefined clipboard', undefined],
    ['null clipboard', null],
    ['missing writeText', {}],
    ['undefined writeText', { writeText: undefined }],
    ['non-function writeText', { writeText: 'unavailable' }],
  ]) {
    it(`rejects ${name}`, async () => {
      await assert.rejects(copyCardContent(card('Body'), clipboard), /Clipboard is unavailable/);
    });
  }

  it('propagates a synchronous write failure for the menu to report', async () => {
    const failure = new Error('Clipboard blocked');
    await assert.rejects(
      copyCardContent(card('Body'), {
        writeText() {
          throw failure;
        },
      }),
      (error) => error === failure
    );
  });

  it('propagates an asynchronous rejection for the menu to report', async () => {
    const failure = new Error('Permission denied');
    await assert.rejects(
      copyCardContent(card('Body'), {
        async writeText() {
          throw failure;
        },
      }),
      (error) => error === failure
    );
  });

  it('does not report completion until the clipboard write resolves', async () => {
    let resolveWrite;
    let completed = false;
    const pending = copyCardContent(card('Body'), {
      writeText() {
        return new Promise((resolve) => {
          resolveWrite = resolve;
        });
      },
    }).then(() => {
      completed = true;
    });
    await Promise.resolve();
    assert.equal(completed, false);
    resolveWrite();
    await pending;
    assert.equal(completed, true);
  });
});
