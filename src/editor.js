class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {section: {id: '', title: '', content: ''}};
  }

  tick() {
    let paramsID = location.hash.slice(4);

    if (paramsID) {
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

    // 等待cache完成
    this.interval = setInterval(this.tick.bind(this), 5);
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

  uploadFileSuccess(key, file) {
    var c = `
![${file.name},${(file.size/1024).toFixed(2)}KB,${file.type},${key}]
`;

    var textarea = document.getElementById('content');
    insertText(textarea, c);

    var section = this.state.section;
    section.content = textarea.value;
    this.setState({section: section});
  }

  uploadSetToServer(e) {
    e.preventDefault();
    this.props.uploadSetToServer(this.state.section);
  }

  render() {
    var x = this.state.section;
    return (
      <div className="wrap">

        <form onSubmit={this.uploadSetToServer.bind(this)}>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="key" onChange={this.handleTitleChange.bind(this)} value={x.title} />
          </div>
          <div className="form-group">
            <textarea id="content" className="form-control" rows="17" placeholder="value" onChange={this.handleContentChange.bind(this)} value={x.content} />
          </div>
          <button type="submit" className="btn insert right">Save</button>
        </form>

        <InputFile uploadFolder="u/" open={open} uploadFileSuccess={this.uploadFileSuccess.bind(this)} />
      </div>
    );
  }
}
