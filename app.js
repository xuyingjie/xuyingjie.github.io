"use strict";function ajaxArrayBuffer(e){var t=new XMLHttpRequest;t.onload=function(){if(4===t.readyState&&(t.status>=200&&t.status<300||304===t.status)){var n=e.token?e.token:e.encrypt?localStorage.token:publicKey,o=asmCrypto.AES_CBC.decrypt(t.response,n);if(console.log("AES.decrypt"),e.uint8Arr)e.success(o);else{var r=UTF8ArrToStr(o);e.success(JSON.parse(r))}}},e.progress&&(t.onprogress=function(t){t.lengthComputable&&(e.progress.innerHTML=t.loaded===t.total?(t.total/1024).toFixed(2)+"KB":(t.loaded/t.total*100).toFixed(2)+"%")}),t.open("GET",url+e.key,!0),t.responseType="arraybuffer",t.send(null)}function upload(e){var t=e.token?e.token:e.encrypt?localStorage.token:publicKey,n=asmCrypto.AES_CBC.encrypt(e.data,t);console.log("AES.encrypt");var o=new Blob([n.buffer],{type:"application/octet-stream"}),r=customForm(e,o),a=new XMLHttpRequest;e.progress&&(a.upload.onprogress=function(t){t.lengthComputable&&(e.progress.value=t.loaded/t.total*100)}),a.onload=function(){4===a.readyState&&(a.status>=200&&a.status<300||304==a.status)&&e.success()},a.open("POST",url,!0),a.send(r)}function customForm(e,t){var n=JSON.parse(localStorage.user),o=n.AK,r=n.SK,a={expiration:new Date(Date.now()+36e5).toJSON(),conditions:[{bucket:bucket},["eq","$key",e.key]]},s=btoa(JSON.stringify(a)),c=asmCrypto.HMAC_SHA1.base64(s,r),i=new FormData;return i.append("OSSAccessKeyId",o),i.append("policy",s),i.append("signature",c),null!==e.key.match("version")||"folder/list"===e.key?i.append("Cache-Control","no-cache"):i.append("Cache-Control","public,max-age=8640000"),i.append("key",e.key),i.append("file",t),i}function insertText(e,t){if(document.selection){var n=document.selection.createRange();n.text=t}else if("number"==typeof e.selectionStart&&"number"==typeof e.selectionEnd){var o=e.selectionStart,r=e.selectionEnd,a=o,s=e.value;e.value=s.substring(0,o)+t+s.substring(r,s.length),a+=t.length,e.selectionStart=e.selectionEnd=a}else e.value+=t}function fileTypeIcons(e){switch(e){case"image/png":case"image/jpeg":case"image/vnd.microsoft.icon":return"fa fa-file-image-o";case"application/x-xz":case"application/gzip":case"application/zip":return"fa fa-file-archive-o";case"text/plain":case"text/x-markdown":return"fa fa-file-text-o";case"application/pdf":return"fa fa-file-pdf-o";case"application/msword":case"application/vnd.oasis.opendocument.text":return"fa fa-file-word-o";default:return"fa fa-file-o"}}function nDown(e,t,n,o){var r=document.getElementById(n);ajaxArrayBuffer({key:n,encrypt:o,uint8Arr:!0,progress:r,success:function(n){var o=new Blob([n.buffer],{type:t}),a=URL.createObjectURL(o),s=document.createElement("a");s.href=a,s.download=e,document.body.appendChild(s);var c=document.createEvent("MouseEvents");c.initEvent("click",!0,!0),s.dispatchEvent(c),document.body.removeChild(s),r.value=0}})}function timeDiff(){return Date.now()+""+Math.floor(9e3*Math.random()+1e3)}function UTF8ArrToStr(e){for(var t,n="",o=e.length,r=0;o>r;r++)t=e[r],n+=String.fromCharCode(t>251&&254>t&&o>r+5?1073741824*(t-252)+(e[++r]-128<<24)+(e[++r]-128<<18)+(e[++r]-128<<12)+(e[++r]-128<<6)+e[++r]-128:t>247&&252>t&&o>r+4?(t-248<<24)+(e[++r]-128<<18)+(e[++r]-128<<12)+(e[++r]-128<<6)+e[++r]-128:t>239&&248>t&&o>r+3?(t-240<<18)+(e[++r]-128<<12)+(e[++r]-128<<6)+e[++r]-128:t>223&&240>t&&o>r+2?(t-224<<12)+(e[++r]-128<<6)+e[++r]-128:t>191&&224>t&&o>r+1?(t-192<<6)+e[++r]-128:t);return n}function strToUTF8Arr(e){for(var t,n,o=e.length,r=0,a=0;o>a;a++)n=e.charCodeAt(a),r+=128>n?1:2048>n?2:65536>n?3:2097152>n?4:67108864>n?5:6;t=new Uint8Array(r);for(var s=0,c=0;r>s;c++)n=e.charCodeAt(c),128>n?t[s++]=n:2048>n?(t[s++]=192+(n>>>6),t[s++]=128+(63&n)):65536>n?(t[s++]=224+(n>>>12),t[s++]=128+(n>>>6&63),t[s++]=128+(63&n)):2097152>n?(t[s++]=240+(n>>>18),t[s++]=128+(n>>>12&63),t[s++]=128+(n>>>6&63),t[s++]=128+(63&n)):67108864>n?(t[s++]=248+(n>>>24),t[s++]=128+(n>>>18&63),t[s++]=128+(n>>>12&63),t[s++]=128+(n>>>6&63),t[s++]=128+(63&n)):(t[s++]=252+(n>>>30),t[s++]=128+(n>>>24&63),t[s++]=128+(n>>>18&63),t[s++]=128+(n>>>12&63),t[s++]=128+(n>>>6&63),t[s++]=128+(63&n));return t}var siteTitle="Structure",bucket="structure",publicKey="GmPw2qjmTsAAUsqa",url="http://"+bucket+".oss-cn-beijing.aliyuncs.com/",local="#/",refresh=!1,db=new Dexie(bucket);db.version(1).stores({etc:"id, version"}),db.version(1).stores({contents:"id, arr"}),db.version(1).stores({set:"id, arr"}),db.version(1).stores({section:"id, title, content, timestamp"}),db.open();
"use strict";var _createClass=function(){function e(e,a){for(var t in a){var n=a[t];n.configurable=!0,n.value&&(n.writable=!0)}Object.defineProperties(e,a)}return function(a,t,n){return t&&e(a.prototype,t),n&&e(a,n),a}}(),_inherits=function(e,a){if("function"!=typeof a&&null!==a)throw new TypeError("Super expression must either be null or a function, not "+typeof a);e.prototype=Object.create(a&&a.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),a&&(e.__proto__=a)},_classCallCheck=function(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")},Navbar=function(e){function a(){_classCallCheck(this,a),null!=e&&e.apply(this,arguments)}return _inherits(a,e),_createClass(a,{handleIndexClick:{value:function(e){e.preventDefault(),this.refs.mainput.getDOMNode().value="",location.href="#/"}},handleLogoutClick:{value:function(e){e.preventDefault(),this.props.logout()}},handleLoginClick:{value:function(e){e.preventDefault(),local=location.hash,location.href="#/login"}},handleMainputChange:{value:function(e){e.preventDefault();var a=this.refs.mainput.getDOMNode().value;a.length>1?location.href="#/s/"+a:""===a&&(location.href="#/")}},render:{value:function(){var e;return e=this.props.auth?React.createElement("div",null,React.createElement("a",{className:"navbar-brand",href:"#/a"},React.createElement("span",{className:"fa fa-plus","aria-hidden":"true"})),React.createElement("a",{className:"navbar-brand",href:"#/tasks"},React.createElement("span",{className:"fa fa-tasks","aria-hidden":"true"})),React.createElement("a",{className:"navbar-brand",href:"#/folder"},React.createElement("span",{className:"fa fa-folder","aria-hidden":"true"})),React.createElement("span",{className:"navbar-brand"}),React.createElement("a",{className:"navbar-brand",href:!0,onClick:this.handleLogoutClick.bind(this)},React.createElement("span",{className:"fa fa-sign-out","aria-hidden":"true"}))):React.createElement("div",null,React.createElement("a",{className:"navbar-brand",href:!0,onClick:this.handleLoginClick.bind(this)},React.createElement("span",{className:"fa fa-sign-in","aria-hidden":"true"}))),React.createElement("nav",{className:"navbar navbar-default"},React.createElement("div",{className:"container-fluid"},React.createElement("a",{className:"navbar-brand custom-title",href:!0,onClick:this.handleIndexClick.bind(this)},siteTitle),React.createElement("form",{className:"navbar-form navbar-left",role:"search",onSubmit:this.handleMainputChange.bind(this)},React.createElement("input",{type:"text",className:"form-control mainput",ref:"mainput",onChange:this.handleMainputChange.bind(this)})),React.createElement("div",{className:"navbar-right"},e)))}}}),a}(React.Component);
"use strict";var _createClass=function(){function t(t,e){for(var n in e){var r=e[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(t,e)}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),_get=function t(e,n,r){var o=Object.getOwnPropertyDescriptor(e,n);if(void 0===o){var i=Object.getPrototypeOf(e);return null===i?void 0:t(i,n,r)}if("value"in o&&o.writable)return o.value;var a=o.get;return void 0===a?void 0:a.call(r)},_inherits=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(t.__proto__=e)},_classCallCheck=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},Contents=function(t){function e(t){_classCallCheck(this,e),_get(Object.getPrototypeOf(e.prototype),"constructor",this).call(this,t),this.state={contents:[]}}return _inherits(e,t),_createClass(e,{sort:{value:function(){if(0===this.state.contents.length){var t=this.props.contents.slice(0);t.sort(this.props.auth?function(t,e){return e.timestamp-t.timestamp}:function(t,e){return t.title.localeCompare(e.title)}),this.setState({contents:t})}else clearInterval(this.interval)}},componentDidMount:{value:function(){this.interval=setInterval(this.sort.bind(this),5)}},componentWillUnmount:{value:function(){clearInterval(this.interval)}},render:{value:function(){return React.createElement("div",{className:"container-fluid"},this.state.contents.map(function(t){return React.createElement("a",{className:"btn btn-default",key:t.id,href:"#/t/"+t.id,role:"button"},t.title)}))}}}),e}(React.Component);
"use strict";var _createClass=function(){function e(e,t){for(var n in t){var r=t[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(e,t)}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),_get=function e(t,n,r){var i=Object.getOwnPropertyDescriptor(t,n);if(void 0===i){var o=Object.getPrototypeOf(t);return null===o?void 0:e(o,n,r)}if("value"in i&&i.writable)return i.value;var a=i.get;return void 0===a?void 0:a.call(r)},_inherits=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(e.__proto__=t)},_classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},Section=function(e){function t(e){_classCallCheck(this,t),_get(Object.getPrototypeOf(t.prototype),"constructor",this).call(this,e),this.state={section:[],keyword:""}}return _inherits(t,e),_createClass(t,{loadIMG:{value:function(e){ajaxArrayBuffer({key:e.dataset.key,encrypt:!1,uint8Arr:!0,success:function(t){var n=new Blob([t.buffer],{type:e.dataset.type}),r=URL.createObjectURL(n),i=document.createElement("img");i.src=r,e.replaceChild(i,e.firstElementChild),e.setAttribute("name","dec-img")}})}},imgEvent:{value:function(){for(var e=document.getElementsByName("enc-img"),t=0;t<e.length;t++){var n=e[t].getBoundingClientRect().top;n>0&&n<window.innerHeight&&this.loadIMG(e[t])}}},query:{value:function(e){var t=function(){return e.apply(this,arguments)};return t.toString=function(){return e.toString()},t}(function(){var e={id:"",keyword:""};if("t"===location.hash.slice(2,3)?e.id=location.hash.slice(4):e.keyword=location.hash.slice(4),""!==e.id)refresh&&(console.log("Index"),db.section.get(e.id,function(e){e&&(this.setState({section:[e]}),refresh=!1,this.imgEvent(),window.onscroll=this.imgEvent.bind(this))}.bind(this)));else if(""!==e.keyword&&0!==this.props.set.length){var t=e.keyword;if(t!==this.state.keyword||refresh){console.log("Query");var n=[],r=new RegExp(t,"i"),i=!0,o=!1,a=void 0;try{for(var l,c=this.props.set[Symbol.iterator]();!(i=(l=c.next()).done);i=!0){var s=l.value;(null!==s.title.match(r)||null!==s.content.match(r))&&n.push(s)}}catch(u){o=!0,a=u}finally{try{!i&&c["return"]&&c["return"]()}finally{if(o)throw a}}this.setState({section:n}),this.setState({keyword:t}),refresh=!1,this.imgEvent(),window.onscroll=this.imgEvent.bind(this)}}})},componentDidMount:{value:function(){refresh=!0,this.query(),this.interval=setInterval(this.query.bind(this),200)}},componentWillUnmount:{value:function(){clearInterval(this.interval)}},render:{value:function(){return React.createElement("div",null,this.state.section.map(function(e){var t=React.createElement("div",null);this.props.auth&&(t=React.createElement("a",{className:"label label-default",href:"#/e/"+e.id},"编辑"));var n=new Showdown.converter,r=n.makeHtml(e.content);return React.createElement("div",null,React.createElement("div",{className:"container-fluid"},React.createElement("h2",null,e.title),React.createElement("span",{dangerouslySetInnerHTML:{__html:r}}),t),React.createElement("hr",null))}.bind(this)))}}}),t}(React.Component);
"use strict";var _createClass=function(){function e(e,t){for(var a in t){var n=t[a];n.configurable=!0,n.value&&(n.writable=!0)}Object.defineProperties(e,t)}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),_inherits=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(e.__proto__=t)},_classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},SignIn=function(e){function t(){_classCallCheck(this,t),null!=e&&e.apply(this,arguments)}return _inherits(t,e),_createClass(t,{handleSubmit:{value:function(e){e.preventDefault();var t=this.refs.name.getDOMNode().value,a=this.refs.passwd.getDOMNode().value;ajaxArrayBuffer({key:t,token:a,success:function(e){localStorage.token=e.user.token,localStorage.user=JSON.stringify(e.user),this.props.login(),this.refs.name.getDOMNode().value="",this.refs.passwd.getDOMNode().value=""}.bind(this)})}},render:{value:function(){return React.createElement("div",{className:"container-fluid"},React.createElement("div",{className:"row"},React.createElement("div",{className:"col-sm-5"},React.createElement("form",{onSubmit:this.handleSubmit.bind(this)},React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"inputName3"},"Name"),React.createElement("input",{type:"text",className:"form-control",id:"inputName3",ref:"name"})),React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"inputPassword3"},"Password"),React.createElement("input",{type:"password",className:"form-control",id:"inputPassword3",ref:"passwd"})),React.createElement("button",{type:"submit",className:"btn btn-default"},"Sign in")))))}}}),t}(React.Component);
"use strict";var _createClass=function(){function e(e,t){for(var a in t){var r=t[a];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(e,t)}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),_inherits=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(e.__proto__=t)},_classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},SignUp=function(e){function t(){_classCallCheck(this,t),null!=e&&e.apply(this,arguments)}return _inherits(t,e),_createClass(t,{handleSubmit:{value:function(e){e.preventDefault();var t=this.refs.name.getDOMNode().value,a=this.refs.passwd.getDOMNode().value,r=this.refs.token.getDOMNode().value,n=this.refs.AK.getDOMNode().value,c=this.refs.SK.getDOMNode().value,l={AK:n,SK:c,token:r};localStorage.token=r,localStorage.user=JSON.stringify(l),upload({key:t,data:strToUTF8Arr(JSON.stringify({user:l})),token:a,success:function(){console.log("Success!"),this.refs.status.getDOMNode().value="Success!"}.bind(this)})}},render:{value:function(){return React.createElement("div",{className:"container-fluid"},React.createElement("div",{className:"row"},React.createElement("div",{className:"col-sm-5"},React.createElement("form",{onSubmit:this.handleSubmit.bind(this)},React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"inputName3"},"Name"),React.createElement("input",{type:"text",className:"form-control",id:"inputName3",ref:"name"})),React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"inputPassword3"},"Password"),React.createElement("input",{type:"text",className:"form-control",id:"inputPassword3",ref:"passwd"})),React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"token"},"Token"),React.createElement("input",{type:"text",className:"form-control",id:"token",ref:"token"})),React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"AK"},"AK"),React.createElement("input",{type:"text",className:"form-control",id:"AK",ref:"AK"})),React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"SK"},"SK"),React.createElement("input",{type:"text",className:"form-control",id:"SK",ref:"SK"})),React.createElement("button",{type:"submit",className:"btn btn-default"},"Sign up"))),React.createElement("div",{className:"col-sm-5"},React.createElement("textarea",{ref:"status"}))))}}}),t}(React.Component);
"use strict";var _createClass=function(){function e(e,t){for(var n in t){var a=t[n];a.configurable=!0,a.value&&(a.writable=!0)}Object.defineProperties(e,t)}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),_get=function e(t,n,a){var i=Object.getOwnPropertyDescriptor(t,n);if(void 0===i){var r=Object.getPrototypeOf(t);return null===r?void 0:e(r,n,a)}if("value"in i&&i.writable)return i.value;var o=i.get;return void 0===o?void 0:o.call(a)},_inherits=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(e.__proto__=t)},_classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},Editor=function(e){function t(e){_classCallCheck(this,t),_get(Object.getPrototypeOf(t.prototype),"constructor",this).call(this,e),this.state={section:{id:"",title:"",content:""}}}return _inherits(t,e),_createClass(t,{tick:{value:function(){var e=location.hash.slice(4);e?db.section.get(e,function(e){e&&(this.setState({section:e}),clearInterval(this.interval))}.bind(this)):clearInterval(this.interval)}},componentDidMount:{value:function(){this.interval=setInterval(this.tick.bind(this),5)}},componentWillUnmount:{value:function(){clearInterval(this.interval)}},handleTitleChange:{value:function(e){var t=this.state.section;t.title=e.target.value,this.setState({section:t})}},handleContentChange:{value:function(e){var t=this.state.section;t.content=e.target.value,this.setState({section:t})}},uploadFile:{value:function(e){e.preventDefault();var t=document.getElementById("file").files[0],n=new FileReader;n.onload=function(){var e="u/"+timeDiff(),a=document.getElementById("upload-progress");upload({key:e,data:n.result,encrypt:!1,progress:a,success:function(){var n="";n="image/png"===t.type||"image/jpeg"===t.type||"image/vnd.microsoft.icon"===t.type?'\n<span name="enc-img" data-name="'+t.name+'" data-type="'+t.type+'" data-key="'+e+'"><i class="fa fa-spinner fa-pulse fa-2x"></i></span>\n':'\n<a class="btn btn-default" onclick="nDown(\''+t.name+"','"+t.type+"','"+e+'\',false)">\n<i class="'+fileTypeIcons(t.type)+' fa-lg"></i>&nbsp;'+t.name+'&nbsp;<span id="'+e+'">'+(t.size/1024).toFixed(2)+"KB</span></a>\n";var i=document.getElementById("content");insertText(i,n);var r=this.state.section;r.content=i.value,this.setState({section:r}),document.getElementById("file").value="",a.value=0}.bind(this)})}.bind(this),n.readAsArrayBuffer(t)}},uploadSetToServer:{value:function(e){e.preventDefault(),this.props.uploadSetToServer(this.state.section)}},render:{value:function(){var e=this.state.section;return React.createElement("div",{className:"container-fluid"},React.createElement("form",{onSubmit:this.uploadSetToServer.bind(this)},React.createElement("div",{className:"form-group"},React.createElement("input",{type:"text",className:"form-control",placeholder:"key",onChange:this.handleTitleChange.bind(this),value:e.title})),React.createElement("div",{className:"form-group"},React.createElement("textarea",{id:"content",className:"form-control",rows:"17",placeholder:"value",onChange:this.handleContentChange.bind(this),value:e.content})),React.createElement("button",{type:"submit",className:"btn btn-default pull-right"},"Save")),React.createElement("form",{encType:"multipart/form-data",onSubmit:this.uploadFile.bind(this)},React.createElement("input",{id:"file",type:"file",required:!0,accept:!0}),React.createElement("button",{type:"submit",className:"btn btn-default"},"Insert")),React.createElement("progress",{id:"upload-progress",min:"0",max:"100",value:"0"},"0"))}}}),t}(React.Component);
"use strict";var _createClass=function(){function e(e,t){for(var n in t){var r=t[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(e,t)}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),_get=function e(t,n,r){var a=Object.getOwnPropertyDescriptor(t,n);if(void 0===a){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in a&&a.writable)return a.value;var o=a.get;return void 0===o?void 0:o.call(r)},_inherits=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(e.__proto__=t)},_classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},Folder=function(e){function t(e){_classCallCheck(this,t),_get(Object.getPrototypeOf(t.prototype),"constructor",this).call(this,e),this.state={list:[]}}return _inherits(t,e),_createClass(t,{componentDidMount:{value:function(){ajaxArrayBuffer({key:"folder/list",encrypt:!0,success:function(e){this.setState({list:e.list})}.bind(this)})}},download:{value:function(e){nDown(e.name,e.type,e.key,!0)}},uploadFile:{value:function(e){e.preventDefault();var t=document.getElementById("file").files[0],n=new FileReader;n.onload=function(){var e="folder/"+timeDiff();upload({key:e,data:n.result,encrypt:!0,progress:document.getElementById("upload-progress"),success:function(){var n={key:e,name:t.name,type:t.type,size:t.size},r=this.state.list;r.push(n),upload({key:"folder/list",data:strToUTF8Arr(JSON.stringify({list:r})),encrypt:!0,success:function(){console.log("Upload!!!"),this.setState({list:r}),document.getElementById("file").value="",document.getElementById("upload-progress").value=0}.bind(this)})}.bind(this)})}.bind(this),n.readAsArrayBuffer(t)}},render:{value:function(){var e=this.state.list.slice(0).reverse();return React.createElement("div",{className:"container-fluid"},React.createElement("form",{encType:"multipart/form-data",onSubmit:this.uploadFile.bind(this)},React.createElement("input",{id:"file",type:"file",required:!0,accept:!0}),React.createElement("button",{type:"submit",className:"btn btn-default"},"Insert")),React.createElement("progress",{id:"upload-progress",min:"0",max:"100",value:"0"},"0"),React.createElement("ul",{className:"list-group"},e.map(function(e){return React.createElement("a",{className:"list-group-item",href:"#/folder",onClick:this.download.bind(this,e)},React.createElement("i",{className:fileTypeIcons(e.type)+" fa-fw fa-lg"})," ",e.name,React.createElement("span",{id:e.key,className:"pull-right"},(e.size/1024).toFixed(2)+"KB"))}.bind(this))))}}}),t}(React.Component);
"use strict";var _createClass=function(){function t(t,e){for(var s in e){var a=e[s];a.configurable=!0,a.value&&(a.writable=!0)}Object.defineProperties(t,e)}return function(e,s,a){return s&&t(e.prototype,s),a&&t(e,a),e}}(),_get=function t(e,s,a){var n=Object.getOwnPropertyDescriptor(e,s);if(void 0===n){var r=Object.getPrototypeOf(e);return null===r?void 0:t(r,s,a)}if("value"in n&&n.writable)return n.value;var i=n.get;return void 0===i?void 0:i.call(a)},_inherits=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(t.__proto__=e)},_classCallCheck=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},Tasks=function(t){function e(t){_classCallCheck(this,e),_get(Object.getPrototypeOf(e.prototype),"constructor",this).call(this,t),this.state={version:0,tasks:[],query:[],editID:""}}return _inherits(e,t),_createClass(e,{loadTasks:{value:function(){ajaxArrayBuffer({key:"tasks/"+this.state.version,encrypt:!0,success:function(t){this.setState({tasks:t.tasks}),this.setState({query:t.tasks})}.bind(this)})}},componentDidMount:{value:function(){ajaxArrayBuffer({key:"tasks/version",encrypt:!0,success:function(t){this.setState({version:t.version}),this.loadTasks()}.bind(this)})}},handleChange:{value:function(t){var e=t.target.value,s=[],a=new RegExp(e,"i"),n=!0,r=!1,i=void 0;try{for(var o,c=this.state.tasks[Symbol.iterator]();!(n=(o=c.next()).done);n=!0){var l=o.value;null!==l.content.match(a)&&s.push(l)}}catch(u){r=!0,i=u}finally{try{!n&&c["return"]&&c["return"]()}finally{if(r)throw i}}this.setState({query:s})}},handleEdit:{value:function(t){this.setState({editID:t.id}),this.refs.content.getDOMNode().value=t.content}},save:{value:function(t){if(t.preventDefault(),""!==this.refs.content.getDOMNode().value){var e=this.state.version+1,s=this.state.tasks;if(""!==this.state.editID)for(var a in s)this.state.editID===s[a].id&&(s.splice(a,1),this.setState({editID:""}));var n={id:timeDiff(),content:this.refs.content.getDOMNode().value};s.push(n),upload({key:"tasks/"+e,data:strToUTF8Arr(JSON.stringify({tasks:s})),encrypt:!0,success:function(){upload({key:"tasks/version",data:strToUTF8Arr(JSON.stringify({version:e})),encrypt:!0,success:function(){this.setState({version:e}),this.setState({query:s}),this.refs.content.getDOMNode().value=""}.bind(this)})}.bind(this)})}}},render:{value:function(){var t=this.state.query.slice(0).reverse();return React.createElement("div",{className:"container-fluid"},React.createElement("form",{onSubmit:this.save.bind(this)},React.createElement("div",{className:"form-group"},React.createElement("input",{type:"text",className:"form-control tasks",placeholder:"tasks",onChange:this.handleChange.bind(this),ref:"content"}))),t.map(function(t){return React.createElement("div",{className:"tasks-margin"},React.createElement("span",{className:"tasks"},t.content," ",React.createElement("a",{href:"#/tasks",onClick:this.handleEdit.bind(this,t)},React.createElement("i",{className:"fa fa-pencil"}))))}.bind(this)))}}}),e}(React.Component);
"use strict";var _createClass=function(){function t(t,e){for(var a in e){var n=e[a];n.configurable=!0,n.value&&(n.writable=!0)}Object.defineProperties(t,e)}return function(e,a,n){return a&&t(e.prototype,a),n&&t(e,n),e}}(),_get=function t(e,a,n){var r=Object.getOwnPropertyDescriptor(e,a);if(void 0===r){var s=Object.getPrototypeOf(e);return null===s?void 0:t(s,a,n)}if("value"in r&&r.writable)return r.value;var i=r.get;return void 0===i?void 0:i.call(n)},_inherits=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(t.__proto__=e)},_classCallCheck=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},Root=function(t){function e(t){_classCallCheck(this,e),_get(Object.getPrototypeOf(e.prototype),"constructor",this).call(this,t),this.state={version:0,contents:[],set:[],auth:!1,url:location.hash}}return _inherits(e,t),_createClass(e,{loadSetFromServer:{value:function(){ajaxArrayBuffer({key:"set/"+this.state.version,encrypt:!1,success:function(t){var e=[],a=!0,n=!1,r=void 0;try{for(var s,i=t.set[Symbol.iterator]();!(a=(s=i.next()).done);a=!0){var o=s.value,c={id:o.id,title:o.title,timestamp:o.timestamp};e.push(c)}}catch(l){n=!0,r=l}finally{try{!a&&i["return"]&&i["return"]()}finally{if(n)throw r}}this.setState({contents:e}),this.setState({set:t.set}),this.cacheToIndexedDB(),refresh=!0}.bind(this)})}},cacheToIndexedDB:{value:function(){var t=this.state.version;db.etc.put({id:"version",version:t}),db.contents.put({id:t,arr:this.state.contents}),db.set.put({id:t,arr:this.state.set});var e=!0,a=!1,n=void 0;try{for(var r,s=this.state.set[Symbol.iterator]();!(e=(r=s.next()).done);e=!0){var i=r.value;db.section.put(i).then(function(){refresh=!0})}}catch(o){a=!0,n=o}finally{try{!e&&s["return"]&&s["return"]()}finally{if(a)throw n}}}},loadSetFromIndexedDB:{value:function(){var t=this.state.version;db.contents.get(t,function(t){this.setState({contents:t.arr})}.bind(this)),db.set.get(t,function(t){this.setState({set:t.arr})}.bind(this))}},cache:{value:function(){ajaxArrayBuffer({key:"version",encrypt:!1,success:function(t){this.setState({version:t.version}),db.etc.get("version",function(t){t&&t.version===this.state.version?(console.log("LoadSetFromIndexedDB"),this.loadSetFromIndexedDB()):(console.log("LoadSetFromServer"),this.loadSetFromServer())}.bind(this))}.bind(this)})}},handleUploadSetToServer:{value:function(t){if(""!==t.title){var e=this.state.version+1,a=this.state.contents,n=this.state.set,r={id:t.id,title:t.title,timestamp:Date.now()};if(""===r.id)r.id=timeDiff(),a.push(r),r.content=t.content,n.push(r);else for(var s in a)r.id===a[s].id&&(a[s]=r,r.content=t.content,n[s]=r);this.setState({version:e}),this.setState({contents:a}),this.setState({set:n}),db.section.put(r),db.etc.put({id:"version",version:e}),db.contents.put({id:e,arr:a}),db.set.put({id:e,arr:n}),upload({key:"set/"+e,data:strToUTF8Arr(JSON.stringify({set:n})),encrypt:!1,success:function(){upload({key:"version",data:strToUTF8Arr(JSON.stringify({version:e})),encrypt:!1,success:function(){console.log("Save!!!"),location.href="#/t/"+r.id}})}})}}},handleLogin:{value:function(){this.setState({auth:!0}),location.href=local}},handleLogout:{value:function(){localStorage.removeItem("token"),localStorage.removeItem("user"),this.setState({auth:!1}),location.replace("#/")}},auth:{value:function(){localStorage.token&&this.setState({auth:!0})}},componentDidMount:{value:function(){var t=this;this.auth(),this.cache(),window.onhashchange=function(){return t.setState({url:location.hash})}}},render:{value:function(){var t;switch(this.state.url.split("/")[1]){case"t":case"s":t=React.createElement("div",null,React.createElement(Navbar,{auth:this.state.auth,logout:this.handleLogout.bind(this)}),React.createElement(Section,React.__spread({},this.state)));break;case"a":case"e":t=React.createElement("div",null,React.createElement(Navbar,{auth:this.state.auth,logout:this.handleLogout.bind(this)}),React.createElement(Editor,React.__spread({},this.state,{uploadSetToServer:this.handleUploadSetToServer.bind(this)})));break;case"login":t=React.createElement("div",null,React.createElement(Navbar,{auth:this.state.auth,logout:this.handleLogout.bind(this)}),React.createElement(SignIn,React.__spread({},this.state,{login:this.handleLogin.bind(this)})));break;case"join":t=React.createElement("div",null,React.createElement(Navbar,{auth:this.state.auth,logout:this.handleLogout.bind(this)}),React.createElement(SignUp,React.__spread({},this.state)));break;case"folder":t=React.createElement("div",null,React.createElement(Navbar,{auth:this.state.auth,logout:this.handleLogout.bind(this)}),React.createElement(Folder,React.__spread({},this.state)));break;case"tasks":t=React.createElement("div",null,React.createElement(Navbar,{auth:this.state.auth,logout:this.handleLogout.bind(this)}),React.createElement(Tasks,React.__spread({},this.state)));break;default:t=React.createElement("div",null,React.createElement(Navbar,{auth:this.state.auth,logout:this.handleLogout.bind(this)}),React.createElement(Contents,React.__spread({},this.state)))}return React.createElement("div",null,t)}}}),e}(React.Component);React.render(React.createElement(Root,null),document.body);