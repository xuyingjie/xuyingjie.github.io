var SignIn = React.createClass({

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
                <input type="password" className="form-control" id="inputPassword3" ref="passwd"/>
              </div>
              <button type="submit" className="btn btn-default">Sign in</button>
            </form>

          </div>
        </div>
      </div>
    );
  }
});
