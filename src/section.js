class Section extends React.Component {

  constructor(props) {
    super(props);
    this.state = {section: [], keyword: ''};
  }

  loadIMG(data){
    ajaxArrayBuffer({
      key: data.dataset.key,
      arrayBuffer: true,
      success: function(rep){

        let blob = new Blob([rep], {'type': data.dataset.type});
        let objecturl =  URL.createObjectURL(blob);

        let img = document.createElement('img');
        img.src = objecturl;

        img.dataset.key = data.dataset.key;
        img.ondragstart = dragStart;

        data.replaceChild(img, data.firstElementChild);
        data.setAttribute('name', 'dec-img');
      }
    });
  }

  imgEvent() {
    var encIMG = document.getElementsByName('enc-img');
console.log('a');
    for (let i = 0; i < encIMG.length; i++){
      let top = encIMG[i].getBoundingClientRect().top;
      if ( top > 0 && top < window.innerHeight){
        this.loadIMG(encIMG[i]);
      }
    }
  }

  query() {

    let params = {
      id: '',
      keyword: ''
    };
    if (location.hash.slice(2,3) === 't'){
      params.id = location.hash.slice(4);
    } else {
      params.keyword = location.hash.slice(4);
    }

    if (params.id !== ''){
      // console.log('*****ID');
      if (refresh){
        console.log('Index');
        db.section.get(params.id, function(data){
          if (data) {
            this.setState({section: [data]});
            refresh = false;
            if (document.getElementsByName('enc-img').length !== 0) {
              this.imgEvent();

              // 滚动加载图片
              window.onscroll = this.imgEvent.bind(this);
            } else {
              window.onscroll = null;
            }
          }
        }.bind(this));
      }
    } else if (params.keyword !== '') {
      // console.log('*****Qu');

      // [] is ture!!!
      if(this.props.set.length !== 0){
        var keyword = params.keyword;
        if (keyword !== this.state.keyword || refresh){
          console.log('Query');
          var query = [];
          var s = new RegExp(keyword, 'i');
          for (let x of this.props.set) {
            if (x.title.match(s) !== null || x.content.match(s) !== null) {
              query.push(x);
            }
          }
          this.setState({section: query});
          this.setState({keyword: keyword});
          refresh = false;
          if (document.getElementsByName('enc-img').length !== 0) {
            this.imgEvent();
            window.onscroll = this.imgEvent.bind(this);
          } else {
            window.onscroll = null;
          }
        }
      }
    }
  }

  componentDidMount() {
    refresh = true;
    this.query();

    // 脏检查,等待cache完成,检查keyword变化
    this.interval = setInterval(this.query.bind(this), 200);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
      {this.state.section.map(function(x){
        return <Fragment key={x.id} data={x} auth={this.props.auth} />;
      }.bind(this))}
      </div>
    );
  }
}

class Fragment extends React.Component {
  render() {
    var x = this.props.data;
    var button = <div></div>;
    if(this.props.auth){
      button = <div><a href={"#/e/" + x.id}>编辑</a></div>;
    }

    // 处理Markdown文本中 ![name, type, size, key] 标记
    var parts = x.content.split(/(!\[.*?,.*?,.*?,.*?\])/);
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        if (parts[i] !== '') {
          var rawMarkup = md.render(parts[i]);
          parts[i] = <div dangerouslySetInnerHTML={{__html: rawMarkup}}></div>;
        }
      } else {
        let m = parts[i].match(/!\[(.*?),(.*?),(.*?),(.*?)\]/);

        // 省略过长的name
        if (m[1].length > 12) {
          if (m[1].match(/[\u4e00-\u9fa5]/)) {
            m[1] = m[1].substring(0, 11) + '...';
          } else {
            if (m[1].length > 21) {
              m[1] = m[1].substring(0, 18) + '...';
            }
          }
        }

        var data = {
          name: m[1],
          size: m[2],
          type: m[3],
          key: m[4]
        };
        parts[i] =  <Attachment data={data} />;
      }
    }

    return (
      <div>
        <div className="wrap">
          <h1>{x.title}</h1>
          {parts}
          {button}
        </div>
        <hr />
      </div>
    );
  }
}

class Attachment extends React.Component {

  download(file){
    nDown(file.name, file.type, file.key);
  }

  render() {
    var x = this.props.data;
    var c;
    var inline = {
      display: 'inline-block'
    };

    if (x.type === 'image/png' || x.type === 'image/jpeg' || x.type === 'image/vnd.microsoft.icon'){
      c = (
        <div name="enc-img" data-name={x.name} data-type={x.type} data-key={x.key}>
          <i className="fa fa-spinner fa-pulse fa-2x"></i>
        </div>
      );
    } else {
      c = (
        <div className="attachment">
          <File key={x.key} data={x} download={this.download.bind(this, x)} />
        </div>
      );
    }

    return <div style={inline}>{c}</div>;
  }
}
