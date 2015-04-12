class Folder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {list: [], eraseKey: ''};
  }

  componentDidMount() {
    ajaxArrayBuffer({
      key: 'folder/list',
      success: function(data){
        this.setState({list: data.list});
      }.bind(this)
    });
  }

  download(file){
    nDown(file.name, file.type, file.key, false);
  }

  uploadFile(e){
    e.preventDefault();

    var files = document.getElementById('file').files;
    for (let i = 0; i < files.length; i++) {
      this.readAndUpload(files[i]);
    }
  }

  readAndUpload(file) {
    var reader = new FileReader();
    reader.onload = function(e) {

      var key = 'folder/' + timeDiff();

      upload({
        key,
        data: reader.result,
        progress: document.getElementById('upload-progress'),
        success: function() {

          var d = {
            key,
            name: file.name,
            type: file.type,
            size: file.size
          };
          var list = this.state.list;
          list.push(d);

          this.updateList(list);

        }.bind(this)
      });

    }.bind(this);
    reader.readAsArrayBuffer(file);
  }

  updateList(list) {
    upload({
      key: 'folder/list',
      data: strToUTF8Arr(JSON.stringify({'list': list})),
      success: function() {
        console.log('Upload!!!');

        this.setState({list: list});
        document.getElementById('file').value = '';
        document.getElementById('upload-progress').value = 0;
      }.bind(this)
    });
  }

  dragStart(e) {
    let key = e.target.dataset.key;
    e.dataTransfer.setData('key', key);
    this.setState({eraseKey: key});
  }

  componentWillReceiveProps() {
    if (this.props.erase) {
      // console.log('######');
      for (let i in this.state.list){
        if (this.state.list[i].key === this.state.eraseKey) {
          this.state.list.splice(i, 1);
          // console.log('@@@');
          this.updateList(this.state.list);
          this.setState({eraseKey: ''});
        }
      }
      this.props.eraseEnd();
    }
  }

  render() {
    var list = this.state.list.slice(0).reverse();

    return (
      <div className="wrap">

        <form encType="multipart/form-data" onSubmit={this.uploadFile.bind(this)}>
          <input id="file" type="file" className="btn" required accept multiple />
          <button type="submit" className="btn insert">Insert</button>
        </form>
        <progress id="upload-progress" min="0" max="100" value="0">0</progress>

        <ul className="list-group">
          {list.map(function(x){
            x.size = (x.size/1024).toFixed(2) + 'KB';
            return <File key={x.key} data={x} download={this.download.bind(this, x)} dragStart={this.dragStart.bind(this)} />;
          }.bind(this))}
        </ul>

      </div>
    );
  }
}

class File extends React.Component {
  render() {
    var x = this.props.data;
    return (
      <div>
        <a className="list-group-item" data-key={x.key} draggable='true' onDragStart={this.props.dragStart} onClick={this.props.download}>
          <i className={fileTypeIcons(x.type) + " fa-fw fa-lg"}></i>&nbsp;
          {x.name}
          <span className="right">{x.size}</span>
        </a>
        <div id={x.key} className="list-group-item progress-bar"></div>
      </div>
    );
  }
}
