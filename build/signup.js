var SignUp = React.createClass({displayName: "SignUp",

  handleSubmit: function(e) {
    e.preventDefault();

    var name = this.refs.name.getDOMNode().value;
    var passwd = this.refs.passwd.getDOMNode().value;
    var token = this.refs.token.getDOMNode().value;
    var AK = this.refs.AK.getDOMNode().value;
    var SK = this.refs.SK.getDOMNode().value;

    var user = {
      // qn: {
      //   "AK": '',
      //   "policy": '=',
      //   "signature": '='
      // },
      // oss: {
      //   "AK": '',
      //   "policy": '=',
      //   "signature": '='
      // },
      "AK": AK,
      "SK": SK,
      "token": token
    };

    localStorage.token = token;
    localStorage.user = JSON.stringify(user);

    upload({
      key: name,
      data: strToUTF8Arr(JSON.stringify({user: user})),
      token: passwd,
      success: function() {
        console.log("Success!");
        this.refs.status.getDOMNode().value = "Success!";
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
                React.createElement("input", {type: "text", className: "form-control", id: "inputPassword3", ref: "passwd"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "token"}, "Token"), 
                React.createElement("input", {type: "text", className: "form-control", id: "token", ref: "token"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "AK"}, "AK"), 
                React.createElement("input", {type: "text", className: "form-control", id: "AK", ref: "AK"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "SK"}, "SK"), 
                React.createElement("input", {type: "text", className: "form-control", id: "SK", ref: "SK"})
              ), 
              React.createElement("button", {type: "submit", className: "btn btn-default"}, "Sign up")
            )

          ), 
          React.createElement("div", {className: "col-sm-5"}, 
            React.createElement("textarea", {ref: "status"})
          )
        )
      )
    );
  }
});
