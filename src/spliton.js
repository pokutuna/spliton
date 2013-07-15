// spliton
// authors: pokutuna
// license: http://creativecommons.org/licenses/MIT/ (The MIT license)

(function() {

  // thanks to Chrome Keyconfig
  var CK = {
    keyId: {
      "U+0008" : "BackSpace",
      "U+0009" : "Tab",
      "U+0018" : "Cancel",
      "U+001B" : "Esc",
      "U+0020" : "Space",
      "U+0021" : "!",
      "U+0022" : "\"",
      "U+0023" : "#",
      "U+0024" : "$",
      "U+0026" : "&",
      "U+0027" : "'",
      "U+0028" : "(",
      "U+0029" : ")",
      "U+002A" : "*",
      "U+002B" : "+",
      "U+002C" : ",",
      "U+002D" : "-",
      "U+002E" : ".",
      "U+002F" : "/",
      "U+0030" : "0",
      "U+0031" : "1",
      "U+0032" : "2",
      "U+0033" : "3",
      "U+0034" : "4",
      "U+0035" : "5",
      "U+0036" : "6",
      "U+0037" : "7",
      "U+0038" : "8",
      "U+0039" : "9",
      "U+003A" : ":",
      "U+003B" : ";",
      "U+003C" : "<",
      "U+003D" : "=",
      "U+003E" : ">",
      "U+003F" : "?",
      "U+0040" : "@",
      "U+0041" : "a",
      "U+0042" : "b",
      "U+0043" : "c",
      "U+0044" : "d",
      "U+0045" : "e",
      "U+0046" : "f",
      "U+0047" : "g",
      "U+0048" : "h",
      "U+0049" : "i",
      "U+004A" : "j",
      "U+004B" : "k",
      "U+004C" : "l",
      "U+004D" : "m",
      "U+004E" : "n",
      "U+004F" : "o",
      "U+0050" : "p",
      "U+0051" : "q",
      "U+0052" : "r",
      "U+0053" : "s",
      "U+0054" : "t",
      "U+0055" : "u",
      "U+0056" : "v",
      "U+0057" : "w",
      "U+0058" : "x",
      "U+0059" : "y",
      "U+005A" : "z",
      "U+005B" : "[",
      "U+005C" : "\\",
      "U+005D" : "]",
      "U+005E" : "^",
      "U+005F" : "_",
      "U+0060" : "`",
      "U+007B" : "{",
      "U+007C" : "|",
      "U+007D" : "}",
      "U+007F" : "Delete"
    },
    winkeys: {
      "U+00BC":",",
      "U+00BE":".",
      "U+00BF":"/",
      "U+00E2":"\\",
      "U+00BB":";",
      "U+00BA":":",
      "U+00DD":"]",
      "U+00C0":"@",
      "U+00DB":"[",
      "U+00BD":"-",
      "U+00DE":"^",
      "U+00DC":"\\"
    },
    shiftWinkeys: {
      "U+0031": "!",
      "U+0032": "\"",
      "U+0033": "#",
      "U+0034": "$",
      "U+0035": "%",
      "U+0036": "&",
      "U+0037": "'",
      "U+0038": "(",
      "U+0039": ")",
      "U+00BA": "*",
      "U+00BB": "+",
      "U+00BC": "<",
      "U+00BD": "=",
      "U+00BE": ">",
      "U+00BF": "?",
      "U+00C0": "`",
      "U+00DB": "{",
      "U+00DC": "|",
      "U+00DD": "}",
      "U+00DE": "~",
      "U+00E2": "_"
    },
    shiftLinuxkeys: {
      "U+0030": ")",
      "U+0031": "!",
      "U+0033": "#",
      "U+0034": "$",
      "U+0035": "%",
      "U+0037": "&",
      "U+0038": "*",
      "U+0039": "(",
      "U+00BB": "+",
      "U+00BC": "<",
      "U+00BD": "_",
      "U+00BE": ">",
      "U+00BF": "?",
      "U+00C0": "~",
      "U+00DB": "{",
      "U+00DC": "|",
      "U+00DD": "}",
      "U+00DE": "\""
    },
    shiftKeysfix: /linux/i.test(navigator.platform) ? this.shiftLinuxkeys : this.shiftWinkeys,
    getKey: function(event) {
      var key = this.keyId[event.keyIdentifier] || this.winkeys[event.keyIdentifier] || event.keyIdentifier,
          ctrl = event.ctrlKey ? 'C-' : '',
          meta = (event.metaKey || event.altKey) ? 'M-' : '',
          shift = event.shiftKey ? 'S-' : '';
      if (event.shiftKey && this.shiftKeysfix[event.keyIdentifier]) key = this.shiftKeysfix[event.keyIdentifier];
      if (/^(Meta|Shift|Control|Alt)$/.test(key)) return key;
      if (event.shiftKey) {
        if (/^[a-z]$/.test(key))
          return ctrl+meta+key.toUpperCase();
        if (/^(Enter|Space|BackSpace|Tab|Esc|Home|End|Left|Right|Up|Down|PageUp|PageDown|Delete|F\d\d?)$/.test(key))
          return ctrl+meta+shift+key;
      }
      return ctrl+meta+key;
    }
  };

  var Spliton = {
    init: function() {
      console.log('spliton!');
      document.addEventListener('keydown', function(event) {
        Spliton.rootKeyHandler(event);
      });
    },

    rootKeyHandler: function(event) {
      var key = CK.getKey(event);
      // TODO keyconfig
      if (key === '/') {
        this.isActive() ? this.exitSpliton() : this.startSpliton();
      }
    },

    _splitonActiveFlag: false,

    isActive: function() {
      return this._splitonActiveFlag ? true : false;
    },

    startSpliton: function(depth) {
      console.log('start');
      this._splitonActiveFlag = true;
      var pane = new Spliton.Pane();
      this._rootPane = pane;
      this.selectSpliton();
    },

    selectSpliton: function(){
      var pane = this._rootPane;
      pane.updateStyles();
      document.body.appendChild(pane.asElement());
      var elem = pane.searchElement();
      this.vibrateElement(elem);

      var self = this;
      this.registerKeyHandlerOnce(function(event) {
        self.cancelSelection();
        var key = CK.getKey(event);

        // TODO config
        switch (key) {
        case 'q':
          pane.resize(0, 3, 0, 2);
          break;

        case 'w':
          pane.resize(1, 3, 0, 2);
          break;

        case 'e':
          pane.resize(2, 3, 0, 2);
          break;

        case 'a':
          pane.resize(0, 3, 1, 2);
          break;

        case 's':
          pane.resize(1, 3, 1, 2);
          break;

        case 'd':
          pane.resize(2, 3, 1, 2);
          break;

        // case 'z':
        //   pane.resize(0, 3, 2, 3);
        //   break;

        // case 'x':
        //   pane.resize(1, 3, 2, 3);
        //   break;

        // case 'c':
        //   pane.resize(2, 3, 2, 3);
        //   break;

        case 'Enter':
          Spliton.Util.trigger(elem, 'click');
          return;
          break;

        default:
          self.exitSpliton();
          return;
          break;
        }
        self.selectSpliton();
      });
    },

    exitSpliton: function() {
      console.log('exit');
      this._splitonActiveFlag = false;
      if (this._rootPane) {
        document.body.removeChild(this._rootPane.asElement());
      }
      this.cancelSelection();
    },

    _rootPane: null,

    registerKeyHandlerOnce: function(callback) {
      var onetimeHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();
        document.removeEventListener('keydown', onetimeHandler, true);
        callback(event);
      };
      document.addEventListener('keydown', onetimeHandler, true);
    },

    vibrateElement: function(elem) {
      Spliton.Util.addClass(elem, 'spliton-chrome-extension-select');
    },

    cancelSelection: function() {
      var elems = document.querySelectorAll('.spliton-chrome-extension-select');
      for (var i = 0; i < elems.length; i++) {
        Spliton.Util.removeClass(elems[i], 'spliton-chrome-extension-select');
      }
    }
  };

  Spliton.Pane = function(top, left, width, height) {
    this.left   = (left || 0);
    this.top    = (top || 0);
    this.width  = (width || window.innerWidth);
    this.height = (height || window.innerHeight);
    this._element = null;
  };
  Spliton.Pane.prototype = {

    rootPaneId: 'spliton-chrome-extension',

    asElement: function() {
      if (!this._element) {
        var pane = document.createElement('div');
        pane.id = this.rootPaneId;
        this._element = pane;
      }
      return this._element;
    },

    updateStyles: function() {
      var elem = this.asElement();
      elem.style.top    = this.top;
      elem.style.left   = this.left;
      elem.style.marginTop = this.top + 'px';
      elem.style.marginLeft = this.left + 'px';
      elem.style.width  = this.width + 'px';
      elem.style.height = this.height + 'px';
    },

    hide: function() {
      this.asElement().style.display = 'none';
    },

    show: function() {
      this.asElement().style.display = 'block';
    },

    getCenter: function() {
      return {
        x: this.left + this.width / 2,
        y: this.top + this.height / 2
      };
    },

    resize: function(xIndex, xSize, yIndex, ySize) {
      this.width = this.width / xSize;
      this.height = this.height / ySize;
      this.left = this.left + this.width * xIndex;
      this.top = this.top + this.height * yIndex;
    },

    _searchRadians: (function() {
      var rs = [0.5, 0.75, 1.00, 1.25, 1.50, 1.75, 0.00, 0.25];
      for (var i = 0, size = rs.length; i < size; i++) {
        rs[i]= rs[i] * Math.PI;
      }
      return rs;
    })(),

    searchElement: function() {
      var center = this.getCenter();
      console.log(center);
      var px = center.x,
          py = center.y,
          interval = 5, // TODO point interval configuration
          right = this.left + this.width,
          bottom = this.top + this.height,
          element = null;

      this.hide();

      // 中心にあれば返す
      var e = document.elementFromPoint(px, py);
      if (this._isSelectableElement(e)) {
        this.show();
        return e;
      }

      // ないなら回転しながら探す
      var ridx = 0;
      while (this.left <= px && px <= right && this.top <= py && py <= bottom) {
        if (ridx >= this._searchRadians.length) {
          ridx = 0;
          interval += 5;
        }
        px = px + Math.cos(this._searchRadians[ridx]) * interval;
        py = py + Math.sin(this._searchRadians[ridx]) * interval;
        ridx++;

        e = document.elementFromPoint(px, py);
        if (this._isSelectableElement(e)) {
          element = e;
          break;
        }
      };
      this.show();
      return element;
    },

    _isSelectableElement: function(elem) {
      var pattern = /^(a|input)$/i; // TODO default search anchor element
      if (!elem) return false;
      if (pattern.test(elem.tagName)) {
        console.log(elem);
        return true;
      } else {
        return this._isSelectableElement(elem.parentElement);
      }
    }

  };

  Spliton.Util = {
    trigger: function(elem, event){
      elem.dispatchEvent(new Event(event));
    },
    addClass: function(elem, className) {
      if (!elem) return;
      var classes = elem.className.split(' ');
      for (var i = 0; i < classes.length; i++) {
        if (classes[i] === className) return;
      }
      elem.className += (' ' + className);
    },
    removeClass: function(elem, className) {
      if (!elem) return;
      var classes = elem.className.split(' '),
          newClassName = '';
      for (var i = 0; i < classes.length; i++) {
        if (classes[i] !== className) {
          if (newClassName !== '') newClassName += ' ';
          newClassName += classes[i];
        }
      }
      elem.className = newClassName;
    }
  }

  Spliton.init();
})();
