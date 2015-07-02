'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Attachment = (function (_React$Component) {
  function Attachment() {
    _classCallCheck(this, Attachment);

    _get(Object.getPrototypeOf(Attachment.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(Attachment, _React$Component);

  _createClass(Attachment, [{
    key: 'download',
    value: function download(file, e) {
      e.preventDefault();

      var progress = false;
      if (document.getElementById(file.key)) {
        progress = document.getElementById(file.key);
      }

      ajaxArrayBuffer({
        key: file.key,
        arrayBuffer: true,
        progress: progress,
        success: function success(data) {
          var blob = new Blob([data], {
            'type': file.type
          });
          var objecturl = URL.createObjectURL(blob);

          // 生成下载
          var anchor = document.createElement('a');
          anchor.href = objecturl;

          // 新标签页打开
          // anchor.target = '_blank';

          // 直接下载
          anchor.download = file.name;

          document.body.appendChild(anchor);
          var evt = document.createEvent('MouseEvents');
          evt.initEvent('click', true, true);
          anchor.dispatchEvent(evt);
          document.body.removeChild(anchor);

          if (progress) {
            progress.value = 0;
          }
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var x = this.props.data;
      var c;
      var inline = {
        display: 'inline-block'
      };
      var downloadIcon = {
        'display': 'block',
        'marginTop': '-17px',
        'marginRight': '1px',
        'cursor': 'pointer'
      };

      if (x.type === 'image/png' || x.type === 'image/jpeg' || x.type === 'image/vnd.microsoft.icon') {
        c = React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { name: 'enc-img', 'data-name': x.name, 'data-type': x.type, 'data-key': x.key },
            React.createElement('i', { className: 'fa fa-spinner fa-pulse fa-2x' })
          ),
          React.createElement('div', { className: 'fa fa-external-link right', style: downloadIcon, onClick: this.download.bind(this, x) })
        );
      } else {
        c = React.createElement(
          'div',
          { className: 'attachment' },
          React.createElement(File, { key: x.key, data: x, dragStart: this.props.dragStart, download: this.download.bind(this, x) })
        );
      }

      return React.createElement(
        'div',
        { style: inline },
        c
      );
    }
  }]);

  return Attachment;
})(React.Component);

var File = (function (_React$Component2) {
  function File() {
    _classCallCheck(this, File);

    _get(Object.getPrototypeOf(File.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(File, _React$Component2);

  _createClass(File, [{
    key: 'render',
    value: function render() {
      var x = this.props.data;

      // 省略过长的name
      var name = x.name;
      if (name.length > 14) {
        if (name.match(/[\u4e00-\u9fa5]/)) {
          name = name.substring(0, 14) + '...';
        } else {
          if (name.length > 24) {
            name = name.substring(0, 24) + '...';
          }
        }
      }

      return React.createElement(
        'div',
        null,
        React.createElement(
          'a',
          { className: 'item', title: x.name, 'data-key': x.key, draggable: 'true', onDragStart: this.props.dragStart, onClick: this.props.download },
          React.createElement('i', { className: fileTypeIcons(x.type) + ' fa-fw fa-lg' }),
          ' ',
          name,
          React.createElement(
            'span',
            { className: 'right' },
            x.size
          )
        ),
        React.createElement('div', { id: x.key, className: 'item progress-bar' })
      );
    }
  }]);

  return File;
})(React.Component);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Contents = (function (_React$Component) {
  function Contents(props) {
    _classCallCheck(this, Contents);

    _get(Object.getPrototypeOf(Contents.prototype), "constructor", this).call(this, props);
    this.state = { contents: [] };
  }

  _inherits(Contents, _React$Component);

  _createClass(Contents, [{
    key: "sort",
    value: function sort() {
      if (this.state.contents.length === 0) {

        // 返回新数组而不是引用
        var c = this.props.contents.slice(0);

        // if (this.props.auth) {
        //
        //   // 修改时间排序. !!!sort数组在原数组上进行排序
        //   c.sort(function(a, b){
        //     return b.timestamp - a.timestamp;
        //   });
        // } else {

        // 字母排序
        c.sort(function (a, b) {
          return a.title.localeCompare(b.title);
        });
        // }
        this.setState({ contents: c });
      } else {
        clearInterval(this.interval);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.interval = setInterval(this.sort.bind(this), 5);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearInterval(this.interval);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "wrap" },
        this.state.contents.map(function (x) {
          return React.createElement(
            "a",
            { className: "btn", key: x.id, href: "#/t/" + x.id, role: "button" },
            x.title
          );
        })
      );
    }
  }]);

  return Contents;
})(React.Component);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Editor = (function (_React$Component) {
  function Editor(props) {
    _classCallCheck(this, Editor);

    _get(Object.getPrototypeOf(Editor.prototype), 'constructor', this).call(this, props);
    this.state = { section: { id: '', title: '', content: '' } };
  }

  _inherits(Editor, _React$Component);

  _createClass(Editor, [{
    key: 'tick',
    value: function tick() {
      var paramsID = location.hash.slice(4);

      if (paramsID) {
        db.section.get(paramsID, (function (data) {
          if (data) {
            this.setState({ section: data });
            clearInterval(this.interval);
          }
        }).bind(this));
      } else {
        clearInterval(this.interval);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {

      // 等待cache完成
      this.interval = setInterval(this.tick.bind(this), 5);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearInterval(this.interval);
    }
  }, {
    key: 'handleTitleChange',
    value: function handleTitleChange(event) {
      var x = this.state.section;
      x.title = event.target.value;
      this.setState({ section: x });
    }
  }, {
    key: 'handleContentChange',
    value: function handleContentChange(event) {
      var x = this.state.section;
      x.content = event.target.value;
      this.setState({ section: x });
    }
  }, {
    key: 'uploadFileSuccess',
    value: function uploadFileSuccess(key, file) {
      var c = '\n![' + file.name + ',' + (file.size / 1024).toFixed(2) + 'KB,' + file.type + ',' + key + ']';

      var textarea = document.getElementById('content');
      insertText(textarea, c);

      var section = this.state.section;
      section.content = textarea.value;
      this.setState({ section: section });
    }
  }, {
    key: 'uploadSetToServer',
    value: function uploadSetToServer(e) {
      e.preventDefault();
      this.props.uploadSetToServer(this.state.section);
    }
  }, {
    key: 'render',
    value: function render() {
      var x = this.state.section;
      return React.createElement(
        'div',
        { className: 'wrap' },
        React.createElement(
          'form',
          { onSubmit: this.uploadSetToServer.bind(this) },
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement('input', { type: 'text', className: 'form-control', placeholder: 'key', onChange: this.handleTitleChange.bind(this), value: x.title })
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement('textarea', { id: 'content', className: 'form-control', rows: '17', placeholder: 'value', onChange: this.handleContentChange.bind(this), value: x.content })
          ),
          React.createElement(
            'button',
            { type: 'submit', className: 'btn insert right' },
            'Save'
          )
        ),
        React.createElement(InputFile, { uploadFolder: 'u/', uploadFileSuccess: this.uploadFileSuccess.bind(this) })
      );
    }
  }]);

  return Editor;
})(React.Component);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var InputFile = (function (_React$Component) {
  function InputFile(props) {
    _classCallCheck(this, InputFile);

    _get(Object.getPrototypeOf(InputFile.prototype), 'constructor', this).call(this, props);
    this.state = { i: 0 };
  }

  _inherits(InputFile, _React$Component);

  _createClass(InputFile, [{
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();

      var file = document.getElementById('file');
      var evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      file.dispatchEvent(evt);
    }
  }, {
    key: 'handleChange',
    value: function handleChange() {

      var files = document.getElementById('file').files;
      var i = this.state.i;

      if (i < files.length) {

        var j = i + 1;
        this.setState({ i: j });
        document.getElementById('file-info').innerHTML = files[i].name;
        this.readAndUpload(files[i]);
      } else {

        document.getElementById('file').value = '';
        document.getElementById('file-info').innerHTML = '选择文件上传';
        this.setState({ i: 0 });
      }
    }
  }, {
    key: 'readAndUpload',
    value: function readAndUpload(file) {
      var reader = new FileReader();
      reader.onload = (function (e) {

        var key = this.props.uploadFolder + timeDiff();

        upload({
          key: key,
          data: reader.result,
          arrayBuffer: true,
          progress: document.getElementById('upload-progress'),
          success: (function () {
            this.props.uploadFileSuccess(key, file);
            this.handleChange();
          }).bind(this)
        });
      }).bind(this);
      reader.readAsArrayBuffer(file);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'attachment' },
        React.createElement('input', { id: 'file', style: { display: 'none' }, type: 'file', multiple: true, onChange: this.handleChange.bind(this) }),
        React.createElement(
          'a',
          { id: 'file-info', className: 'item', onClick: this.handleClick },
          '选择文件上传'
        ),
        React.createElement('div', { id: 'upload-progress', className: 'item progress-bar' })
      );
    }
  }]);

  return InputFile;
})(React.Component);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Navbar = (function (_React$Component) {
  function Navbar() {
    _classCallCheck(this, Navbar);

    _get(Object.getPrototypeOf(Navbar.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(Navbar, _React$Component);

  _createClass(Navbar, [{
    key: 'handleIndexClick',
    value: function handleIndexClick(e) {
      e.preventDefault();
      this.refs.mainput.getDOMNode().value = '';
      location.href = '#/';
    }
  }, {
    key: 'handleLogoutClick',
    value: function handleLogoutClick(e) {
      e.preventDefault();
      this.props.logout();
    }
  }, {
    key: 'handleLoginClick',
    value: function handleLoginClick(e) {
      e.preventDefault();
      local = location.hash;
      location.href = '#/login';
    }
  }, {
    key: 'handleMainputChange',
    value: function handleMainputChange(e) {
      e.preventDefault();
      var mainput = this.refs.mainput.getDOMNode().value;
      if (mainput.length > 1) {
        location.href = '#/s/' + mainput;
      } else if (mainput === '') {
        location.href = '#/';
      }
    }
  }, {
    key: 'preventDefault',
    value: function preventDefault(e) {
      e.preventDefault();
    }
  }, {
    key: 'drop',
    value: function drop(e) {
      e.preventDefault();
      var key = e.dataTransfer.getData('key');
      if (key !== '') {
        upload({
          key: key,
          data: 'x',
          success: (function () {
            console.log('Erase!!!');
            successInfo('Erase!!!');
          }).bind(this)
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var button;
      if (this.props.auth) {
        button = React.createElement(
          'div',
          null,
          React.createElement(
            'a',
            { className: 'nav-site', href: '#/a' },
            React.createElement('span', { className: 'fa fa-plus', 'aria-hidden': 'true' })
          ),
          React.createElement(
            'div',
            { className: 'nav-site', onDragOver: this.preventDefault, onDrop: this.drop.bind(this) },
            React.createElement('span', { className: 'fa fa-trash-o', 'aria-hidden': 'true' })
          ),
          React.createElement('span', { className: 'nav-site' }),
          React.createElement(
            'a',
            { className: 'nav-site', onClick: this.handleLogoutClick.bind(this) },
            React.createElement('span', { className: 'fa fa-sign-out', 'aria-hidden': 'true' })
          )
        );
      } else {
        button = React.createElement(
          'div',
          null,
          React.createElement(
            'a',
            { className: 'nav-site', onClick: this.handleLoginClick.bind(this) },
            React.createElement('span', { className: 'fa fa-sign-in', 'aria-hidden': 'true' })
          )
        );
      }

      return React.createElement(
        'nav',
        { className: 'nav-main' },
        React.createElement(
          'div',
          { className: 'wrap' },
          React.createElement(
            'a',
            { className: 'nav-site nav-title', onClick: this.handleIndexClick.bind(this) },
            siteTitle
          ),
          React.createElement(
            'form',
            { className: 'nav-form left', role: 'search', onSubmit: this.handleMainputChange.bind(this) },
            React.createElement('input', { type: 'text', className: 'form-control mainput', ref: 'mainput', onChange: this.handleMainputChange.bind(this) })
          ),
          React.createElement(
            'div',
            { className: 'right nav-right' },
            button
          )
        )
      );
    }
  }]);

  return Navbar;
})(React.Component);
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Root = (function (_React$Component) {
  function Root(props) {
    _classCallCheck(this, Root);

    _get(Object.getPrototypeOf(Root.prototype), 'constructor', this).call(this, props);
    this.state = { version: 0, contents: [], set: [], auth: false, url: location.hash, erase: false };
  }

  _inherits(Root, _React$Component);

  _createClass(Root, [{
    key: 'loadSetFromServer',

    // load and cache
    value: function loadSetFromServer() {
      ajaxArrayBuffer({
        key: 'set/' + this.state.version,
        success: (function (data) {

          var contents = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = data.set[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var x = _step.value;

              var t = {
                id: x.id,
                title: x.title,
                timestamp: x.timestamp
              };
              contents.push(t);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          this.setState({ contents: contents });
          this.setState({ set: data.set });

          this.cacheToIndexedDB();
          refresh = true;
        }).bind(this)
      });
    }
  }, {
    key: 'cacheToIndexedDB',
    value: function cacheToIndexedDB() {
      var v = this.state.version;
      db.etc.put({ 'id': 'version', 'version': v });
      db.contents.put({ 'id': v, 'arr': this.state.contents });
      db.set.put({ 'id': v, 'arr': this.state.set });
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.state.set[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var x = _step2.value;

          db.section.put(x).then(function () {
            refresh = true;
          });
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'loadSetFromIndexedDB',
    value: function loadSetFromIndexedDB() {
      var v = this.state.version;
      db.contents.get(v, (function (data) {
        this.setState({ contents: data.arr });
      }).bind(this));
      db.set.get(v, (function (data) {
        this.setState({ set: data.arr });
      }).bind(this));
    }
  }, {
    key: 'cache',
    value: function cache() {
      ajaxArrayBuffer({
        key: 'version',
        success: (function (data) {
          this.setState({ version: data.version });

          db.etc.get('version', (function (data) {
            if (data) {
              if (data.version === this.state.version) {
                console.log('LoadSetFromIndexedDB');
                this.loadSetFromIndexedDB();
              } else {
                console.log('LoadSetFromServer');
                this.loadSetFromServer();
              }
            } else {
              console.log('LoadSetFromServer');
              this.loadSetFromServer();
            }
          }).bind(this));
        }).bind(this)
      });
    }
  }, {
    key: 'handleUploadSetToServer',

    // post to database server
    value: function handleUploadSetToServer(data) {
      if (data.title !== '') {

        var version = this.state.version + 1;
        var contents = this.state.contents;
        var set = this.state.set;

        var t = {
          id: data.id,
          title: data.title,
          timestamp: Date.now()
        };

        if (t.id === '') {
          t.id = timeDiff();
          contents.push(t);
          t.content = data.content;
          set.push(t);
        } else {
          for (var i in contents) {
            if (t.id === contents[i].id) {
              contents[i] = t;
              t.content = data.content;
              set[i] = t;
            }
          }
        }

        this.setState({ version: version });
        this.setState({ contents: contents });
        this.setState({ set: set });

        db.section.put(t);
        db.etc.put({ 'id': 'version', 'version': version });
        db.contents.put({ 'id': version, 'arr': contents });
        db.set.put({ 'id': version, 'arr': set });

        upload({
          key: 'set/' + version,
          data: JSON.stringify({ set: set }),
          success: function success() {

            upload({
              key: 'version',
              data: JSON.stringify({ version: version }),
              success: function success() {
                console.log('Save!!!');
                location.href = '#/t/' + t.id;
              }
            });
          }
        });
      }
    }
  }, {
    key: 'handleLogin',
    value: function handleLogin() {
      this.setState({ auth: true });
      if (local === '#/login') {
        location.href = '#/';
      } else {
        location.href = local;
      }
    }
  }, {
    key: 'handleLogout',
    value: function handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.setState({ auth: false });
      location.replace('#/');
    }
  }, {
    key: 'auth',
    value: function auth() {
      if (localStorage.token) {
        this.setState({ auth: true });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      this.auth();
      this.cache();
      window.onhashchange = function () {
        return _this.setState({ url: location.hash });
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var page;
      switch (this.state.url.split('/')[1]) {
        case 't':
        case 's':
          page = React.createElement(Section, this.state);
          break;
        case 'a':
        case 'e':
          page = React.createElement(Editor, _extends({}, this.state, { uploadSetToServer: this.handleUploadSetToServer.bind(this) }));
          break;
        case 'login':
          page = React.createElement(SignIn, _extends({}, this.state, { login: this.handleLogin.bind(this) }));
          break;
        case 'join':
          page = React.createElement(SignUp, this.state);
          break;
        default:
          page = React.createElement(Contents, this.state);
          break;
      }

      return React.createElement(
        'div',
        null,
        React.createElement(Navbar, { auth: this.state.auth, logout: this.handleLogout.bind(this) }),
        page
      );
    }
  }]);

  return Root;
})(React.Component);

// React.render(<Root />, document.getElementById('wrapper'));
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Section = (function (_React$Component) {
  function Section(props) {
    _classCallCheck(this, Section);

    _get(Object.getPrototypeOf(Section.prototype), 'constructor', this).call(this, props);
    this.state = { section: [], keyword: '' };
  }

  _inherits(Section, _React$Component);

  _createClass(Section, [{
    key: 'dragStart',
    value: function dragStart(e) {
      var key = e.target.dataset.key;
      e.dataTransfer.setData('key', key);
    }
  }, {
    key: 'loadIMG',
    value: function loadIMG(data) {
      ajaxArrayBuffer({
        key: data.dataset.key,
        arrayBuffer: true,
        success: (function (rep) {

          var blob = new Blob([rep], { 'type': data.dataset.type });
          var objecturl = URL.createObjectURL(blob);

          var img = document.createElement('img');
          img.src = objecturl;
          img.title = data.dataset.name;

          img.dataset.key = data.dataset.key;
          img.ondragstart = this.dragStart;

          data.replaceChild(img, data.firstElementChild);
          data.setAttribute('name', 'dec-img');
        }).bind(this)
      });
    }
  }, {
    key: 'imgEvent',
    value: function imgEvent() {
      var encIMG = document.getElementsByName('enc-img');
      // console.log('a');
      for (var i = 0; i < encIMG.length; i++) {
        var _top = encIMG[i].getBoundingClientRect().top;
        if (_top > 0 && _top < window.innerHeight) {
          this.loadIMG(encIMG[i]);
        }
      }
    }
  }, {
    key: 'query',
    value: function query() {

      var params = {
        id: '',
        keyword: ''
      };
      if (location.hash.slice(2, 3) === 't') {
        params.id = location.hash.slice(4);
      } else {
        params.keyword = location.hash.slice(4);
      }

      if (params.id !== '') {
        // console.log('*****ID');
        if (refresh) {
          console.log('Index');
          db.section.get(params.id, (function (data) {
            if (data) {
              this.setState({ section: [data] });
              refresh = false;
              if (document.getElementsByName('enc-img').length !== 0) {
                this.imgEvent();

                // 滚动加载图片
                window.onscroll = this.imgEvent.bind(this);
              } else {
                window.onscroll = null;
              }
            }
          }).bind(this));
        }
      } else if (params.keyword !== '') {
        // console.log('*****Qu');

        // [] is ture!!!
        if (this.props.set.length !== 0) {
          var keyword = params.keyword;
          if (keyword !== this.state.keyword || refresh) {
            console.log('Query');
            var query = [];
            var s = new RegExp(keyword, 'i');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = this.props.set[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var x = _step.value;

                if (x.title.match(s) !== null || x.content.match(s) !== null) {
                  query.push(x);
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                  _iterator['return']();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            this.setState({ section: query });
            this.setState({ keyword: keyword });
            refresh = false;
            if (document.getElementsByName('enc-img').length !== 0) {
              this.imgEvent();
              window.onscroll = this.imgEvent.bind(this);
            } else {
              window.onscroll = null;
            }
          }
        }
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      refresh = true;
      this.query();

      // 脏检查,等待cache完成,检查keyword变化
      this.interval = setInterval(this.query.bind(this), 200);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearInterval(this.interval);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        this.state.section.map((function (x) {
          return React.createElement(Fragment, { key: x.id, data: x, auth: this.props.auth, dragStart: this.dragStart.bind(this) });
        }).bind(this))
      );
    }
  }]);

  return Section;
})(React.Component);

var Fragment = (function (_React$Component2) {
  function Fragment() {
    _classCallCheck(this, Fragment);

    _get(Object.getPrototypeOf(Fragment.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(Fragment, _React$Component2);

  _createClass(Fragment, [{
    key: 'render',
    value: function render() {
      var x = this.props.data;
      var title = React.createElement(
        'h1',
        null,
        x.title
      );
      if (this.props.auth) {
        title = React.createElement(
          'h1',
          null,
          React.createElement(
            'a',
            { href: '#/e/' + x.id, title: '编辑' },
            x.title
          )
        );
      }

      // 处理Markdown文本中 ![name, type, size, key] 标记
      var parts = x.content.split(/(!\[.*?,.*?,.*?,.*?\])/);
      for (var i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          if (parts[i] !== '') {
            var rawMarkup = md.render(parts[i]);
            parts[i] = React.createElement('section', { dangerouslySetInnerHTML: { __html: rawMarkup } });
          }
        } else {
          var m = parts[i].match(/!\[(.*?),(.*?),(.*?),(.*?)\]/);

          var data = {
            name: m[1],
            size: m[2],
            type: m[3],
            key: m[4]
          };
          parts[i] = React.createElement(Attachment, { data: data, dragStart: this.props.dragStart });
        }
      }

      return React.createElement(
        'div',
        null,
        React.createElement(
          'article',
          { className: 'wrap' },
          title,
          parts
        ),
        React.createElement('hr', null)
      );
    }
  }]);

  return Fragment;
})(React.Component);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var SignIn = (function (_React$Component) {
  function SignIn() {
    _classCallCheck(this, SignIn);

    _get(Object.getPrototypeOf(SignIn.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(SignIn, _React$Component);

  _createClass(SignIn, [{
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      e.preventDefault();

      var name = this.refs.name.getDOMNode().value;
      var passwd = this.refs.passwd.getDOMNode().value;

      ajaxArrayBuffer({
        key: name,
        token: passwd,
        success: (function (data) {

          localStorage.token = data.user.token;
          localStorage.user = JSON.stringify(data.user);

          this.props.login();
          this.refs.name.getDOMNode().value = '';
          this.refs.passwd.getDOMNode().value = '';
        }).bind(this)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'wrap' },
        React.createElement(
          'form',
          { onSubmit: this.handleSubmit.bind(this) },
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'inputName3' },
              'Name'
            ),
            React.createElement('input', { type: 'text', className: 'form-control', id: 'inputName3', ref: 'name' })
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'inputPassword3' },
              'Password'
            ),
            React.createElement('input', { type: 'password', className: 'form-control', id: 'inputPassword3', ref: 'passwd' })
          ),
          React.createElement(
            'button',
            { type: 'submit', className: 'btn' },
            'Sign in'
          )
        )
      );
    }
  }]);

  return SignIn;
})(React.Component);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var SignUp = (function (_React$Component) {
  function SignUp() {
    _classCallCheck(this, SignUp);

    _get(Object.getPrototypeOf(SignUp.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(SignUp, _React$Component);

  _createClass(SignUp, [{
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      e.preventDefault();

      var name = this.refs.name.getDOMNode().value;
      var passwd = this.refs.passwd.getDOMNode().value;
      var token = this.refs.token.getDOMNode().value;
      var AK = this.refs.AK.getDOMNode().value;
      var SK = this.refs.SK.getDOMNode().value;

      var user = { AK: AK, SK: SK, token: token };

      localStorage.token = token;
      localStorage.user = JSON.stringify(user);

      upload({
        key: name,
        data: JSON.stringify({ user: user }),
        token: passwd,
        success: (function () {
          console.log('Success!');
          successInfo('Success!!!');
        }).bind(this)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'wrap' },
        React.createElement(
          'form',
          { onSubmit: this.handleSubmit.bind(this) },
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'inputName3' },
              'Name'
            ),
            React.createElement('input', { type: 'text', className: 'form-control', id: 'inputName3', ref: 'name' })
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'inputPassword3' },
              'Password'
            ),
            React.createElement('input', { type: 'text', className: 'form-control', id: 'inputPassword3', ref: 'passwd' })
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'token' },
              'Token'
            ),
            React.createElement('input', { type: 'text', className: 'form-control', id: 'token', ref: 'token' })
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'AK' },
              'AK'
            ),
            React.createElement('input', { type: 'text', className: 'form-control', id: 'AK', ref: 'AK' })
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'SK' },
              'SK'
            ),
            React.createElement('input', { type: 'text', className: 'form-control', id: 'SK', ref: 'SK' })
          ),
          React.createElement(
            'button',
            { type: 'submit', className: 'btn' },
            'Sign up'
          )
        )
      );
    }
  }]);

  return SignUp;
})(React.Component);
/**
 * - 存储为单文件（方便缓存、搜索）
 * - 存储文章和上传文件一样post
 * - 标题排序（字母排序，修改时间排序）
 * - 文件整体加密，云端存储格式(new Blob([ArrayBuffer]))
 * - scrollLoad with decrypt
 * - 多种文件格式的显示
 * - js文件合并压缩
 *
 * - es6
 * ! simplify function names
 * ! 用 for(var i = 0; i < a.length; i++) 取代 for(var i in a)
 */

// 返回登录前页面
'use strict';

var local = '#/';

// 异步缓存时 传递刷新条件
var refresh = false;

// Markdown
var md = window.markdownit({
  html: true,
  breaks: true,
  linkify: true
});

/*
 * ajax
 * or use Promise
 */
function ajaxArrayBuffer(opts) {
  'use strict';
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {

        var res = xhr.response;
        if (encrypt || opts.token) {
          var token = opts.token ? opts.token : localStorage.token;
          res = asmCrypto.AES_CBC.decrypt(xhr.response, token).buffer;
        }

        if (opts.arrayBuffer) {
          opts.success(res);
        } else {
          var str = utf8ArrToStr(new Uint8Array(res));
          opts.success(JSON.parse(str));
        }
      }
    }
  };
  if (opts.progress) {
    xhr.onprogress = function (e) {
      if (e.lengthComputable) {
        if (e.loaded === e.total) {
          // opts.progress.innerHTML = (e.total / 1024).toFixed(2) + 'KB';
          opts.progress.style.width = '0%';
        } else {
          // opts.progress.innerHTML = ((e.loaded / e.total) * 100).toFixed(2) + '%';
          opts.progress.style.width = (e.loaded / e.total * 100).toFixed(2) + '%';
        }
      }
    };
  }

  if (opts.key.match('version') !== null) {
    opts.key += '?v=' + Date.now();
  }

  xhr.open('GET', url + opts.key, true);

  // in firefox xhr.responseType must behind xhr.open
  xhr.responseType = 'arraybuffer';

  xhr.send(null);
}

function upload(opts) {
  'use strict';

  if (!opts.arrayBuffer) {
    opts.data = strToUTF8Arr(opts.data).buffer;
  }

  if (encrypt || opts.token) {
    var token = opts.token ? opts.token : localStorage.token;

    // opts.data can be ArrayBuffer or Uint8Array. strings will garbled characters.
    opts.data = asmCrypto.AES_CBC.encrypt(opts.data, token).buffer;
  }

  // new Blob([encList.buffer]) fast than new Blob([encList]) type不是必需的
  var blob = new Blob([opts.data]);

  var formData = customForm(opts, blob);

  var xhr = new XMLHttpRequest();

  if (opts.progress) {
    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        if (e.loaded === e.total) {
          opts.progress.style.width = '0%';
        } else {
          opts.progress.style.width = (e.loaded / e.total * 100).toFixed(2) + '%';
        }
      }
    };
  }

  xhr.onload = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
        opts.success();
      }
    }
  };

  xhr.open('POST', 'http://upload.qiniu.com', true);
  xhr.send(formData);
}

