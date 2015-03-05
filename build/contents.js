var Contents = React.createClass({displayName: "Contents",

  render: function() {
    return (
      React.createElement("div", {className: "container-fluid"}, 
        this.props.contents.map(function(x){
          return React.createElement("a", {className: "btn btn-default", href: "#/t/" + x.id, role: "button"}, x.title);
        })
      )
    );
  }
});
