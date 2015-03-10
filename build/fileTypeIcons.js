var FileTypeIcons = React.createClass({displayName: "FileTypeIcons",

  render: function() {
    var icon = React.createElement("div", null);

    switch (this.props.type) {
      case "image/png":
      case "image/jpeg":
      case "image/vnd.microsoft.icon":
        icon = React.createElement("i", {className: "fa fa-file-image-o fa-fw fa-lg"});
        break;
      case "application/x-xz":
      case "application/gzip":
      case "application/zip":
        icon = React.createElement("i", {className: "fa fa-file-archive-o fa-fw fa-lg"});
        break;
      case "text/plain":
      case "text/x-markdown":
        icon = React.createElement("i", {className: "fa fa-file-text-o fa-fw fa-lg"});
        break;
      case "application/pdf":
        icon = React.createElement("i", {className: "fa fa-file-pdf-o fa-fw fa-lg"});
        break;
      case "application/msword":
      case "application/vnd.oasis.opendocument.text":
        icon = React.createElement("i", {className: "fa fa-file-word-o fa-fw fa-lg"});
        break;
      default:
        icon = React.createElement("i", {className: "fa fa-file-o fa-fw fa-lg"});
    }

    var divStyle = {display:"inline"};
    return React.createElement("div", {style: divStyle}, icon);
  }

});
