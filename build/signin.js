var SignIn = React.createClass({displayName: "SignIn",

  handleSubmit: function(e) {
    e.preventDefault();

    var name = SHA256(this.refs.name.getDOMNode().value);
    var passwd = this.refs.passwd.getDOMNode().value;

    ajax({
      url: url + name,
      method: "GET",
      success: function(data){
        // console.log(data);
        if (data.passwd === SHA256(passwd)) {
          window.localStorage.token = decrypt(data.token, passwd);
          window.localStorage.OSSAccessKeyId = decrypt(data.OSSAccessKeyId, passwd);
          window.localStorage.policy = decrypt(data.policy, passwd);
          window.localStorage.signature = decrypt(data.signature, passwd);

          this.props.login();
          this.refs.name.getDOMNode().value = '';
          this.refs.passwd.getDOMNode().value = '';
        }
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
                React.createElement("label", {for: "inputName3"}, "Name"), 
                React.createElement("input", {type: "text", className: "form-control", id: "inputName3", ref: "name"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {for: "inputPassword3"}, "Password"), 
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
