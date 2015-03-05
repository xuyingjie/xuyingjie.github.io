var SignUp = React.createClass({displayName: "SignUp",

  handleSubmit: function(e) {
    e.preventDefault();

    var name = SHA256(this.refs.name.getDOMNode().value);
    var passwd = this.refs.passwd.getDOMNode().value;
    var token = this.refs.token.getDOMNode().value;
    var OSSAccessKeyId = this.refs.OSSAccessKeyId.getDOMNode().value;
    var OSSAccessKeySecret = this.refs.OSSAccessKeySecret.getDOMNode().value;

    var policyJson = {
      "expiration": "2024-12-01T12:00:00.000Z",
      "conditions": [
        {
          "bucket": bucket
        }
      ]
    };
    var policy = Base64(JSON.stringify(policyJson));
    var signature = CryptoJS.HmacSHA1(policy, OSSAccessKeySecret).toString(CryptoJS.enc.Base64);

    var user = {
      "passwd": SHA256(passwd),
      "token": encrypt(token, passwd),
      "OSSAccessKeyId": encrypt(OSSAccessKeyId, passwd),
      "policy": encrypt(policy, passwd),
      "signature": encrypt(signature, passwd)
    };
    var file = new Blob([JSON.stringify(user)], {"type": "text\/json"});

    var formData = new FormData();
    formData.append('OSSAccessKeyId', OSSAccessKeyId);
    formData.append('policy', policy);
    formData.append('signature', signature);

    formData.append('Content-Type', file.type);
    formData.append('key', name);
    formData.append("file", file); // 文件或文本内容，必须是表单中的最后一个域。

    var xhr = new XMLHttpRequest();

    xhr.onload = function() {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log("Success!");
        this.refs.status.getDOMNode().value = "Success!";
      }
    }.bind(this);

    xhr.open("POST", url, true);
    xhr.send(formData);
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
                React.createElement("input", {type: "text", className: "form-control", id: "inputPassword3", ref: "passwd"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {for: "token"}, "Token"), 
                React.createElement("input", {type: "text", className: "form-control", id: "token", ref: "token"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {for: "OSSAccessKeyId"}, "OSSAccessKeyId"), 
                React.createElement("input", {type: "text", className: "form-control", id: "OSSAccessKeyId", ref: "OSSAccessKeyId"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {for: "OSSAccessKeySecret"}, "OSSAccessKeySecret"), 
                React.createElement("input", {type: "text", className: "form-control", id: "OSSAccessKeySecret", ref: "OSSAccessKeySecret"})
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
