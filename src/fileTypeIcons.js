var FileTypeIcons = React.createClass({

  render: function() {
    var icon = <div></div>;

    switch (this.props.type) {
      case "image/png":
      case "image/jpeg":
      case "image/vnd.microsoft.icon":
        icon = <i className="fa fa-file-image-o fa-fw fa-lg"></i>;
        break;
      case "application/x-xz":
      case "application/gzip":
      case "application/zip":
        icon = <i className="fa fa-file-archive-o fa-fw fa-lg"></i>;
        break;
      case "text/plain":
      case "text/x-markdown":
        icon = <i className="fa fa-file-text-o fa-fw fa-lg"></i>;
        break;
      case "application/pdf":
        icon = <i className="fa fa-file-pdf-o fa-fw fa-lg"></i>;
        break;
      case "application/msword":
      case "application/vnd.oasis.opendocument.text":
        icon = <i className="fa fa-file-word-o fa-fw fa-lg"></i>;
        break;
      default:
        icon = <i className="fa fa-file-o fa-fw fa-lg"></i>;
    }

    var divStyle = {display:"inline"};
    return <div style={divStyle}>{icon}</div>;
  }

});
