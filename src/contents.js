var Contents = React.createClass({

  render: function() {
    return (
      <div className="container-fluid">
        {this.props.contents.map(function(x){
          return <a className="btn btn-default" href={"#/t/" + x.id} role="button">{x.title}</a>;
        })}
      </div>
    );
  }
});
