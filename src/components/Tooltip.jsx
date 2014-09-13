/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var Tooltip = React.createClass({

  addInClass: function(){
    if(this.isMounted() && !this.getDOMNode().classList.contains('in'))
      this.getDOMNode().classList.add('in');
  },

  render: function() {
    var that = this;
    var cx = React.addons.classSet;
    var classes = {};
    classes['tooltip'] = true;
    classes[this.props.placement] = true;
    // classes['in'] = this.props.positionLeft != null || this.props.positionTop != null;

    var style = {};
    style['left'] = this.props.positionLeft;
    style['top'] = this.props.positionTop;

    var arrowStyle = {};
    arrowStyle['left'] = this.props.arrowOffsetLeft;
    arrowStyle['top'] = this.props.arrowOffsetTop;

    setTimeout(function(){that.addInClass()}, 10);

    return (
      <div className={cx(classes) + ' ' + this.props.moreClasses || ''} style={style} onMouseOut={this.props.onMouseOut}>
          <div className="tooltip-arrow" style={arrowStyle} />
          <div className="tooltip-inner">
            {this.props.children}
          </div>
        </div>
    );
  }

});

module.exports = Tooltip;