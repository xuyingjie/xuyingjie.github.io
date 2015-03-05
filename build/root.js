var Root = React.createClass({displayName: "Root",

  getInitialState: function() {
    return {version: 0, contents: [], set: [], encSet: [], auth: false};
  },

  // load and cache
  loadSetFromServer: function(){
    ajax({
      url: url + "set/" + this.state.version,
      method: "GET",
      success: function(data){
        this.setState({encSet: data.set});

        var contents = [];
        var set = [];
        this.state.encSet.forEach(function(x){
          var d = {
            id: x.id,
            title: decrypt(x.title, publicKey),
            timestamp: x.timestamp
          };
          contents.push(d);
          d.content = decrypt(x.content, publicKey);
          set.push(d);
        });
        // contents.sort(function(a, b){
        //   return b.title.localeCompare(a.title);
        // });
        this.setState({contents: contents});
        this.setState({set: set});

        this.cacheToIndexedDB();
        refresh = true;

      }.bind(this)
    });
  },
  cacheToIndexedDB: function(){
    var v = this.state.version;
    db.etc.put({"id": "version", "version": v});
    db.contents.put({"id": v, "arr": this.state.contents});
    db.set.put({"id": v, "arr": this.state.set});
    db.encSet.put({"id": v, "arr": this.state.encSet});
    this.state.set.forEach(function(x){
      db.section.put(x).then(function(){
        refresh = true;
      });
    });
  },
  loadSetFromIndexedDB: function(){
    var v = this.state.version;
    db.contents.get(v, function(data){
      this.setState({contents: data.arr});
    }.bind(this));
    db.set.get(v, function(data){
      this.setState({set: data.arr});
    }.bind(this));
    db.encSet.get(v, function(data){
      this.setState({encSet: data.arr});
    }.bind(this));
  },
  cache: function(){
    ajax({
      url: url + "version",
      method: "GET",
      success: function(data){
        this.setState({version: data.version});

        db.etc.get("version", function(data){
          if (data) {
            if (data.version === this.state.version){
              // console.log("AAA");
              this.loadSetFromIndexedDB();
            } else {
              // console.log("BBB");
              this.loadSetFromServer();
            }
          } else {
            // console.log("CCC");
            this.loadSetFromServer();
          }
        }.bind(this));

      }.bind(this)
    });
  },

  // post to database server
  handleUploadSetToServer: function(data){
    if (data.title !== '') {

      var version = this.state.version + 1;
      var contents = this.state.contents;
      var set = this.state.set;
      var encSet = this.state.encSet;

      var timestamp = Date.now();
      var t = {
        id: data.id,
        title: data.title,
        timestamp: timestamp
      };
      var encT = {
        id: data.id,
        title: encrypt(data.title, publicKey),
        content: encrypt(data.content, publicKey),
        timestamp: timestamp
      };

      if (t.id === '') {
        t.id = timeDiff();
        encT.id = t.id;

        contents.push(t);
        t.content = data.content;
        set.push(t);
        encSet.push(encT);
      } else {
        for (var i in contents) {
          if (t.id === contents[i].id) {
            contents[i] = t;
            t.content = data.content;
            set[i] = t;
            encSet[i] = encT;
          }
        }
      }

      this.setState({version: version});
      this.setState({contents: contents});
      this.setState({set: set});
      this.setState({encSet: encSet});

      db.section.put(t);
      db.etc.put({"id": "version", "version": version});
      db.contents.put({"id": version, "arr": contents});
      db.set.put({"id": version, "arr": set});
      db.encSet.put({"id": version, "arr": encSet});


      var file = new Blob([JSON.stringify({"set": encSet})], {"type": "text\/json"});
      var key = "set/" + version;
      var progress = document.getElementById('save-progress');  // 页面顶部的进度线

      var xhr = upload(file, key, progress);
      xhr.onload = function() {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {

          var file = new Blob([JSON.stringify({"version": version})], {"type": "text\/json"});
          var key = "version";
          var xhr0 = upload(file, key, progress);
          xhr0.onload = function() {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
              console.log("Save!!!");
              location.href="#/t/"+ t.id;
            }
          };
        }
      };
    }
  },

  handleLogin: function() {
    this.setState({auth: true});
    location.href=local;
  },
  handleLogout: function() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("OSSAccessKeyId");
    window.localStorage.removeItem("policy");
    window.localStorage.removeItem("signature");
    this.setState({auth: false});
    location.replace("#/");
  },
  auth: function() {
    if (window.localStorage.OSSAccessKeyId) {
      this.setState({auth: true});
    }
  },

  componentDidMount: function() {
    this.auth();
    this.cache();
  },

  render: function(){
    return (
      React.createElement("div", null, 
        React.createElement(Navbar, {auth: this.state.auth, logout: this.handleLogout}), 
        React.createElement(RouteHandler, React.__spread({},  this.state, {uploadSetToServer: this.handleUploadSetToServer, login: this.handleLogin}))
      )
    );
  }

});

var routes = (
  React.createElement(Route, {path: "/", handler: Root}, 
    React.createElement(Route, {name: "t", path: "/t/:id", handler: Section}), 
    React.createElement(Route, {name: "s", path: "/s/:keyword", handler: Section}), 
    React.createElement(Route, {name: "a", handler: Editor}), 
    React.createElement(Route, {name: "e", path: "/e/:id", handler: Editor}), 
    React.createElement(Route, {name: "login", handler: SignIn}), 
    React.createElement(Route, {name: "join", handler: SignUp}), 
    React.createElement(DefaultRoute, {handler: Contents})
  )
);

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.body);
});
