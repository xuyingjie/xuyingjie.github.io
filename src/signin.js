var SignIn = React.createClass({

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
        window.localStorage.OSSAccessKeyId = user.OSSAccessKeyId;
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