function customForm(opts, blob) {
  'use strict';

  var user = JSON.parse(localStorage.user);
  var AK = user.AK;
  var SK = user.SK;

  var policyJson = {
    'scope': bucket + ':' + opts.key,
    'deadline': 3600 + Math.floor(Date.now() / 1000)
  };
  var policy = btoa(JSON.stringify(policyJson));
  var signature = asmCrypto.HMAC_SHA1.base64(policy, SK);

  var formData = new FormData();
  formData.append('token', AK + ':' + safe64(signature) + ':' + policy);

  formData.append('key', opts.key);

  // 文件或文本内容，必须是表单中的最后一个域。
  formData.append('file', blob);

  return formData;
}

function safe64(base64) {
  base64 = base64.replace(/\+/g, '-');
  base64 = base64.replace(/\//g, '_');
  return base64;
}

function insertText(obj, str) {
  if (document.selection) {
    var sel = document.selection.createRange();
    sel.text = str;
  } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
    var startPos = obj.selectionStart,
        endPos = obj.selectionEnd,
        cursorPos = startPos,
        tmpStr = obj.value;
    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
    cursorPos += str.length;
    obj.selectionStart = obj.selectionEnd = cursorPos;
  } else {
    obj.value += str;
  }
}

/*
 * File Type Icons
 */
