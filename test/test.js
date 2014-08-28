
var assert = require('assert');
var HeaderCommand = require('../');

describe('HeaderCommand', function () {
  var div;

  afterEach(function () {
    if (div) {
      // clean up...
      document.body.removeChild(div);
      div = null;
    }
  });

  describe('new HeaderCommand(1)', function () {

    it('should create a `HeaderCommand` instance', function () {
      var h1 = new HeaderCommand('h1');

      assert(h1 instanceof HeaderCommand);
      assert(h1.nodeName === 'H1');
      assert(h1.document === document);
    });

    describe('execute()', function () {

      it('should insert a H1 element for closest block parent', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p><p><b>world!</b></p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.lastChild.firstChild.firstChild, 1);
        range.setEnd(div.lastChild.firstChild.firstChild, 3);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var h1 = new HeaderCommand('h1');
        h1.execute();

        assert('<p>hello</p><h1><b>world!</b></h1>' === div.innerHTML);
      });

      it('should toggle back to a P when active and executed', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p><p><b>world!</b></p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.lastChild.firstChild.firstChild, 1);
        range.setEnd(div.lastChild.firstChild.firstChild, 3);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var h1 = new HeaderCommand('h1');

        h1.execute();
        assert('<p>hello</p><h1><b>world!</b></h1>' === div.innerHTML);

        h1.execute();
        assert('<p>hello</p><p><b>world!</b></p>' === div.innerHTML);
      });

      it('should work inside of a UL/LI', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p><ul><li>foo</li><li>bar</li><li>baz</li></ul>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set current selection
        var range = document.createRange();
        range.setStart(div.lastChild.childNodes[1].firstChild, 1);
        range.setEnd(div.lastChild.childNodes[1].firstChild, 1);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var h1 = new HeaderCommand('h1');

        h1.execute();
        assert(div.innerHTML === '<p>hello</p><ul><li>foo</li><li><h1>bar</h1></li><li>baz</li></ul>');

        h1.execute();
        assert(div.innerHTML === '<p>hello</p><ul><li>foo</li><li>bar</li><li>baz</li></ul>');
      });

    });

  });

  describe('new HeaderCommand("h1")', function () {

    it('should create a `HeaderCommand` instance', function () {
      var h1 = new HeaderCommand('h1');

      assert(h1 instanceof HeaderCommand);
      assert(h1.nodeName === 'H1');
      assert(h1.document === document);
    });

  });

});
