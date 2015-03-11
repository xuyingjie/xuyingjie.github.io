var Editor = React.createClass({
  mixins: [Router.State],

  getInitialState: function() {
    return {section: {id: '', title: '', content: ''}};
  },

  tick: function() {
    if (this.getParams().id){
      db.section.get(this.getParams().id, function(data){
        if (data) {
          this.setState({section: data});
          clearInterval(this.interval);
        }
      }.bind(this));
    }
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 5);  // 等待cache完成
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  handleTitleChange: function(event) {
    var x = this.state.section;
    x.title = event.target.value;
    this.setState({section: x});
  },
  handleContentChange: function(event) {
    var x = this.state.section;
    x.content = event.target.value;
    this.setState({section: x});
  },

  uploadFile: function(e){
    e.preventDefault();    // 阻止默认行为的发生。如跳转。

    var file = document.getElementById('file').files[0];

    var reader = new FileReader();
    reader.onload = function(e) {

      var key = "u/" + timeDiff();
      var progress = document.getElementById('upload-progress');

      upload({
        key: key,
        data: reader.result,
        token: publicKey,
        progress: progress,
        success: function() {

          var c = '\n<div name="enc-img" data-name="'+file.name+'" data-type="'+file.type+'" data-src="'+url+key+'"><span class="fa fa-spinner fa-pulse fa-2x"></span></div>';
          var textarea = document.getElementById('content');
          insertText(textarea, c);

          var section = this.state.section;
          section.content = textarea.value;
          this.setState({section: section});

          document.getElementById("file").value = "";
          progress.value = 0;
        }.bind(this)
      });

    }.bind(this);
    reader.readAsArrayBuffer(file);
  },

  uploadSetToServer: function(e){
    e.preventDefault();
    this.props.uploadSetToServer(this.state.section);
  },

  render: function() {
    var x = this.state.section;
    // console.log(x);
    return (
      <div className="container-fluid">

        <form onSubmit={this.uploadSetToServer}>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="key" onChange={this.handleTitleChange} value={x.title} />
          </div>
          <div className="form-group">
            <textarea id="content" className="form-control" rows="17" placeholder="value" onChange={this.handleContentChange} value={x.content} />
          </div>
          <button type="submit" className="btn btn-default pull-right">Save</button>
        </form>

        <form encType="multipart/form-data" onSubmit={this.uploadFile}>
          <input id="file" type="file" required accept/>
          <button type="submit" className="btn btn-default">Insert</button>
        </form>
        <progress id="upload-progress" min="0" max="100" value="0">0</progress>

      </div>
    );
  }
});
