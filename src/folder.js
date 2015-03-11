var Folder = React.createClass({

  getInitialState: function() {
    return {list: []};
  },

  componentDidMount: function() {
    ajaxArrayBuffer({
      url: url + "folder/list",
      json: true,
      token: window.localStorage.token,
      success: function(data){
        this.setState({list: data.list});
      }.bind(this)
    });
  },

  download: function(file){
    var progress = document.getElementById(file.id);

    ajaxArrayBuffer({
      url: file.url,
      token: window.localStorage.token,
      progress: progress,
      success: function(data){
        var blob = new Blob([data.buffer], {"type": file.type});
        var objecturl =  URL.createObjectURL(blob);

        // 生成下载
        var anchor = document.createElement("a");
        anchor.href = objecturl;
        anchor.download = file.name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);

        progress.value = 0;
      }
    });
  },

  uploadFile: function(e){
    e.preventDefault();

    var file = document.getElementById('file').files[0];

    var reader = new FileReader();
    reader.onload = function(e) {

      var key = "folder/" + timeDiff();
      var opts = {
        key: key,
        data: reader.result,
        token: window.localStorage.token,
        progress: document.getElementById('upload-progress')
      };

      var xhr = upload(opts);
      xhr.onload = function() {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {

          var d = {
            id: key,
            name: file.name,
            type: file.type,
            size: file.size,
            url: url + key
          };
          var list = this.state.list;
          list.push(d);

          var opts = {
            key: "folder/list",
            data: strToUTF8Arr(JSON.stringify({"list": list})),
            token: window.localStorage.token
          };

          var req = upload(opts);
          req.onload = function() {
            if ((req.status >= 200 && req.status < 300) || req.status == 304) {
              console.log("Upload!!!");

              this.setState({list: list});
              document.getElementById("file").value = "";
              document.getElementById('upload-progress').value = 0;
            }
          }.bind(this);

        }
      }.bind(this);

    }.bind(this);
    reader.readAsArrayBuffer(file);

  },

  render: function() {
    var list = this.state.list.slice(0).reverse();

    return (
      <div className="container-fluid">

        <form encType="multipart/form-data" onSubmit={this.uploadFile}>
          <input id="file" type="file" required accept/>
          <button type="submit" className="btn btn-default">Insert</button>
        </form>
        <progress id="upload-progress" min="0" max="100" value="0">0</progress>

        <ul className="list-group">
          {list.map(function(x){
            return (
              <a className="list-group-item" key={x.id} href="#/folder" onClick={this.download.bind(this, x)}>
                <FileTypeIcons type={x.type} />&nbsp;
                {x.name}
                <span id={x.id} className="pull-right">{(x.size/1024).toFixed(2) + "KB"}</span>
              </a>
            );
          }.bind(this))}
        </ul>

      </div>
    );
  }
});
