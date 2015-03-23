class Section extends React.Component {

  constructor(props) {
    super(props);
    this.state = {section: [], keyword: ''};
  }

  loadIMG(data){
    ajaxArrayBuffer({
      key: data.dataset.key,
      encrypt: false,
      uint8Arr: true,
      success: function(rep){

        let blob = new Blob([rep.buffer], {"type": data.dataset.type});
        let objecturl =  URL.createObjectURL(blob);

        let img = document.createElement("img");
        img.src = objecturl;

        data.replaceChild(img, data.firstElementChild);
        data.setAttribute("name", "dec-img");
      }
    });
  }

  imgEvent() {
    var encIMG = document.getElementsByName("enc-img");

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
      // console.log("*****ID");
      if (refresh){
        console.log("Index");
        db.section.get(params.id, function(data){
          if (data) {
            this.setState({section: [data]});
            refresh = false;
            this.imgEvent();
            window.onscroll = this.imgEvent.bind(this);  // 滚动加载图片
          }
        }.bind(this));
      }
    } else if (params.keyword !== '') {
      // console.log("*****Qu");
      if(this.props.set.length !== 0){            // [] is ture!!!
        var keyword = params.keyword;
        if (keyword !== this.state.keyword || refresh){
          console.log("Query");
          var query = [];
          var s = new RegExp(keyword, "i");
          for (let x of this.props.set) {
            if (x.title.match(s) !== null || x.content.match(s) !== null) {
              query.push(x);
            }
          }
          this.setState({section: query});
          this.setState({keyword: keyword});
          refresh = false;
          this.imgEvent();
          window.onscroll = this.imgEvent.bind(this);
        }
      }
    }
  }

  componentDidMount() {
    refresh = true;
    this.query();
    this.interval = setInterval(this.query.bind(this), 200);  // 脏检查,等待cache完成,检查keyword变化
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
      {this.state.section.map(function(x){
        var button = <div></div>;
        if(this.props.auth){
          button = <a className="label label-default" href={"#/e/" + x.id}>编辑</a>;
        }
        var converter = new Showdown.converter();
        var rawMarkup = converter.makeHtml(x.content);

        return (
          <div>
            <div className="container-fluid">
              <h2>{x.title}</h2>
              <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
              {button}
            </div>
            <hr />
          </div>
        );
      }.bind(this))}
      </div>
    );
  }
}
