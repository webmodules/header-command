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
    this.level = level;
    this.tag = '<h' + level + '>';
    this.nodeName = 'H' + level;
    debug('created HeaderCommand: level %o, document %o', level, this.document);
  }

  execute(range?: Range, value?: any): void {
    if (this.queryState(range)) {
      super.execute(range, '<p>');
    } else {
      super.execute(range, this.tag);
    }
  }

  queryState(range?: Range): boolean {
    if (!range) range = currentRange(this.document);
    if (!range) return false;
    var node = closest(range.commonAncestorContainer, this.nodeName, true);
    return !! node;
  }

  queryEnabled(range?: Range): boolean {
    return super.queryEnabled(range);
  }
}

export = HeaderCommand;

  /**
   * All: Executing a heading command inside a list element corrupts the markup.
   * Disabling for now.
   */
  /*
  headingCommand.queryEnabled = function () {
    var selection = new scribe.api.Selection();
    var listNode = selection.getContaining(function (node) {
      return node.nodeName === 'OL' || node.nodeName === 'UL';
    });

    return scribe.api.Command.prototype.queryEnabled.apply(this, arguments)
      && scribe.allowsBlockElements() && ! listNode;
  };
  */