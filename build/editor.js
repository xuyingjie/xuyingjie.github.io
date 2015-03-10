var Editor = React.createClass({displayName: "Editor",
  mixins: [Router.State],

  getInitialState: function() {
    return {section: {id: '', title: '', content: ''}};
  },

  tick: function() {
    if (this.getParams().id){
      db.section.get(this.getParams().id, function(data){
        if (data) {
          this.setState({section: data});
          clearInterval(this.interval);
        }
      }.bind(this));
    }
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 5);  // 等待cache完成
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  handleTitleChange: function(event) {
    var x = this.state.section;
    x.title = event.target.value;
    this.setState({section: x});
  },
  handleContentChange: function(event) {
    var x = this.state.section;
    x.content = event.target.value;
    this.setState({section: x});
  },

  uploadFile: function(e){
    e.preventDefault();    // 阻止默认行为的发生。如跳转。

    var file = document.getElementById('file').files[0];

    var reader = new FileReader();
    reader.onload = function(e) {

      var key = "u/" + timeDiff();
      var progress = document.getElementById('upload-progress');
      var opts = {
        key: key,
        data: reader.result,
        token: publicKey,
        progress: progress
      };

      var xhr = upload(opts);
      xhr.onload = function() {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {

          var c = '\n<div name="enc-img" data-name="'+file.name+'" data-type="'+file.type+'" data-src="'+url+key+'"><span class="fa fa-spinner fa-pulse"></span></div>';
          var textarea = document.getElementById('content');
          insertText(textarea, c);

          var section = this.state.section;
          section.content = textarea.value;
          this.setState({section: section});

          document.getElementById("file").value = "";
          progress.value = 0;
        }
      }.bind(this);

    }.bind(this);
    reader.readAsArrayBuffer(file);
  },

  uploadSetToServer: function(e){
    e.preventDefault();
    this.props.uploadSetToServer(this.state.section);
  },

  render: function() {
    var x = this.state.section;
    // console.log(x);
    return (
      React.createElement("div", {className: "container-fluid"}, 

        React.createElement("form", {onSubmit: this.uploadSetToServer}, 
          React.createElement("div", {className: "form-group"}, 
            React.createElement("input", {type: "text", className: "form-control", placeholder: "key", onChange: this.handleTitleChange, value: x.title})
          ), 
          React.createElement("div", {className: "form-group"}, 
            React.createElement("textarea", {id: "content", className: "form-control", rows: "17", placeholder: "value", onChange: this.handleContentChange, value: x.content})
          ), 
          React.createElement("button", {type: "submit", className: "btn btn-default pull-right"}, "Save")
        ), 

        React.createElement("form", {encType: "multipart/form-data", onSubmit: this.uploadFile}, 
          React.createElement("input", {id: "file", type: "file", required: true, multiple: true, accept: true}), 
          React.createElement("button", {type: "submit", className: "btn btn-default"}, "Insert")
        ), 
        React.createElement("progress", {id: "upload-progress", min: "0", max: "100", value: "0"}, "0")

      )
    );
  }
});
