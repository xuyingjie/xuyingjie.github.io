class Attachment extends React.Component {

  download(file, e) {
    e.preventDefault();

    var progress = false;
    if (document.getElementById(file.key)) {
      progress = document.getElementById(file.key);
    }

    ajaxArrayBuffer({
      key: file.key,
      arrayBuffer: true,
      progress,
      success: function(data) {
        var blob = new Blob([data], {
          'type': file.type
        });
        var objecturl = URL.createObjectURL(blob);

        // 生成下载
        var anchor = document.createElement('a');
        anchor.href = objecturl;

        // 新标签页打开
        // anchor.target = '_blank';

        // 直接下载
        anchor.download = file.name;

        document.body.appendChild(anchor);
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);

        if (progress) {
          progress.value = 0;
        }
      }
    });
  }

  render() {
    var x = this.props.data;
    var c;
    var inline = {
      display: 'inline-block'
    };
    var downloadIcon = {
      'display': 'block',
      'marginTop': '-17px',
      'marginRight': '1px',
      'cursor': 'pointer'
    };

    if (x.type === 'image/png' || x.type === 'image/jpeg' || x.type === 'image/vnd.microsoft.icon'){
      c = (
        <div>
          <div name="enc-img" data-name={x.name} data-type={x.type} data-key={x.key}>
            <i className="fa fa-spinner fa-pulse fa-2x"></i>
          </div>
          <div className="fa fa-external-link right" style={downloadIcon} onClick={this.download.bind(this, x)}></div>
        </div>
      );
    } else {
      c = (
        <div className="attachment">
          <File key={x.key} data={x} dragStart={this.props.dragStart} download={this.download.bind(this, x)} />
        </div>
      );
    }

    return <div style={inline}>{c}</div>;
  }
}

class File extends React.Component {

  render() {
    var x = this.props.data;

    // 省略过长的name
    var name = x.name;
    if (name.length > 14) {
      if (name.match(/[\u4e00-\u9fa5]/)) {
        name = name.substring(0, 14) + '...';
      } else {
        if (name.length > 24) {
          name = name.substring(0, 24) + '...';
        }
      }
    }

    return (
      <div>
        <a className="item" title={x.name} data-key={x.key} draggable='true' onDragStart={this.props.dragStart} onClick={this.props.download}>
          <i className={fileTypeIcons(x.type) + " fa-fw fa-lg"}></i>&nbsp;
          {name}
          <span className="right">{x.size}</span>
        </a>
        <div id={x.key} className="item progress-bar"></div>
      </div>
    );
  }
}
