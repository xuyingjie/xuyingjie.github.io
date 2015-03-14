var SignUp = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();

    var name = this.refs.name.getDOMNode().value;
    var passwd = this.refs.passwd.getDOMNode().value;
    var token = this.refs.token.getDOMNode().value;
    var AK = this.refs.AK.getDOMNode().value;
    var SK = this.refs.SK.getDOMNode().value;

    var user = {
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
