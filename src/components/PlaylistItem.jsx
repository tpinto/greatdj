/**
 * @jsx React.DOM
 */

var React = require('react');
var dom = require('domquery');

var PlaylistItem = React.createClass({

  componentDidMount: function(){
    this.getDOMNode().addEventListener('dragstart', this.handleDragStart, false);

    this.getDOMNode().addEventListener('dragenter', this.handleDragEnter, false);
    this.getDOMNode().addEventListener('dragleave', this.handleDragLeave, false);
    this.getDOMNode().addEventListener('dragover', this.handleDragOver, false);

    this.getDOMNode().addEventListener('drop', this.handleDrop, false);
    this.getDOMNode().addEventListener('dragend', this.handleDragEnd, false);
  },

  // Drag and Drop
  handleDragStart: function(e){
    e.dataTransfer.setData('text/plain', this.props.position);
    setTimeout(function(){e.target.classList.add('dragged');}, 10);
  },

  handleDragOver: function(e){
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }
    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    return false;
  },

  handleDragEnter: function(e){
    if(e.target.tagName === 'SPAN' && e.target.classList.contains('drop-zone')){
      e.target.parentElement.classList.add('dragged-over');
    }
  },

  handleDragLeave: function(e){
    if(e.target.tagName === 'SPAN' && e.target.classList.contains('drop-zone')){
      e.target.parentElement.classList.remove('dragged-over');
    }
  },

  handleDrop: function(e){
    if (e.stopPropagation) {
     e.stopPropagation(); // stops the browser from redirecting.
    }

    e.dataTransfer.dropEffect = 'move';

    var target = e.target.tagName === "LI" ? e.target : dom(e.target).parent('li[draggable]')[0];

    if(target) {
      target.classList.remove('animate-margin');
      setTimeout(function(){target.classList.add('animate-margin');}, 100);
      this.props.switchPlaylistItems(e.dataTransfer.getData('text/plain'), target.attributes['data-pos'].value);
    } else {
      console.log('bode', e.target)
    }

    return false;
  },

  handleDragEnd: function(e){
    e.target.classList.remove('dragged');
    //
  },

  //

  componentDidUpdate: function(){
    this.getDOMNode().classList.remove('dragged-over');
  },

  handlePlayNow: function(e){
    console.log('handlePlayNow', e.target, e.target.tagName)
    if(e.target.tagName === 'SPAN' && e.target.classList.contains('delete')) return;
    this.props.handlePlayNow(this.props.position, this.props.video);
    return false;
  },

  handleDeleteEntry: function(){
    this.props.handleDeleteEntry(this.props.position, this.props.video);
    return false;
  },

  render: function() {
    return (
      <li draggable="true" onClick={this.handlePlayNow} className={this.props.classNames + ' animate-margin'} data-pos={this.props.position}>
        <span className="bars"><i className="fa fa-bars"></i></span>
        <span className="title">{ this.props.video.snippet.title }</span>
        <span className="delete" onClick={this.handleDeleteEntry}><i className="fa fa-trash-o"></i></span>
        <span className="drop-zone"></span>
      </li>
    );
  }

});

module.exports = PlaylistItem;