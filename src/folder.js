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
        console.log(data);

        this.setState({list: data.list});

      }.bind(this)
    });
  },

  download: function(file){
    ajaxArrayBuffer({
      url: file.url,
      token: window.localStorage.token,
      success: function(data){
        var blob = new Blob([data.buffer], {"type": file.type});
        var objecturl =  URL.createObjectURL(blob);
        console.log(objecturl);

        // 生成下载
        var anchor = document.createElement("a");
        anchor.href = objecturl;
        anchor.download = file.name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);

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
            name: file.name,
            type: file.type,
            size: file.size,
            url: url + key
          };
          var list = this.state.list;
          list.push(d);

          var opts = {
            key: "folder/list",
            data: JSON.stringify({"list": list}),
            token: window.localStorage.token
          };

          var req = upload(opts);
          req.onload = function() {
            if ((req.status >= 200 && req.status < 300) || req.status == 304) {
              console.log("Upload!!!");

              // this.setState({list: list});
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
    return (
      <div className="container-fluid">

        <form encType="multipart/form-data" onSubmit={this.uploadFile}>
          <input id="file" type="file" required multiple accept/>
          <button type="submit" className="btn btn-default">Insert</button>
        </form>
        <progress id="upload-progress" min="0" max="100" value="0">0</progress>

        <ul className="list-group">
          {this.state.list.map(function(x){
            return (
              <li className="list-group-item" key={x.url} onClick={this.download.bind(this, x)}>
                {x.name}
                <span className="pull-right">{(x.size/1024).toFixed(2) + "KB"}</span>

              </li>
            );
          }.bind(this))}
        </ul>

      </div>
    );
  }
});