function fileTypeIcons(type) {
  switch (type) {
    case 'image/png':
    case 'image/jpeg':
    case 'image/vnd.microsoft.icon':
      return 'fa fa-file-image-o';
    case 'application/x-xz':
    case 'application/gzip':
    case 'application/zip':
      return 'fa fa-file-archive-o';
    case 'text/plain':
    case 'text/x-markdown':
      return 'fa fa-file-text-o';
    case 'application/pdf':
      return 'fa fa-file-pdf-o';
    case 'application/msword':
    case 'application/vnd.oasis.opendocument.text':
      return 'fa fa-file-word-o';
    default:
      return 'fa fa-file-o';
  }
}

function successInfo(info) {
  'use strict';

  var div = document.createElement('div');
  div.innerHTML = '<div id="success-info">' + info + '</div>';
  document.body.appendChild(div);

  var tick = setTimeout(function () {
    document.body.removeChild(div);
    clearTimeout(tick);
  }, 700);

  // var a = 1;
  // var tick = setInterval(function(){
  //   if (a > 0) {
  //     document.getElementById('success-info').style.backgroundColor = `rgba(86, 61, 124, ${a})`;
  //     // document.getElementById('success-info').style.backgroundColor = `rgba(0, 112, 149, ${a})`;
  //     a = a - 2;
  //   } else {
  //     clearInterval(tick);
  //     document.body.removeChild(div);
  //   }
  // }, 700);
}

