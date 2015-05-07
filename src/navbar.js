class Navbar extends React.Component {

  handleIndexClick(e) {
    e.preventDefault();
    this.refs.mainput.getDOMNode().value = '';
    location.href='#/';
  }
  handleLogoutClick(e) {
    e.preventDefault();
    this.props.logout();
  }
  handleLoginClick(e) {
    e.preventDefault();
    local = location.hash;
    location.href='#/login';
  }
  handleMainputChange(e) {
    e.preventDefault();
    var mainput = this.refs.mainput.getDOMNode().value;
    if (mainput.length > 1){
      location.href='#/s/' + mainput;
    } else if (mainput === '') {
      location.href='#/';
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
          <a className="nav-site" href="#/a">
            <span className="fa fa-plus" aria-hidden="true"></span>
          </a>
          <div className="nav-site" onDragOver={this.preventDefault} onDrop={this.drop.bind(this)}>
            <span className="fa fa-trash-o" aria-hidden="true"></span>
          </div>
          <span className="nav-site"></span>
          <a className="nav-site" onClick={this.handleLogoutClick.bind(this)}>
            <span className="fa fa-sign-out" aria-hidden="true"></span>
          </a>
        </div>
      );
    } else {
      button = (
        <div>
          <a className="nav-site" onClick={this.handleLoginClick.bind(this)}>
            <span className="fa fa-sign-in" aria-hidden="true"></span>
          </a>
        </div>
      );
    }

    return (
      <nav className="nav-main">
        <div className="wrap">
          <a className="nav-site nav-title" onClick={this.handleIndexClick.bind(this)}>{siteTitle}</a>
          <form className="nav-form left" role="search" onSubmit={this.handleMainputChange.bind(this)}>
            <input type="text" className="form-control mainput" ref="mainput" onChange={this.handleMainputChange.bind(this)} />
          </form>
          <div className="right nav-right">
            {button}
          </div>
        </div>
      </nav>
    );
  }
}
