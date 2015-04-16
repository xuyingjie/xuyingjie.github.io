class File extends React.Component {

  dragStart(e) {
    let key = e.target.dataset.key;
    e.dataTransfer.setData('key', key);
    if (this.props.toErase) {
      this.props.toErase(key);
    }
  }

  render() {
    var x = this.props.data;
    return (
      <div>
        <a className="list-group-item" data-key={x.key} draggable='true' onDragStart={this.dragStart.bind(this)} onClick={this.props.download}>
          <i className={fileTypeIcons(x.type) + " fa-fw fa-lg"}></i>&nbsp;
          {x.name}
          <span className="right">{x.size}</span>
        </a>
        <div id={x.key} className="list-group-item progress-bar"></div>
      </div>
    );
  }
}