function timeDiff() {
  return Date.now() + '' + Math.floor(Math.random() * 9000 + 1000); // 或加入IP
}

// function arrayBufferToStr(buf) {
//   'use strict';
//   return String.fromCharCode.apply(null, new Uint16Array(buf));
// }
//
// function strToArrayBuffer(str) {
//   'use strict';
//
//   var buf = new ArrayBuffer(str.length * 2);
//   var bufView = new Uint16Array(buf);
//   for (let i = 0, strLen = str.length; i < strLen; i++) {
//     bufView[i] = str.charCodeAt(i);
//   }
//   return buf;
// }

/*\
|*|
|*|  Base64 / binary data / UTF-8 strings utilities
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
|*|
|*|
|*| var Base64 = function(s){
|*|   var utf8 = strToUTF8Arr(s);
|*|   return base64EncArr(utf8);
|*| };
\*/

/* UTF-8 array to DOMString and vice versa */

function utf8ArrToStr(aBytes) {

  var sView = '';

  for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
    nPart = aBytes[nIdx];
    sView += String.fromCharCode(nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
    /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
    (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
    (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
    (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
    (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
    (nPart - 192 << 6) + aBytes[++nIdx] - 128 : /* nPart < 127 ? */ /* one byte */
    nPart);
  }

  return sView;
}

function strToUTF8Arr(sDOMStr) {

  var aBytes,
      nChr,
      nStrLen = sDOMStr.length,
      nArrLen = 0;

  /* mapping... */

  for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
    nChr = sDOMStr.charCodeAt(nMapIdx);
    nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
  }

  aBytes = new Uint8Array(nArrLen);

  /* transcription... */

  for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
    nChr = sDOMStr.charCodeAt(nChrIdx);
    if (nChr < 128) {
      /* one byte */
      aBytes[nIdx++] = nChr;
    } else if (nChr < 0x800) {
      /* two bytes */
      aBytes[nIdx++] = 192 + (nChr >>> 6);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x10000) {
      /* three bytes */
      aBytes[nIdx++] = 224 + (nChr >>> 12);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x200000) {
      /* four bytes */
      aBytes[nIdx++] = 240 + (nChr >>> 18);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x4000000) {
      /* five bytes */
      aBytes[nIdx++] = 248 + (nChr >>> 24);
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else /* if (nChr <= 0x7fffffff) */{
        /* six bytes */
        aBytes[nIdx++] = 252 + (nChr >>> 30);
        aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
        aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
        aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
        aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
        aBytes[nIdx++] = 128 + (nChr & 63);
      }
  }

  return aBytes;
}