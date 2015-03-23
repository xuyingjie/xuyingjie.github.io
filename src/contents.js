class Contents extends React.Component {

  constructor(props) {
    super(props);
    this.state = {contents: []};
  }

  sort() {
    if (this.state.contents.length === 0){
      var c = this.props.contents.slice(0); // 返回新数组而不是引用
      if (this.props.auth){
        // 修改时间排序. !!!sort数组在原数组上进行排序
        c.sort(function(a, b){
          return b.timestamp - a.timestamp;
        });
      } else {
        // 字母排序
        c.sort(function(a, b){
          return a.title.localeCompare(b.title);
        });
      }
      this.setState({contents: c});
    } else {
      clearInterval(this.interval);
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.sort.bind(this), 5);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="container-fluid">
        {this.state.contents.map(function(x){
          return <a className="btn btn-default" key={x.id} href={"#/t/" + x.id} role="button">{x.title}</a>;
        })}
      </div>
    );
  }
}
