var Folder = React.createClass({

  getInitialState: function() {
    return {list: []};
  },

  componentDidMount: function() {
    ajaxArrayBuffer({
      key: "folder/list",
      token: localStorage.token,
      success: function(data){
        this.setState({list: data.list});
      }.bind(this)
    });
  },

  download: function(file){
    nDown(file.name, file.type, file.key, localStorage.token);
  },

  uploadFile: function(e){
    e.preventDefault();

    var file = document.getElementById('file').files[0];

    var reader = new FileReader();
    reader.onload = function(e) {

      var key = "folder/" + timeDiff();

      upload({
        key: key,
        data: reader.result,
        token: localStorage.token,
        progress: document.getElementById('upload-progress'),
        success: function() {

          var d = {
            key: key,
            name: file.name,
            type: file.type,
            size: file.size
          };
          var list = this.state.list;
          list.push(d);

          upload({
            key: "folder/list",
            data: strToUTF8Arr(JSON.stringify({"list": list})),
            token: localStorage.token,
            success: function() {
              console.log("Upload!!!");

              this.setState({list: list});
              document.getElementById("file").value = "";
              document.getElementById('upload-progress').value = 0;
            }.bind(this)
          });

        }.bind(this)
      });

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
              <a className="list-group-item" key={x.key} href="#/folder" onClick={this.download.bind(this, x)}>
                <i className={fileTypeIcons(x.type) + " fa-fw fa-lg"}></i>&nbsp;
                {x.name}
                <span id={x.key} className="pull-right">{(x.size/1024).toFixed(2) + "KB"}</span>
              </a>
            );
          }.bind(this))}
        </ul>

      </div>
    );
  }
});
