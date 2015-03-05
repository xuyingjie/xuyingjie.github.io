var Contents = React.createClass({displayName: "Contents",

  getInitialState: function() {
    return {contents: []};
  },

  sort: function() {
    if (this.state.contents.length === 0){
      var c = [];
      if (this.props.auth){
        // 修改时间排序
        c = this.props.contents.sort(function(a, b){
          return b.timestamp - a.timestamp;
        });
      } else {
        // 字母排序
        c = this.props.contents.sort(function(a, b){
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
      React.createElement("div", {className: "container-fluid"}, 
        this.state.contents.map(function(x){
          return React.createElement("a", {className: "btn btn-default", href: "#/t/" + x.id, role: "button"}, x.title);
        })
      )
    );
  }
});
