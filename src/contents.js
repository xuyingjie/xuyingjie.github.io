var Contents = React.createClass({

  getInitialState: function() {
    return {contents: []};
  },

  sort: function() {
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
  },
  componentDidMount: function() {
    this.interval = setInterval(this.sort, 5);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  render: function() {
    return (
      <div className="container-fluid">
        {this.state.contents.map(function(x){
          return <a className="btn btn-default" href={"#/t/" + x.id} role="button">{x.title}</a>;
        })}
      </div>
    );
  }
});
