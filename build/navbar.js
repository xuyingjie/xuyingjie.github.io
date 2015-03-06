var Navbar = React.createClass({displayName: "Navbar",

  handleIndexClick: function(e) {
    e.preventDefault();
    this.refs.mainput.getDOMNode().value = '';
    location.href="#/";
  },
  handleLogoutClick: function(e) {
    e.preventDefault();
    this.props.logout();
  },
  handleLoginClick: function(e) {
    e.preventDefault();
    local = location.hash;
    location.href="#/login";
  },
  handleMainputChange: function(e) {
    e.preventDefault();
    var mainput = this.refs.mainput.getDOMNode().value;
    if (mainput.length > 1){
      location.href="#/s/" + mainput;
    } else if (mainput === '') {
      location.href="#/";
    }
  },

  render: function() {
    var button;
    if(this.props.auth){
      button = (
        React.createElement("div", null, 
          React.createElement("a", {className: "navbar-brand", href: "#/a"}, 
            React.createElement("span", {className: "fa fa-plus", "aria-hidden": "true"})
          ), 
          React.createElement("a", {className: "navbar-brand", href: "#/tasks"}, 
            React.createElement("span", {className: "fa fa-tasks", "aria-hidden": "true"})
          ), 
          React.createElement("a", {className: "navbar-brand", href: "#/folder"}, 
            React.createElement("span", {className: "fa fa-folder", "aria-hidden": "true"})
          ), 
          React.createElement("span", {className: "navbar-brand"}), 
          React.createElement("a", {className: "navbar-brand", href: true, onClick: this.handleLogoutClick}, 
            React.createElement("span", {className: "fa fa-sign-out", "aria-hidden": "true"})
          )
        )
      );
    } else {
      button = (
        React.createElement("div", null, 
          React.createElement("a", {className: "navbar-brand", href: true, onClick: this.handleLoginClick}, 
            React.createElement("span", {className: "fa fa-sign-in", "aria-hidden": "true"})
          )
        )
      );
    }

    return (
      React.createElement("nav", {className: "navbar navbar-default"}, 
        React.createElement("div", {className: "container-fluid"}, 
          React.createElement("a", {className: "navbar-brand custom-title", href: true, onClick: this.handleIndexClick}, "KXMD"), 
          React.createElement("form", {className: "navbar-form navbar-left", role: "search", onSubmit: this.handleMainputChange}, 
            React.createElement("input", {type: "text", className: "form-control mainput", ref: "mainput", onChange: this.handleMainputChange})
          ), 
          React.createElement("div", {className: "navbar-right"}, 
            button
          )
        )
      )
    );
  }
});
