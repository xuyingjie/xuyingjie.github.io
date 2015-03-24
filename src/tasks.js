class Tasks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {version: 0, tasks: [], query: [], editID: ''};
  }

  loadTasks() {
    ajaxArrayBuffer({
      key: "tasks/" + this.state.version,
      success: function(data){
        this.setState({tasks: data.tasks});
        this.setState({query: data.tasks});
      }.bind(this)
    });
  }

  componentDidMount() {
    ajaxArrayBuffer({
      key: "tasks/version",
      success: function(data){
        this.setState({version: data.version});
        this.loadTasks();
      }.bind(this)
    });
  }

  handleChange(e) {
    var keyword = e.target.value;
    var query = [];
    var s = new RegExp(keyword, "i");
    for (let x of this.state.tasks) {
      if (x.content.match(s) !== null) {
        query.push(x);
      }
    }
    this.setState({query: query});
  }

  handleEdit(t) {
    this.setState({editID: t.id});
    this.refs.content.getDOMNode().value = t.content;
  }

  save(e) {
    e.preventDefault();

    if (this.refs.content.getDOMNode().value !== ''){
      var version = this.state.version + 1;
      var tasks = this.state.tasks;

      if (this.state.editID !== ''){
        for (let i in tasks) {
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
        success: function() {

          upload({
            key: "tasks/version",
            data: strToUTF8Arr(JSON.stringify({version: version})),
            success: function() {
              this.setState({version: version});
              this.setState({query: tasks});
              this.refs.content.getDOMNode().value = "";
            }.bind(this)
          });

        }.bind(this)
      });

    }
  }

  render() {
    var tasks = this.state.query.slice(0).reverse();

    return (
      <div className="container-fluid">
        <form onSubmit={this.save.bind(this)}>
          <div className="form-group">
            <input type="text" className="form-control tasks" placeholder="tasks" onChange={this.handleChange.bind(this)} ref="content" />
          </div>
        </form>

        {tasks.map(function(x){
          return <Task key={x.id} data={x} edit={this.handleEdit.bind(this, x)} />;
        }.bind(this))}
      </div>
    );
  }
}

class Task extends React.Component {
  render(){
    var x = this.props.data;
    return (
      <div className="tasks-margin">
        <span className="tasks">
          {x.content}&nbsp;
          <a href="#/tasks" onClick={this.props.edit}>
            <i className="fa fa-pencil"></i>
          </a>
        </span>
      </div>
    );
  }
}
