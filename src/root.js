var Root = React.createClass({

  getInitialState: function() {
    return {version: 0, contents: [], set: [], auth: false};
  },

  // load and cache
  loadSetFromServer: function(){
    ajaxArrayBuffer({
      url: url + "set/" + this.state.version,
      json: true,
      token: publicKey,
      success: function(data){

        var contents = [];
        data.set.forEach(function(x){
          var t = {
            id: x.id,
            title: x.title,
            timestamp: x.timestamp
          };
          contents.push(t);
        });
        this.setState({contents: contents});
        this.setState({set: data.set});

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
  },
  cache: function(){
    ajaxJson({
      url: url + "version",
      success: function(data){
        this.setState({version: data.version});

        db.etc.get("version", function(data){
          if (data) {
            if (data.version === this.state.version){
              console.log("LoadSetFromIndexedDB");
              this.loadSetFromIndexedDB();
            } else {
              console.log("LoadSetFromServer");
              this.loadSetFromServer();
            }
          } else {
            console.log("LoadSetFromServer");
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

      this.setState({version: version});
      this.setState({contents: contents});
      this.setState({set: set});

      db.section.put(t);
      db.etc.put({"id": "version", "version": version});
      db.contents.put({"id": version, "arr": contents});
      db.set.put({"id": version, "arr": set});

      var opts = {
        key: "set/" + version,
        data: strToUTF8Arr(JSON.stringify({set: set})),
        token: publicKey
      };

      var xhr = upload(opts);

      xhr.onload = function() {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {

          var opts = {
            key: "version",
            data: new Blob([JSON.stringify({version: version})], {type: 'text/json'})
          };

          var req = upload(opts);

          req.onload = function() {
            if ((req.status >= 200 && req.status < 300) || req.status == 304) {
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
      <div>
        <Navbar auth={this.state.auth} logout={this.handleLogout} />
        <RouteHandler {...this.state} uploadSetToServer={this.handleUploadSetToServer} login={this.handleLogin} />
      </div>
    );
  }

});

var routes = (
  <Route path="/" handler={Root}>
    <Route name="t" path="/t/:id" handler={Section}/>
    <Route name="s" path="/s/:keyword" handler={Section}/>
    <Route name="a" handler={Editor}/>
    <Route name="e" path="/e/:id" handler={Editor}/>
    <Route name="login" handler={SignIn}/>
    <Route name="join" handler={SignUp}/>
    <Route name="folder" handler={Folder}/>
    <DefaultRoute handler={Contents}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
