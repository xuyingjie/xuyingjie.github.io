class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {section: {id: '', title: '', content: ''}};
  }

  tick() {
    let paramsID = location.hash.slice(4);

    if (paramsID){
      db.section.get(paramsID, function(data){
        if (data) {
          this.setState({section: data});
          clearInterval(this.interval);
        }
      }.bind(this));
    } else {
      clearInterval(this.interval);
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 5);  // 等待cache完成
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleTitleChange(event) {
    var x = this.state.section;
    x.title = event.target.value;
    this.setState({section: x});
  }
  handleContentChange(event) {
    var x = this.state.section;
    x.content = event.target.value;
    this.setState({section: x});
  }

  uploadFile(e){
    e.preventDefault();    // 阻止默认行为的发生。如跳转。

    var file = document.getElementById('file').files[0];

    var reader = new FileReader();
    reader.onload = function(e) {

      var key = "u/" + timeDiff();
      var progress = document.getElementById('upload-progress');

      upload({
        key: key,
        data: reader.result,
        encrypt: false,
        progress: progress,
        success: function() {
          var c = '';

          if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/vnd.microsoft.icon"){
            c = `
<span name="enc-img" data-name="${file.name}" data-type="${file.type}" data-key="${key}"><i class="fa fa-spinner fa-pulse fa-2x"></i></span>
`;
          } else {
            c = `
<a class="btn btn-default" onclick="nDown('${file.name}','${file.type}','${key}',false)">
<i class="${fileTypeIcons(file.type)} fa-lg"></i>&nbsp;${file.name}&nbsp;<span id="${key}">${(file.size/1024).toFixed(2)}KB</span></a>
`;
          }

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
  }

  uploadSetToServer(e){
    e.preventDefault();
    this.props.uploadSetToServer(this.state.section);
  }

  render() {
    var x = this.state.section;
    // console.log(x);
    return (
      <div className="container-fluid">

        <form onSubmit={this.uploadSetToServer.bind(this)}>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="key" onChange={this.handleTitleChange.bind(this)} value={x.title} />
          </div>
          <div className="form-group">
            <textarea id="content" className="form-control" rows="17" placeholder="value" onChange={this.handleContentChange.bind(this)} value={x.content} />
          </div>
          <button type="submit" className="btn btn-default pull-right">Save</button>
        </form>

        <form encType="multipart/form-data" onSubmit={this.uploadFile.bind(this)}>
          <input id="file" type="file" required accept/>
          <button type="submit" className="btn btn-default">Insert</button>
        </form>
        <progress id="upload-progress" min="0" max="100" value="0">0</progress>

      </div>
    );
  }
}
