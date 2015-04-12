"use strict";function ajaxArrayBuffer(e){var t=new XMLHttpRequest;t.onload=function(){if(4===t.readyState&&(t.status>=200&&t.status<300||304===t.status)){var o=e.token?e.token:e.open?publicKey:localStorage.token,a=asmCrypto.AES_CBC.decrypt(t.response,o);if(console.log("AES.decrypt"),e.uint8Arr)e.success(a);else{var n=utf8ArrToStr(a);e.success(JSON.parse(n))}}},e.progress&&(t.onprogress=function(t){t.lengthComputable&&(e.progress.style.width=t.loaded===t.total?"0%":(t.loaded/t.total*100).toFixed(2)+"%")}),(null!==e.key.match("version")||"folder/list"===e.key)&&(e.key+="?v="+Date.now()),t.open("GET","http://7teaz4.com1.z0.glb.clouddn.com/"+e.key,!0),t.responseType="arraybuffer",t.send(null)}function upload(e){var t=e.token?e.token:e.open?publicKey:localStorage.token,o=asmCrypto.AES_CBC.encrypt(e.data,t);console.log("AES.encrypt");var a=new Blob([o.buffer],{type:"application/octet-stream"}),n=customForm(e,a),r=new XMLHttpRequest;e.progress&&(r.upload.onprogress=function(t){t.lengthComputable&&(e.progress.value=t.loaded/t.total*100)}),r.onload=function(){4===r.readyState&&(r.status>=200&&r.status<300||304==r.status)&&e.success()},r.open("POST","http://upload.qiniu.com",!0),r.send(n)}function customForm(e,t){var o=JSON.parse(localStorage.user),a=o.AK,n=o.SK,r={scope:bucket+":"+e.key,deadline:3600+Math.floor(Date.now()/1e3)},s=btoa(JSON.stringify(r)),c=asmCrypto.HMAC_SHA1.base64(s,n),i=new FormData;return i.append("token",a+":"+safe64(c)+":"+s),i.append("key",e.key),i.append("file",t),i}function safe64(e){return e=e.replace(/\+/g,"-"),e=e.replace(/\//g,"_")}function insertText(e,t){if(document.selection){var o=document.selection.createRange();o.text=t}else if("number"==typeof e.selectionStart&&"number"==typeof e.selectionEnd){var a=e.selectionStart,n=e.selectionEnd,r=a,s=e.value;e.value=s.substring(0,a)+t+s.substring(n,s.length),r+=t.length,e.selectionStart=e.selectionEnd=r}else e.value+=t}function fileTypeIcons(e){switch(e){case"image/png":case"image/jpeg":case"image/vnd.microsoft.icon":return"fa fa-file-image-o";case"application/x-xz":case"application/gzip":case"application/zip":return"fa fa-file-archive-o";case"text/plain":case"text/x-markdown":return"fa fa-file-text-o";case"application/pdf":return"fa fa-file-pdf-o";case"application/msword":case"application/vnd.oasis.opendocument.text":return"fa fa-file-word-o";default:return"fa fa-file-o"}}function nDown(e,t,o,a){var n=document.getElementById(o);ajaxArrayBuffer({key:o,open:a,uint8Arr:!0,progress:n,success:function(o){var a=new Blob([o.buffer],{type:t}),r=URL.createObjectURL(a),s=document.createElement("a");s.href=r,s.download=e,document.body.appendChild(s);var c=document.createEvent("MouseEvents");c.initEvent("click",!0,!0),s.dispatchEvent(c),document.body.removeChild(s),n.value=0}})}function dragStart(e){e.dataTransfer.setData("key",e.target.dataset.key)}function timeDiff(){return Date.now()+""+Math.floor(9e3*Math.random()+1e3)}function utf8ArrToStr(e){for(var t,o="",a=e.length,n=0;a>n;n++)t=e[n],o+=String.fromCharCode(t>251&&254>t&&a>n+5?1073741824*(t-252)+(e[++n]-128<<24)+(e[++n]-128<<18)+(e[++n]-128<<12)+(e[++n]-128<<6)+e[++n]-128:t>247&&252>t&&a>n+4?(t-248<<24)+(e[++n]-128<<18)+(e[++n]-128<<12)+(e[++n]-128<<6)+e[++n]-128:t>239&&248>t&&a>n+3?(t-240<<18)+(e[++n]-128<<12)+(e[++n]-128<<6)+e[++n]-128:t>223&&240>t&&a>n+2?(t-224<<12)+(e[++n]-128<<6)+e[++n]-128:t>191&&224>t&&a>n+1?(t-192<<6)+e[++n]-128:t);return o}function strToUTF8Arr(e){for(var t,o,a=e.length,n=0,r=0;a>r;r++)o=e.charCodeAt(r),n+=128>o?1:2048>o?2:65536>o?3:2097152>o?4:67108864>o?5:6;t=new Uint8Array(n);for(var s=0,c=0;n>s;c++)o=e.charCodeAt(c),128>o?t[s++]=o:2048>o?(t[s++]=192+(o>>>6),t[s++]=128+(63&o)):65536>o?(t[s++]=224+(o>>>12),t[s++]=128+(o>>>6&63),t[s++]=128+(63&o)):2097152>o?(t[s++]=240+(o>>>18),t[s++]=128+(o>>>12&63),t[s++]=128+(o>>>6&63),t[s++]=128+(63&o)):67108864>o?(t[s++]=248+(o>>>24),t[s++]=128+(o>>>18&63),t[s++]=128+(o>>>12&63),t[s++]=128+(o>>>6&63),t[s++]=128+(63&o)):(t[s++]=252+(o>>>30),t[s++]=128+(o>>>24&63),t[s++]=128+(o>>>18&63),t[s++]=128+(o>>>12&63),t[s++]=128+(o>>>6&63),t[s++]=128+(63&o));return t}var siteTitle="Structure",bucket="proc",publicKey="GmPw2qjmTsAAUsqa",open=!0,local="#/",refresh=!1,db=new Dexie(bucket);db.version(1).stores({etc:"id, version"}),db.version(1).stores({contents:"id, arr"}),db.version(1).stores({set:"id, arr"}),db.version(1).stores({section:"id, title, content, timestamp"}),db.open();
"use strict";function Navbar(){null!==____Class4&&____Class4.apply(this,arguments)}var ____Class4=React.Component;for(var ____Class4____Key in ____Class4)____Class4.hasOwnProperty(____Class4____Key)&&(Navbar[____Class4____Key]=____Class4[____Class4____Key]);var ____SuperProtoOf____Class4=null===____Class4?null:____Class4.prototype;Navbar.prototype=Object.create(____SuperProtoOf____Class4),Navbar.prototype.constructor=Navbar,Navbar.__superConstructor__=____Class4,Object.defineProperty(Navbar.prototype,"handleIndexClick",{writable:!0,configurable:!0,value:function(e){e.preventDefault(),this.refs.mainput.getDOMNode().value="",location.href="#/"}}),Object.defineProperty(Navbar.prototype,"handleLogoutClick",{writable:!0,configurable:!0,value:function(e){e.preventDefault(),this.props.logout()}}),Object.defineProperty(Navbar.prototype,"handleLoginClick",{writable:!0,configurable:!0,value:function(e){e.preventDefault(),local=location.hash,location.href="#/login"}}),Object.defineProperty(Navbar.prototype,"handleMainputChange",{writable:!0,configurable:!0,value:function(e){e.preventDefault();var a=this.refs.mainput.getDOMNode().value;a.length>1?location.href="#/s/"+a:""===a&&(location.href="#/")}}),Object.defineProperty(Navbar.prototype,"preventDefault",{writable:!0,configurable:!0,value:function(e){e.preventDefault()}}),Object.defineProperty(Navbar.prototype,"drop",{writable:!0,configurable:!0,value:function(e){e.preventDefault();var a=e.dataTransfer.getData("key");""!==a&&this.props.erase(a)}}),Object.defineProperty(Navbar.prototype,"render",{writable:!0,configurable:!0,value:function(){var e;return e=this.props.auth?React.createElement("div",null,React.createElement("a",{className:"nav-site",href:"#/a"},React.createElement("span",{className:"fa fa-plus","aria-hidden":"true"})),React.createElement("a",{className:"nav-site",href:"#/tasks"},React.createElement("span",{className:"fa fa-tasks","aria-hidden":"true"})),React.createElement("a",{className:"nav-site",href:"#/folder"},React.createElement("span",{className:"fa fa-folder","aria-hidden":"true"})),React.createElement("div",{className:"nav-site",onDragOver:this.preventDefault,onDrop:this.drop.bind(this)},React.createElement("span",{className:"fa fa-trash-o","aria-hidden":"true"})),React.createElement("span",{className:"nav-site"}),React.createElement("a",{className:"nav-site",href:!0,onClick:this.handleLogoutClick.bind(this)},React.createElement("span",{className:"fa fa-sign-out","aria-hidden":"true"}))):React.createElement("div",null,React.createElement("a",{className:"nav-site",href:!0,onClick:this.handleLoginClick.bind(this)},React.createElement("span",{className:"fa fa-sign-in","aria-hidden":"true"}))),React.createElement("nav",{className:"nav-main"},React.createElement("div",{className:"wrap"},React.createElement("a",{className:"nav-site nav-title",href:!0,onClick:this.handleIndexClick.bind(this)},siteTitle),React.createElement("form",{className:"nav-form left",role:"search",onSubmit:this.handleMainputChange.bind(this)},React.createElement("input",{type:"text",className:"form-control mainput",ref:"mainput",onChange:this.handleMainputChange.bind(this)})),React.createElement("div",{className:"right nav-right"},e)))}});
"use strict";function Contents(t){____Class0.call(this,t),this.state={contents:[]}}var ____Class0=React.Component;for(var ____Class0____Key in ____Class0)____Class0.hasOwnProperty(____Class0____Key)&&(Contents[____Class0____Key]=____Class0[____Class0____Key]);var ____SuperProtoOf____Class0=null===____Class0?null:____Class0.prototype;Contents.prototype=Object.create(____SuperProtoOf____Class0),Contents.prototype.constructor=Contents,Contents.__superConstructor__=____Class0,Object.defineProperty(Contents.prototype,"sort",{writable:!0,configurable:!0,value:function(){if(0===this.state.contents.length){var t=this.props.contents.slice(0);t.sort(this.props.auth?function(t,e){return e.timestamp-t.timestamp}:function(t,e){return t.title.localeCompare(e.title)}),this.setState({contents:t})}else clearInterval(this.interval)}}),Object.defineProperty(Contents.prototype,"componentDidMount",{writable:!0,configurable:!0,value:function(){this.interval=setInterval(this.sort.bind(this),5)}}),Object.defineProperty(Contents.prototype,"componentWillUnmount",{writable:!0,configurable:!0,value:function(){clearInterval(this.interval)}}),Object.defineProperty(Contents.prototype,"render",{writable:!0,configurable:!0,value:function(){return React.createElement("div",{className:"container-fluid"},this.state.contents.map(function(t){return React.createElement("a",{className:"btn",key:t.id,href:"#/t/"+t.id,role:"button"},t.title)}))}});
"use strict";function Section(e){____Class2O.call(this,e),this.state={section:[],keyword:""}}function Fragment(){null!==____Class2P&&____Class2P.apply(this,arguments)}function HelloWorld(){null!==____Class2Q&&____Class2Q.apply(this,arguments)}function Attachment(){null!==____Class2R&&____Class2R.apply(this,arguments)}var ____Class2O=React.Component;for(var ____Class2O____Key in ____Class2O)____Class2O.hasOwnProperty(____Class2O____Key)&&(Section[____Class2O____Key]=____Class2O[____Class2O____Key]);var ____SuperProtoOf____Class2O=null===____Class2O?null:____Class2O.prototype;Section.prototype=Object.create(____SuperProtoOf____Class2O),Section.prototype.constructor=Section,Section.__superConstructor__=____Class2O,Object.defineProperty(Section.prototype,"loadIMG",{writable:!0,configurable:!0,value:function(e){ajaxArrayBuffer({key:e.dataset.key,open:open,uint8Arr:!0,success:function(t){var _=new Blob([t.buffer],{type:e.dataset.type}),r=URL.createObjectURL(_),a=document.createElement("img");a.src=r,a.dataset.key=e.dataset.key,a.ondragstart=dragStart,e.replaceChild(a,e.firstElementChild),e.setAttribute("name","dec-img")}})}}),Object.defineProperty(Section.prototype,"imgEvent",{writable:!0,configurable:!0,value:function(){var e=document.getElementsByName("enc-img");console.log("a");for(var t=0;t<e.length;t++){var _=e[t].getBoundingClientRect().top;_>0&&_<window.innerHeight&&this.loadIMG(e[t])}}}),Object.defineProperty(Section.prototype,"query",{writable:!0,configurable:!0,value:function(){var e={id:"",keyword:""};if("t"===location.hash.slice(2,3)?e.id=location.hash.slice(4):e.keyword=location.hash.slice(4),""!==e.id)refresh&&(console.log("Index"),db.section.get(e.id,function(e){e&&(this.setState({section:[e]}),refresh=!1,this.imgEvent(),window.onscroll=this.imgEvent.bind(this))}.bind(this)));else if(""!==e.keyword&&0!==this.props.set.length){var t=e.keyword;if(t!==this.state.keyword||refresh){console.log("Query");var _=[],r=new RegExp(t,"i"),a=!0,s=!1,l=void 0;try{for(var n,o=this.props.set[Symbol.iterator]();!(a=(n=o.next()).done);a=!0){var i=n.value;(null!==i.title.match(r)||null!==i.content.match(r))&&_.push(i)}}catch(c){s=!0,l=c}finally{try{!a&&o["return"]&&o["return"]()}finally{if(s)throw l}}this.setState({section:_}),this.setState({keyword:t}),refresh=!1,this.imgEvent(),window.onscroll=this.imgEvent.bind(this)}}}}),Object.defineProperty(Section.prototype,"componentDidMount",{writable:!0,configurable:!0,value:function(){refresh=!0,this.query(),this.interval=setInterval(this.query.bind(this),200)}}),Object.defineProperty(Section.prototype,"componentWillUnmount",{writable:!0,configurable:!0,value:function(){clearInterval(this.interval)}}),Object.defineProperty(Section.prototype,"render",{writable:!0,configurable:!0,value:function(){return React.createElement("div",null,this.state.section.map(function(e){return React.createElement(Fragment,{key:e.id,data:e,auth:this.props.auth})}.bind(this)))}});var ____Class2P=React.Component;for(var ____Class2P____Key in ____Class2P)____Class2P.hasOwnProperty(____Class2P____Key)&&(Fragment[____Class2P____Key]=____Class2P[____Class2P____Key]);var ____SuperProtoOf____Class2P=null===____Class2P?null:____Class2P.prototype;Fragment.prototype=Object.create(____SuperProtoOf____Class2P),Fragment.prototype.constructor=Fragment,Fragment.__superConstructor__=____Class2P,Object.defineProperty(Fragment.prototype,"render",{writable:!0,configurable:!0,value:function(){var e=this.props.data,t=React.createElement("div",null);this.props.auth&&(t=React.createElement("a",{className:"label label-default",href:"#/e/"+e.id},"编辑"));for(var _=new Showdown.converter,r=_.makeHtml(e.content),a=r.split(/(!\{.*?\})/),s=0;s<a.length;s++)s%2===0?""!==a[s]&&(a[s]=React.createElement("div",{dangerouslySetInnerHTML:{__html:a[s]}})):a[s]=React.createElement(HelloWorld,null);return React.createElement("div",null,React.createElement("div",{className:"container-fluid"},React.createElement("h2",null,e.title),a,t),React.createElement("hr",null))}});var ____Class2Q=React.Component;for(var ____Class2Q____Key in ____Class2Q)____Class2Q.hasOwnProperty(____Class2Q____Key)&&(HelloWorld[____Class2Q____Key]=____Class2Q[____Class2Q____Key]);var ____SuperProtoOf____Class2Q=null===____Class2Q?null:____Class2Q.prototype;HelloWorld.prototype=Object.create(____SuperProtoOf____Class2Q),HelloWorld.prototype.constructor=HelloWorld,HelloWorld.__superConstructor__=____Class2Q,Object.defineProperty(HelloWorld.prototype,"render",{writable:!0,configurable:!0,value:function(){return React.createElement("h1",null,"Hello World")}});var ____Class2R=React.Component;for(var ____Class2R____Key in ____Class2R)____Class2R.hasOwnProperty(____Class2R____Key)&&(Attachment[____Class2R____Key]=____Class2R[____Class2R____Key]);var ____SuperProtoOf____Class2R=null===____Class2R?null:____Class2R.prototype;Attachment.prototype=Object.create(____SuperProtoOf____Class2R),Attachment.prototype.constructor=Attachment,Attachment.__superConstructor__=____Class2R,Object.defineProperty(Attachment.prototype,"render",{writable:!0,configurable:!0,value:function(){var e=this.props.data;return React.createElement("div",{className:"btn-w"},React.createElement("div",{className:"btn progress-btn","data-key":e.key,draggable:"true"},React.createElement("i",{className:"fa fa-file-o fa-lg"})," ",e.name,React.createElement("span",{className:"right"},e.size)),React.createElement("div",{id:e.key,className:"progress-btn-bar"}))}});
"use strict";function SignIn(){null!==____Class8&&____Class8.apply(this,arguments)}var ____Class8=React.Component;for(var ____Class8____Key in ____Class8)____Class8.hasOwnProperty(____Class8____Key)&&(SignIn[____Class8____Key]=____Class8[____Class8____Key]);var ____SuperProtoOf____Class8=null===____Class8?null:____Class8.prototype;SignIn.prototype=Object.create(____SuperProtoOf____Class8),SignIn.prototype.constructor=SignIn,SignIn.__superConstructor__=____Class8,Object.defineProperty(SignIn.prototype,"handleSubmit",{writable:!0,configurable:!0,value:function(e){e.preventDefault();var t=this.refs.name.getDOMNode().value,a=this.refs.passwd.getDOMNode().value;ajaxArrayBuffer({key:t,token:a,success:function(e){localStorage.token=e.user.token,localStorage.user=JSON.stringify(e.user),this.props.login(),this.refs.name.getDOMNode().value="",this.refs.passwd.getDOMNode().value=""}.bind(this)})}}),Object.defineProperty(SignIn.prototype,"render",{writable:!0,configurable:!0,value:function(){return React.createElement("div",{className:"container-fluid"},React.createElement("form",{onSubmit:this.handleSubmit.bind(this)},React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"inputName3"},"Name"),React.createElement("input",{type:"text",className:"form-control",id:"inputName3",ref:"name"})),React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"inputPassword3"},"Password"),React.createElement("input",{type:"password",className:"form-control",id:"inputPassword3",ref:"passwd"})),React.createElement("button",{type:"submit",className:"btn"},"Sign in")))}});
"use strict";function SignUp(){null!==____Class9&&____Class9.apply(this,arguments)}var ____Class9=React.Component;for(var ____Class9____Key in ____Class9)____Class9.hasOwnProperty(____Class9____Key)&&(SignUp[____Class9____Key]=____Class9[____Class9____Key]);var ____SuperProtoOf____Class9=null===____Class9?null:____Class9.prototype;SignUp.prototype=Object.create(____SuperProtoOf____Class9),SignUp.prototype.constructor=SignUp,SignUp.__superConstructor__=____Class9,Object.defineProperty(SignUp.prototype,"handleSubmit",{writable:!0,configurable:!0,value:function(e){e.preventDefault();var t=this.refs.name.getDOMNode().value,a=this.refs.passwd.getDOMNode().value,r=this.refs.token.getDOMNode().value,s=this.refs.AK.getDOMNode().value,l=this.refs.SK.getDOMNode().value,n={AK:s,SK:l,token:r};localStorage.token=r,localStorage.user=JSON.stringify(n),upload({key:t,data:strToUTF8Arr(JSON.stringify({user:n})),token:a,success:function(){console.log("Success!"),this.refs.status.getDOMNode().value="Success!"}.bind(this)})}}),Object.defineProperty(SignUp.prototype,"render",{writable:!0,configurable:!0,value:function(){return React.createElement("div",{className:"container-fluid"},React.createElement("form",{onSubmit:this.handleSubmit.bind(this)},React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"inputName3"},"Name"),React.createElement("input",{type:"text",className:"form-control",id:"inputName3",ref:"name"})),React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"inputPassword3"},"Password"),React.createElement("input",{type:"text",className:"form-control",id:"inputPassword3",ref:"passwd"})),React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"token"},"Token"),React.createElement("input",{type:"text",className:"form-control",id:"token",ref:"token"})),React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"AK"},"AK"),React.createElement("input",{type:"text",className:"form-control",id:"AK",ref:"AK"})),React.createElement("div",{className:"form-group"},React.createElement("label",{htmlFor:"SK"},"SK"),React.createElement("input",{type:"text",className:"form-control",id:"SK",ref:"SK"})),React.createElement("button",{type:"submit",className:"btn"},"Sign up")),React.createElement("br",null),React.createElement("textarea",{ref:"status"}))}});
"use strict";function Editor(e){____Classu.call(this,e),this.state={section:{id:"",title:"",content:""}}}var ____Classu=React.Component;for(var ____Classu____Key in ____Classu)____Classu.hasOwnProperty(____Classu____Key)&&(Editor[____Classu____Key]=____Classu[____Classu____Key]);var ____SuperProtoOf____Classu=null===____Classu?null:____Classu.prototype;Editor.prototype=Object.create(____SuperProtoOf____Classu),Editor.prototype.constructor=Editor,Editor.__superConstructor__=____Classu,Object.defineProperty(Editor.prototype,"tick",{writable:!0,configurable:!0,value:function(){var e=location.hash.slice(4);e?db.section.get(e,function(e){e&&(this.setState({section:e}),clearInterval(this.interval))}.bind(this)):clearInterval(this.interval)}}),Object.defineProperty(Editor.prototype,"componentDidMount",{writable:!0,configurable:!0,value:function(){this.interval=setInterval(this.tick.bind(this),5)}}),Object.defineProperty(Editor.prototype,"componentWillUnmount",{writable:!0,configurable:!0,value:function(){clearInterval(this.interval)}}),Object.defineProperty(Editor.prototype,"handleTitleChange",{writable:!0,configurable:!0,value:function(e){var t=this.state.section;t.title=e.target.value,this.setState({section:t})}}),Object.defineProperty(Editor.prototype,"handleContentChange",{writable:!0,configurable:!0,value:function(e){var t=this.state.section;t.content=e.target.value,this.setState({section:t})}}),Object.defineProperty(Editor.prototype,"readAndUpload",{writable:!0,configurable:!0,value:function(e){var t=new FileReader;t.onload=function(){var a="u/"+timeDiff(),n=document.getElementById("upload-progress");upload({key:a,data:t.result,open:open,progress:n,success:function(){var t="";t="image/png"===e.type||"image/jpeg"===e.type||"image/vnd.microsoft.icon"===e.type?'\n<div name="enc-img" data-name="'+e.name+'" data-type="'+e.type+'" data-key="'+a+'"><i class="fa fa-spinner fa-pulse fa-2x"></i></div>\n':'\n<div class="btn-w"><div class="btn progress-btn" data-key="'+a+'" draggable="true" ondragstart="dragStart(event)" onclick="nDown(\''+e.name+"','"+e.type+"','"+a+"',"+open+')"><i class="'+fileTypeIcons(e.type)+' fa-lg"></i>&nbsp;'+e.name+'<span class="right">'+(e.size/1024).toFixed(2)+'KB</span></div><div id="'+a+'" class="progress-btn-bar"></div></div>\n';var r=document.getElementById("content");insertText(r,t);var i=this.state.section;i.content=r.value,this.setState({section:i}),document.getElementById("file").value="",n.value=0}.bind(this)})}.bind(this),t.readAsArrayBuffer(e)}}),Object.defineProperty(Editor.prototype,"uploadFile",{writable:!0,configurable:!0,value:function(e){e.preventDefault();for(var t=document.getElementById("file").files,a=0;a<t.length;a++)this.readAndUpload(t[a])}}),Object.defineProperty(Editor.prototype,"uploadSetToServer",{writable:!0,configurable:!0,value:function(e){e.preventDefault(),this.props.uploadSetToServer(this.state.section)}}),Object.defineProperty(Editor.prototype,"render",{writable:!0,configurable:!0,value:function(){var e=this.state.section;return React.createElement("div",{className:"container-fluid"},React.createElement("form",{onSubmit:this.uploadSetToServer.bind(this)},React.createElement("div",{className:"form-group"},React.createElement("input",{type:"text",className:"form-control",placeholder:"key",onChange:this.handleTitleChange.bind(this),value:e.title})),React.createElement("div",{className:"form-group"},React.createElement("textarea",{id:"content",className:"form-control",rows:"17",placeholder:"value",onChange:this.handleContentChange.bind(this),value:e.content})),React.createElement("button",{type:"submit",className:"btn insert right"},"Save")),React.createElement("form",{encType:"multipart/form-data",onSubmit:this.uploadFile.bind(this)},React.createElement("input",{id:"file",type:"file",className:"btn",required:!0,accept:!0,multiple:!0}),React.createElement("button",{type:"submit",className:"btn insert"},"Insert")),React.createElement("progress",{id:"upload-progress",min:"0",max:"100",value:"0"},"0"))}});
"use strict";function Folder(e){____Classi.call(this,e),this.state={list:[],eraseKey:""}}function File(){null!==____Classj&&____Classj.apply(this,arguments)}var ____Classi=React.Component;for(var ____Classi____Key in ____Classi)____Classi.hasOwnProperty(____Classi____Key)&&(Folder[____Classi____Key]=____Classi[____Classi____Key]);var ____SuperProtoOf____Classi=null===____Classi?null:____Classi.prototype;Folder.prototype=Object.create(____SuperProtoOf____Classi),Folder.prototype.constructor=Folder,Folder.__superConstructor__=____Classi,Object.defineProperty(Folder.prototype,"componentDidMount",{writable:!0,configurable:!0,value:function(){ajaxArrayBuffer({key:"folder/list",success:function(e){this.setState({list:e.list})}.bind(this)})}}),Object.defineProperty(Folder.prototype,"download",{writable:!0,configurable:!0,value:function(e){nDown(e.name,e.type,e.key,!1)}}),Object.defineProperty(Folder.prototype,"uploadFile",{writable:!0,configurable:!0,value:function(e){e.preventDefault();for(var t=document.getElementById("file").files,a=0;a<t.length;a++)this.readAndUpload(t[a])}}),Object.defineProperty(Folder.prototype,"readAndUpload",{writable:!0,configurable:!0,value:function(e){var t=new FileReader;t.onload=function(){var a="folder/"+timeDiff();upload({key:a,data:t.result,progress:document.getElementById("upload-progress"),success:function(){var t={key:a,name:e.name,type:e.type,size:e.size},r=this.state.list;r.push(t),this.updateList(r)}.bind(this)})}.bind(this),t.readAsArrayBuffer(e)}}),Object.defineProperty(Folder.prototype,"updateList",{writable:!0,configurable:!0,value:function(e){upload({key:"folder/list",data:strToUTF8Arr(JSON.stringify({list:e})),success:function(){console.log("Upload!!!"),this.setState({list:e}),document.getElementById("file").value="",document.getElementById("upload-progress").value=0}.bind(this)})}}),Object.defineProperty(Folder.prototype,"dragStart",{writable:!0,configurable:!0,value:function(e){var t=e.target.dataset.key;e.dataTransfer.setData("key",t),this.setState({eraseKey:t})}}),Object.defineProperty(Folder.prototype,"componentWillReceiveProps",{writable:!0,configurable:!0,value:function(){if(this.props.erase){for(var e in this.state.list)this.state.list[e].key===this.state.eraseKey&&(this.state.list.splice(e,1),this.updateList(this.state.list),this.setState({eraseKey:""}));this.props.eraseEnd()}}}),Object.defineProperty(Folder.prototype,"render",{writable:!0,configurable:!0,value:function(){var e=this.state.list.slice(0).reverse();return React.createElement("div",{className:"container-fluid"},React.createElement("form",{encType:"multipart/form-data",onSubmit:this.uploadFile.bind(this)},React.createElement("input",{id:"file",type:"file",className:"btn",required:!0,accept:!0,multiple:!0}),React.createElement("button",{type:"submit",className:"btn insert"},"Insert")),React.createElement("progress",{id:"upload-progress",min:"0",max:"100",value:"0"},"0"),React.createElement("ul",{className:"list-group"},e.map(function(e){return React.createElement(File,{key:e.key,data:e,download:this.download.bind(this,e),dragStart:this.dragStart.bind(this)})}.bind(this))))}});var ____Classj=React.Component;for(var ____Classj____Key in ____Classj)____Classj.hasOwnProperty(____Classj____Key)&&(File[____Classj____Key]=____Classj[____Classj____Key]);var ____SuperProtoOf____Classj=null===____Classj?null:____Classj.prototype;File.prototype=Object.create(____SuperProtoOf____Classj),File.prototype.constructor=File,File.__superConstructor__=____Classj,Object.defineProperty(File.prototype,"render",{writable:!0,configurable:!0,value:function(){var e=this.props.data;return React.createElement("div",null,React.createElement("a",{className:"list-group-item",href:"#/folder","data-key":e.key,draggable:"true",onDragStart:this.props.dragStart,onClick:this.props.download},React.createElement("i",{className:fileTypeIcons(e.type)+" fa-fw fa-lg"})," ",e.name,React.createElement("span",{className:"right"},(e.size/1024).toFixed(2)+"KB")),React.createElement("div",{id:e.key,className:"list-group-item progress-bar"}))}});
"use strict";function Tasks(t){____Classa.call(this,t),this.state={version:0,tasks:[],query:[],editID:""}}function Task(){null!==____Classb&&____Classb.apply(this,arguments)}var ____Classa=React.Component;for(var ____Classa____Key in ____Classa)____Classa.hasOwnProperty(____Classa____Key)&&(Tasks[____Classa____Key]=____Classa[____Classa____Key]);var ____SuperProtoOf____Classa=null===____Classa?null:____Classa.prototype;Tasks.prototype=Object.create(____SuperProtoOf____Classa),Tasks.prototype.constructor=Tasks,Tasks.__superConstructor__=____Classa,Object.defineProperty(Tasks.prototype,"loadTasks",{writable:!0,configurable:!0,value:function(){ajaxArrayBuffer({key:"tasks/"+this.state.version,success:function(t){this.setState({tasks:t.tasks}),this.setState({query:t.tasks})}.bind(this)})}}),Object.defineProperty(Tasks.prototype,"componentDidMount",{writable:!0,configurable:!0,value:function(){ajaxArrayBuffer({key:"tasks/version",success:function(t){this.setState({version:t.version}),this.loadTasks()}.bind(this)})}}),Object.defineProperty(Tasks.prototype,"handleChange",{writable:!0,configurable:!0,value:function(t){var e=t.target.value,s=[],a=new RegExp(e,"i"),_=!0,r=!1,n=void 0;try{for(var i,o=this.state.tasks[Symbol.iterator]();!(_=(i=o.next()).done);_=!0){var l=i.value;null!==l.content.match(a)&&s.push(l)}}catch(c){r=!0,n=c}finally{try{!_&&o["return"]&&o["return"]()}finally{if(r)throw n}}this.setState({query:s})}}),Object.defineProperty(Tasks.prototype,"handleEdit",{writable:!0,configurable:!0,value:function(t){this.setState({editID:t.id}),this.refs.content.getDOMNode().value=t.content}}),Object.defineProperty(Tasks.prototype,"save",{writable:!0,configurable:!0,value:function(t){if(t.preventDefault(),""!==this.refs.content.getDOMNode().value){var e=this.state.version+1,s=this.state.tasks;if(""!==this.state.editID)for(var a in s)this.state.editID===s[a].id&&(s.splice(a,1),this.setState({editID:""}));var _={id:timeDiff(),content:this.refs.content.getDOMNode().value};s.push(_),upload({key:"tasks/"+e,data:strToUTF8Arr(JSON.stringify({tasks:s})),success:function(){upload({key:"tasks/version",data:strToUTF8Arr(JSON.stringify({version:e})),success:function(){this.setState({version:e}),this.setState({query:s}),this.refs.content.getDOMNode().value=""}.bind(this)})}.bind(this)})}}}),Object.defineProperty(Tasks.prototype,"render",{writable:!0,configurable:!0,value:function(){var t=this.state.query.slice(0).reverse();return React.createElement("div",{className:"container-fluid"},React.createElement("form",{onSubmit:this.save.bind(this)},React.createElement("div",{className:"form-group"},React.createElement("input",{type:"text",className:"form-control",placeholder:"tasks",onChange:this.handleChange.bind(this),ref:"content"}))),t.map(function(t){return React.createElement(Task,{key:t.id,data:t,edit:this.handleEdit.bind(this,t)})}.bind(this)))}});var ____Classb=React.Component;for(var ____Classb____Key in ____Classb)____Classb.hasOwnProperty(____Classb____Key)&&(Task[____Classb____Key]=____Classb[____Classb____Key]);var ____SuperProtoOf____Classb=null===____Classb?null:____Classb.prototype;Task.prototype=Object.create(____SuperProtoOf____Classb),Task.prototype.constructor=Task,Task.__superConstructor__=____Classb,Object.defineProperty(Task.prototype,"render",{writable:!0,configurable:!0,value:function(){var t=this.props.data;return React.createElement("div",null,React.createElement("span",{className:"tasks"},t.content," ",React.createElement("a",{href:"#/tasks",onClick:this.props.edit},React.createElement("i",{className:"fa fa-pencil"}))))}});
"use strict";function Root(t){____Class5.call(this,t),this.state={version:0,contents:[],set:[],auth:!1,url:location.hash,erase:!1}}var ____Class5=React.Component;for(var ____Class5____Key in ____Class5)____Class5.hasOwnProperty(____Class5____Key)&&(Root[____Class5____Key]=____Class5[____Class5____Key]);var ____SuperProtoOf____Class5=null===____Class5?null:____Class5.prototype;Root.prototype=Object.create(____SuperProtoOf____Class5),Root.prototype.constructor=Root,Root.__superConstructor__=____Class5,Object.defineProperty(Root.prototype,"loadSetFromServer",{writable:!0,configurable:!0,value:function(){ajaxArrayBuffer({key:"set/"+this.state.version,open:open,success:function(t){var e=[],o=!0,a=!1,s=void 0;try{for(var r,n=t.set[Symbol.iterator]();!(o=(r=n.next()).done);o=!0){var i=r.value,c={id:i.id,title:i.title,timestamp:i.timestamp};e.push(c)}}catch(l){a=!0,s=l}finally{try{!o&&n["return"]&&n["return"]()}finally{if(a)throw s}}this.setState({contents:e}),this.setState({set:t.set}),this.cacheToIndexedDB(),refresh=!0}.bind(this)})}}),Object.defineProperty(Root.prototype,"cacheToIndexedDB",{writable:!0,configurable:!0,value:function(){var t=this.state.version;db.etc.put({id:"version",version:t}),db.contents.put({id:t,arr:this.state.contents}),db.set.put({id:t,arr:this.state.set});var e=!0,o=!1,a=void 0;try{for(var s,r=this.state.set[Symbol.iterator]();!(e=(s=r.next()).done);e=!0){var n=s.value;db.section.put(n).then(function(){refresh=!0})}}catch(i){o=!0,a=i}finally{try{!e&&r["return"]&&r["return"]()}finally{if(o)throw a}}}}),Object.defineProperty(Root.prototype,"loadSetFromIndexedDB",{writable:!0,configurable:!0,value:function(){var t=this.state.version;db.contents.get(t,function(t){this.setState({contents:t.arr})}.bind(this)),db.set.get(t,function(t){this.setState({set:t.arr})}.bind(this))}}),Object.defineProperty(Root.prototype,"cache",{writable:!0,configurable:!0,value:function(){ajaxArrayBuffer({key:"version",open:open,success:function(t){this.setState({version:t.version}),db.etc.get("version",function(t){t&&t.version===this.state.version?(console.log("LoadSetFromIndexedDB"),this.loadSetFromIndexedDB()):(console.log("LoadSetFromServer"),this.loadSetFromServer())}.bind(this))}.bind(this)})}}),Object.defineProperty(Root.prototype,"handleUploadSetToServer",{writable:!0,configurable:!0,value:function(t){if(""!==t.title){var e=this.state.version+1,o=this.state.contents,a=this.state.set,s={id:t.id,title:t.title,timestamp:Date.now()};if(""===s.id)s.id=timeDiff(),o.push(s),s.content=t.content,a.push(s);else for(var r in o)s.id===o[r].id&&(o[r]=s,s.content=t.content,a[r]=s);this.setState({version:e}),this.setState({contents:o}),this.setState({set:a}),db.section.put(s),db.etc.put({id:"version",version:e}),db.contents.put({id:e,arr:o}),db.set.put({id:e,arr:a}),upload({key:"set/"+e,data:strToUTF8Arr(JSON.stringify({set:a})),open:open,success:function(){upload({key:"version",data:strToUTF8Arr(JSON.stringify({version:e})),open:open,success:function(){console.log("Save!!!"),location.href="#/t/"+s.id}})}})}}}),Object.defineProperty(Root.prototype,"handleErase",{writable:!0,configurable:!0,value:function(t){upload({key:t,data:strToUTF8Arr("x"),success:function(){console.log("Erase!!!"),this.setState({erase:!0}),this.setState({erase:!0})}.bind(this)})}}),Object.defineProperty(Root.prototype,"handleEraseEnd",{writable:!0,configurable:!0,value:function(){this.setState({erase:!1})}}),Object.defineProperty(Root.prototype,"handleLogin",{writable:!0,configurable:!0,value:function(){this.setState({auth:!0}),location.href="#/login"===local?"#/":local}}),Object.defineProperty(Root.prototype,"handleLogout",{writable:!0,configurable:!0,value:function(){localStorage.removeItem("token"),localStorage.removeItem("user"),this.setState({auth:!1}),location.replace("#/")}}),Object.defineProperty(Root.prototype,"auth",{writable:!0,configurable:!0,value:function(){localStorage.token&&this.setState({auth:!0})}}),Object.defineProperty(Root.prototype,"componentDidMount",{writable:!0,configurable:!0,value:function(){this.auth(),this.cache(),window.onhashchange=function(){return this.setState({url:location.hash})}.bind(this)}}),Object.defineProperty(Root.prototype,"render",{writable:!0,configurable:!0,value:function(){var t;switch(this.state.url.split("/")[1]){case"t":case"s":t=React.createElement(Section,React.__spread({},this.state));break;case"a":case"e":t=React.createElement(Editor,React.__spread({},this.state,{uploadSetToServer:this.handleUploadSetToServer.bind(this)}));break;case"login":t=React.createElement(SignIn,React.__spread({},this.state,{login:this.handleLogin.bind(this)}));break;case"join":t=React.createElement(SignUp,React.__spread({},this.state));break;case"folder":t=React.createElement(Folder,React.__spread({},this.state,{eraseEnd:this.handleEraseEnd.bind(this)}));break;case"tasks":t=React.createElement(Tasks,React.__spread({},this.state));break;default:t=React.createElement(Contents,React.__spread({},this.state))}return React.createElement("div",null,React.createElement(Navbar,{auth:this.state.auth,logout:this.handleLogout.bind(this),erase:this.handleErase.bind(this)}),t)}}),React.render(React.createElement(Root,null),document.getElementById("wrapper"));