var SignUp = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();

    var name = this.refs.name.getDOMNode().value;
    var passwd = this.refs.passwd.getDOMNode().value;
    var token = this.refs.token.getDOMNode().value;
    var AK = this.refs.AK.getDOMNode().value;
    var SK = this.refs.SK.getDOMNode().value;

    var policyJson = {
      "expiration": "2024-12-01T12:00:00.000Z",
      "conditions": [
        {
          "bucket": bucket
        }
      ]
    };
    var policy = btoa(JSON.stringify(policyJson));
    var signature = asmCrypto.HMAC_SHA1.base64(policy, SK);

    var user = {
      "token": token,
      "AK": AK,
      "policy": policy,
      "signature": signature
    };
    var uint8Arr = asmCrypto.AES_CBC.encrypt(JSON.stringify({user: user}), passwd);
    blob = new Blob([uint8Arr.buffer], {type: 'application/octet-stream'});

    var formData = new FormData();
    formData.append('OSSAccessKeyId', AK);
    formData.append('policy', policy);
    formData.append('signature', signature);

    formData.append('Content-Type', blob.type);
    formData.append('key', name);
    formData.append("file", blob);

    var xhr = new XMLHttpRequest();

    xhr.onload = function() {
      if(xhr.readyState === 4){
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          console.log("Success!");
          this.refs.status.getDOMNode().value = "Success!";
        }
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
                <label htmlFor="inputName3">Name</label>
                <input type="text" className="form-control" id="inputName3" ref="name"/>
              </div>
              <div className="form-group">
                <label htmlFor="inputPassword3">Password</label>
                <input type="text" className="form-control" id="inputPassword3" ref="passwd"/>
              </div>
              <div className="form-group">
                <label htmlFor="token">Token</label>
                <input type="text" className="form-control" id="token" ref="token"/>
              </div>
              <div className="form-group">
                <label htmlFor="AK">AK</label>
                <input type="text" className="form-control" id="AK" ref="AK"/>
              </div>
              <div className="form-group">
                <label htmlFor="SK">SK</label>
                <input type="text" className="form-control" id="SK" ref="SK"/>
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
