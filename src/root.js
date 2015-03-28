class Root extends React.Component {

  constructor(props) {
    super(props);
    this.state = {version: 0, contents: [], set: [], auth: false, url: location.hash, erase: false};
  }

  // load and cache
  loadSetFromServer(){
    ajaxArrayBuffer({
      key: "set/" + this.state.version,
      open,
      success: function(data){

        var contents = [];
        for (let x of data.set) {
          var t = {
            id: x.id,
            title: x.title,
            timestamp: x.timestamp
          };
          contents.push(t);
        }
        this.setState({contents: contents});
        this.setState({set: data.set});

        this.cacheToIndexedDB();
        refresh = true;

      }.bind(this)
    });
  }

  cacheToIndexedDB(){
    var v = this.state.version;
    db.etc.put({"id": "version", "version": v});
    db.contents.put({"id": v, "arr": this.state.contents});
    db.set.put({"id": v, "arr": this.state.set});
    for (let x of this.state.set) {
      db.section.put(x).then(function(){
        refresh = true;
      });
    }
  }

  loadSetFromIndexedDB(){
    var v = this.state.version;
    db.contents.get(v, function(data){
      this.setState({contents: data.arr});
    }.bind(this));
    db.set.get(v, function(data){
      this.setState({set: data.arr});
    }.bind(this));
  }

  cache(){
    ajaxArrayBuffer({
      key: "version",
      open,
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
  }

  // post to database server
  handleUploadSetToServer(data){
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
        for (let i in contents) {
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

      upload({
        key: "set/" + version,
        data: strToUTF8Arr(JSON.stringify({set: set})),
        open,
        success: function() {

          upload({
            key: "version",
            data: strToUTF8Arr(JSON.stringify({version: version})),
            open,
            success: function() {
              console.log("Save!!!");
              location.href="#/t/"+ t.id;
            }
          });
        }
      });

    }
  }

  handleErase(key) {
    upload({
      key,
      data: strToUTF8Arr('x'),
      success: function() {
        console.log("Erase!!!");
        this.setState({erase: true});
        this.setState({erase: true});
        // this.setState({erase: true});
        // this.setState({erase: true});
      }.bind(this)
    });
  }

  handleEraseEnd() {
    this.setState({erase: false});
  }

  handleLogin() {
    this.setState({auth: true});
    if (!open) {
      this.cache();
    }
    location.href=local;
  }

  handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({auth: false});
    if (!open) {
      db.delete();
      this.setState({version: 0});
      this.setState({contents: []});
      this.setState({set: []});
      location.replace("#/login");
    } else {
      location.replace("#/");
    }
  }

  auth() {
    if (localStorage.token) {
      this.setState({auth: true});
      this.cache();
    } else {
      if (!open) {
        location.href="#/login";
      } else {
        this.cache();
      }
    }
  }

  componentDidMount() {
    this.auth();
    window.onhashchange = () => this.setState({ url : location.hash });
  }

  render(){
    var page;
    switch (this.state.url.split('/')[1]) {
      case 't':
      case 's':
        page = <Section {...this.state} />;
        break;
      case 'a':
      case 'e':
        page = <Editor {...this.state} uploadSetToServer={this.handleUploadSetToServer.bind(this)} />;
        break;
      case 'login':
        page = <SignIn {...this.state} login={this.handleLogin.bind(this)} />;
        break;
      case 'join':
        page = <SignUp {...this.state} />;
        break;
      case 'folder':
        page = <Folder {...this.state} eraseEnd={this.handleEraseEnd.bind(this)} />;
        break;
      case 'tasks':
        page = <Tasks {...this.state} />;
        break;
      default:
        page = <Contents {...this.state} />;
        break;
    }

    return (
      <div>
        <Navbar auth={this.state.auth} logout={this.handleLogout.bind(this)} erase={this.handleErase.bind(this)} />
        {page}
      </div>
      );
  }
}

React.render(<Root />, document.getElementById('wrapper'));
