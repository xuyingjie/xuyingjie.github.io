var SignUp = React.createClass({

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
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-5">

            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label for="inputName3">Name</label>
                <input type="text" className="form-control" id="inputName3" ref="name"/>
              </div>
              <div className="form-group">
                <label for="inputPassword3">Password</label>
                <input type="text" className="form-control" id="inputPassword3" ref="passwd"/>
              </div>
              <div className="form-group">
                <label for="token">Token</label>
                <input type="text" className="form-control" id="token" ref="token"/>
              </div>
              <div className="form-group">
                <label for="OSSAccessKeyId">OSSAccessKeyId</label>
                <input type="text" className="form-control" id="OSSAccessKeyId" ref="OSSAccessKeyId"/>
              </div>
              <div className="form-group">
                <label for="OSSAccessKeySecret">OSSAccessKeySecret</label>
                <input type="text" className="form-control" id="OSSAccessKeySecret" ref="OSSAccessKeySecret"/>
              </div>
              <button type="submit" className="btn btn-default">Sign up</button>
            </form>

          </div>
          <div className="col-sm-5">
            <textarea ref="status"/>
          </div>
        </div>
      </div>
    );
  }
});
