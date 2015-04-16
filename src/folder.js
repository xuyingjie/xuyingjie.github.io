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

  uploadFileSuccess(key, file) {

    var size = (file.size/1024).toFixed(2) + 'KB';
    var d = {
      key,
      name: file.name,
      type: file.type,
      size
    };
    var list = this.state.list;
    list.push(d);

    this.updateList(list);
  }

  updateList(list) {
    upload({
      key: 'folder/list',
      data: strToUTF8Arr(JSON.stringify({'list': list})),
      success: function() {
        this.setState({list: list});
      }.bind(this)
    });
  }

  toErase(key) {
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
        <InputFile uploadFolder="folder/" open={false} uploadFileSuccess={this.uploadFileSuccess.bind(this)} />

        <ul className="list-group">
          {list.map(function(x){
            return <File key={x.key} data={x} download={this.download.bind(this, x)} toErase={this.toErase.bind(this)} />;
          }.bind(this))}
        </ul>

      </div>
    );
  }
}
