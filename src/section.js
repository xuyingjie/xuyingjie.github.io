var Section = React.createClass({
  mixins: [Router.State],

  getInitialState: function() {
    return {section: [], keyword: ''};
  },

  query: function() {
    if (this.getParams().id){
      // console.log("*****ID");
      if (refresh){
        console.log("Index");
        db.section.get(this.getParams().id, function(data){
          if (data) {
            this.setState({section: [data]});
            refresh = false;
          }
        }.bind(this));
      }
    } else if (this.getParams().keyword) {
      // console.log("*****Qu");
      if(this.props.set.length !== 0){            // [] is ture!!!
        var keyword = this.getParams().keyword;
        if (keyword !== this.state.keyword || refresh){
          console.log("Query");
          var query = [];
          var s = new RegExp(keyword, "i");
          this.props.set.forEach(function(x){
            if (x.title.match(s) !== null || x.content.match(s) !== null) {
              query.push(x);
            }
          });
          this.setState({section: query});
          this.setState({keyword: keyword});
          refresh = false;
        }
      }
    }
  },

  componentDidMount: function() {
    refresh = true;
    this.query();
    this.interval = setInterval(this.query, 200);  // 脏检查,等待cache完成,检查keyword变化
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  render: function() {
    return (
      <div>
      {this.state.section.map(function(x){
        var button = <div></div>;
        if(this.props.auth){
          button = <a className="label label-default" href={"#/e/" + x.id}>编辑</a>;
        }
        var rawMarkup = converter.makeHtml(x.content);

        return (
          <div>
            <div className="container-fluid">
              <h3>{x.title}</h3>
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
});
