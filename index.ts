/// <reference path='require.d.ts' />

/**
 * TypeScript dependencies.
 */

import NativeCommand = require('native-command');

/**
 * JavaScript dependencies.
 */

var closest = require('component-closest');
var currentRange = require('current-range');
var unwrap = require('unwrap-node');
var debug = require('debug')('header-command');

/**
 * `HeaderCommand` class is a very basic wrapper around the `formatBlock`
 * native command. You create instances with a `level` integer passed in
 * to signify the HTML header tag to use.
 *
 * ``` js
 * var h3 = new HeaderCommand(3);
 * if (h3.queryEnabled()) {
 *   h3.execute();
 * }
 * ```
 *
 * @public
 */

class HeaderCommand extends NativeCommand {
  public level: number;
  private tag: string;
  private nodeName: string;

  constructor(level: number, doc?: Document) {
    super('formatBlock', doc);
    this.level = parseInt(String(level).replace(/^h/i, ''), 10);
    this.tag = '<h' + this.level + '>';
    this.nodeName = 'H' + this.level;
    debug('created HeaderCommand: level %o, document %o', this.level, this.document);
  }

  execute(range?: Range, value?: any): void {
    var r = range || currentRange(this.document);
    var li = closest(r.commonAncestorContainer, 'li', true);

    if (li) {
      // we're inside a LI element
      var h = li.querySelector(this.nodeName);
      if (h) {
        // unwrap the H node
        unwrap(h);
      } else {
        // create an H node, wrap the LI contents with it
        h = this.document.createElement(this.nodeName);
        while (li.firstChild) {
          h.appendChild(li.firstChild);
        }
        li.appendChild(h);
      }
    } else {
      if (this.queryState(r)) {
        super.execute(range, '<p>');
      } else {
        super.execute(range, this.tag);
      }
    }
  }

  queryState(range?: Range): boolean {
    if (!range) range = currentRange(this.document);
    if (!range) return false;
    var node = closest(range.commonAncestorContainer, this.nodeName, true);
    return !! node;
  }
}

export = HeaderCommand;
