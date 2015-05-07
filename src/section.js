class Section extends React.Component {

  constructor(props) {
    super(props);
    this.state = {section: [], keyword: ''};
  }

  dragStart(e) {
    var key = e.target.dataset.key;
    e.dataTransfer.setData('key', key);
  }

  loadIMG(data){
    ajaxArrayBuffer({
      key: data.dataset.key,
      arrayBuffer: true,
      success: function(rep) {

        var blob = new Blob([rep], {'type': data.dataset.type});
        var objecturl =  URL.createObjectURL(blob);

        var img = document.createElement('img');
        img.src = objecturl;
        img.title = data.dataset.name;

        img.dataset.key = data.dataset.key;
        img.ondragstart = this.dragStart;

        data.replaceChild(img, data.firstElementChild);
        data.setAttribute('name', 'dec-img');
      }.bind(this)
    });
  }

  imgEvent() {
    var encIMG = document.getElementsByName('enc-img');
// console.log('a');
    for (let i = 0; i < encIMG.length; i++){
      let top = encIMG[i].getBoundingClientRect().top;
      if ( top > 0 && top < window.innerHeight){
        this.loadIMG(encIMG[i]);
      }
    }
  }

  query() {

    var params = {
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
        return <Fragment key={x.id} data={x} auth={this.props.auth} dragStart={this.dragStart.bind(this)} />;
      }.bind(this))}
      </div>
    );
  }
}

class Fragment extends React.Component {
  render() {
    var x = this.props.data;
    var title = <h1>{x.title}</h1>;
    if(this.props.auth){
      title = <h1><a href={"#/e/" + x.id} title="编辑">{x.title}</a></h1>;
    }

    // 处理Markdown文本中 ![name, type, size, key] 标记
    var parts = x.content.split(/(!\[.*?,.*?,.*?,.*?\])/);
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        if (parts[i] !== '') {
          var rawMarkup = md.render(parts[i]);
          parts[i] = <section dangerouslySetInnerHTML={{__html: rawMarkup}}></section>;
        }
      } else {
        var m = parts[i].match(/!\[(.*?),(.*?),(.*?),(.*?)\]/);

        var data = {
          name: m[1],
          size: m[2],
          type: m[3],
          key: m[4]
        };
        parts[i] =  <Attachment data={data} dragStart={this.props.dragStart} />;
      }
    }

    return (
      <div>
        <article className="wrap">
          {title}
          {parts}
        </article>
        <hr />
      </div>
    );
  }
}
