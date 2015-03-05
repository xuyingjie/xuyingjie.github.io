var Navbar = React.createClass({

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
        <div>
          <a className="navbar-brand" href="#/a">
            <span className="fa fa-plus" aria-hidden="true"></span>
          </a>
          <a className="navbar-brand" href="#/tasks">
            <span className="fa fa-tasks" aria-hidden="true"></span>
          </a>
          <a className="navbar-brand" href="#/folder">
            <span className="fa fa-folder" aria-hidden="true"></span>
          </a>
          <a className="navbar-brand" href onClick={this.handleLogoutClick}>
            <span className="fa fa-sign-out" aria-hidden="true"></span>
          </a>
        </div>
      );
    } else {
      button = (
        <div>
          <a className="navbar-brand" href onClick={this.handleLoginClick}>
            <span className="fa fa-sign-in" aria-hidden="true"></span>
          </a>
        </div>
      );
    }

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <a className="navbar-brand custom-title" href onClick={this.handleIndexClick}>KXMD</a>
          <form className="navbar-form navbar-left" role="search" onSubmit={this.handleMainputChange}>
            <input type="text" className="form-control mainput" ref="mainput" onChange={this.handleMainputChange} />
          </form>
          <div className="navbar-right">
            {button}
          </div>
        </div>
      </nav>
    );
  }
});
