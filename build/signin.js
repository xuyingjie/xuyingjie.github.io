var SignIn = React.createClass({displayName: "SignIn",

  handleSubmit: function(e) {
    e.preventDefault();

    var name = this.refs.name.getDOMNode().value;
    var passwd = this.refs.passwd.getDOMNode().value;

    ajaxArrayBuffer({
      url: url + name,
      json: true,
      token: passwd,
      success: function(data){
        // console.log(data);
        var user = data.user;
        window.localStorage.token = user.token;
        window.localStorage.AK = user.AK;
        window.localStorage.policy = user.policy;
        window.localStorage.signature = user.signature;

        this.props.login();
        this.refs.name.getDOMNode().value = '';
        this.refs.passwd.getDOMNode().value = '';
      }.bind(this)
    });
  },

  render: function() {
    return (
      React.createElement("div", {className: "container-fluid"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-sm-5"}, 

            React.createElement("form", {onSubmit: this.handleSubmit}, 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "inputName3"}, "Name"), 
                React.createElement("input", {type: "text", className: "form-control", id: "inputName3", ref: "name"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "inputPassword3"}, "Password"), 
                React.createElement("input", {type: "password", className: "form-control", id: "inputPassword3", ref: "passwd"})
              ), 
              React.createElement("button", {type: "submit", className: "btn btn-default"}, "Sign in")
            )

          )
        )
      )
    );
  }
});
