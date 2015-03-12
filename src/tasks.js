var Tasks = React.createClass({

  getInitialState: function() {
    return {version: 0, tasks: [], query: [], editID: ''};
  },

  loadTasks: function() {
    ajaxArrayBuffer({
      key: "tasks/" + this.state.version,
      token: localStorage.token,
      success: function(data){
        this.setState({tasks: data.tasks});
        this.setState({query: data.tasks});
      }.bind(this)
    });
  },

  componentDidMount: function() {
    ajaxArrayBuffer({
      key: "tasks/version",
      token: localStorage.token,
      success: function(data){
        this.setState({version: data.version});
        this.loadTasks();
      }.bind(this)
    });
  },

  handleChange: function(e) {
    var keyword = e.target.value;
    // console.log("Query");
    var query = [];
    var s = new RegExp(keyword, "i");
    this.state.tasks.forEach(function(x){
      if (x.content.match(s) !== null) {
        query.push(x);
      }
    });
    this.setState({query: query});
  },

  handleEdit: function(t) {
    this.setState({editID: t.id});
    this.refs.content.getDOMNode().value = t.content;
  },

  save: function(e) {
    e.preventDefault();

    if (this.refs.content.getDOMNode().value !== ''){
      var version = this.state.version + 1;
      var tasks = this.state.tasks;

      if (this.state.editID !== ''){
        for (var i in tasks) {
          if (this.state.editID === tasks[i].id) {
            tasks.splice(i,1);
            this.setState({editID: ''});
          }
          // console.log("editID: "+this.state.editID);
        }
      }

      var t = {
        id: timeDiff(),
        content: this.refs.content.getDOMNode().value
      };
      tasks.push(t);
      // console.log(this.state.tasks);
      // this.setState({tasks: tasks});

      upload({
        key: "tasks/" + version, //备份部分版本
        data: strToUTF8Arr(JSON.stringify({tasks: tasks})),
        token: localStorage.token,
        success: function() {

          upload({
            key: "tasks/version",
            data: strToUTF8Arr(JSON.stringify({version: version})),
            token: localStorage.token,
            success: function() {
              this.setState({version: version});
              this.setState({query: tasks});
              this.refs.content.getDOMNode().value = "";
            }.bind(this)
          });

        }.bind(this)
      });

    }
  },

  render: function() {
    var tasks = this.state.query.slice(0).reverse();

    return (
      <div className="container-fluid">
        <form onSubmit={this.save}>
          <div className="form-group">
            <input type="text" className="form-control tasks" placeholder="tasks" onChange={this.handleChange} ref="content" />
          </div>
        </form>

        {tasks.map(function(x){
          return (
            <div className="tasks-margin">
              <span className="tasks">
                {x.content}&nbsp;
                <a href="#/tasks" onClick={this.handleEdit.bind(this, x)}>
                  <i className="fa fa-pencil"></i>
                </a>
              </span>
            </div>
          );
        }.bind(this))}
      </div>
    );
  }
});
