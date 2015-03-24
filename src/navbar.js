class Navbar extends React.Component {

  handleIndexClick(e) {
    e.preventDefault();
    this.refs.mainput.getDOMNode().value = '';
    location.href="#/";
  }
  handleLogoutClick(e) {
    e.preventDefault();
    this.props.logout();
  }
  handleLoginClick(e) {
    e.preventDefault();
    local = location.hash;
    location.href="#/login";
  }
  handleMainputChange(e) {
    e.preventDefault();
    var mainput = this.refs.mainput.getDOMNode().value;
    if (mainput.length > 1){
      location.href="#/s/" + mainput;
    } else if (mainput === '') {
      location.href="#/";
    }
  }

  preventDefault(e) {
    e.preventDefault();
  }

  drop(e) {
    e.preventDefault();
    var key = e.dataTransfer.getData('key');
    if (key !== ''){
      this.props.erase(key);
    }
  }

  render() {
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
          <div className="navbar-brand" onDragOver={this.preventDefault} onDrop={this.drop.bind(this)}>
            <span className="fa fa-trash" aria-hidden="true"></span>
          </div>
          <span className="navbar-brand"></span>
          <a className="navbar-brand" href onClick={this.handleLogoutClick.bind(this)}>
            <span className="fa fa-sign-out" aria-hidden="true"></span>
          </a>
        </div>
      );
    } else {
      button = (
        <div>
          <a className="navbar-brand" href onClick={this.handleLoginClick.bind(this)}>
            <span className="fa fa-sign-in" aria-hidden="true"></span>
          </a>
        </div>
      );
    }

    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand custom-title" href onClick={this.handleIndexClick.bind(this)}>{siteTitle}</a>
          <form className="navbar-form navbar-left" role="search" onSubmit={this.handleMainputChange.bind(this)}>
            <input type="text" className="form-control mainput" ref="mainput" onChange={this.handleMainputChange.bind(this)} />
          </form>
          <div className="navbar-right">
            {button}
          </div>
        </div>
      </nav>
    );
  }
}
