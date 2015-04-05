/**
 * @jsx React.DOM
 */

var React = require('react/addons')

var OverlayTrigger = React.createClass({
  getInitialState: function(){
    return {
      isOverlayShown: false,
      overlayLeft: null,
      overlayTop: null
    };
  },

  getDefaultProps: function () {
    return {
      placement: 'right',
      trigger: 'hover'
    };
  },

  componentDidUpdate: function () {
    this._renderOverlay();
  },

  componentDidMount: function () {
    this._renderOverlay();
  },

  _mountOverlayTarget: function () {
    this._overlayTarget = document.createElement('div');
    document.body
      .appendChild(this._overlayTarget);
  },

  _renderOverlay: function () {
    if (!this._overlayTarget) {
      this._mountOverlayTarget();
    }

    this._overlayInstance = React.render(this.renderOverlay(), this._overlayTarget);
  },

  show: function () {
    this.setState({
      isOverlayShown: true
    }, function() {
      this.updateOverlayPosition();
    });
  },

  hide: function () {
    this.setState({
      isOverlayShown: false
    });
  },

  toggle: function () {
    this.state.isOverlayShown ?
      this.hide() : this.show();
  },

  handleDelayedShow: function(){
    this.show();
  },

  handleDelayedHide: function(){
    this.hide();
  },

  render: function () {
    if (this.props.trigger === 'manual') {
      return React.Children.only(this.props.children);
    }

    var props = {},
        that = this;

    if (this.props.trigger === 'click') {
      props.onClick = function(){that.toggle(); }
    }

    if (this.props.trigger === 'hover') {
      props.onMouseOver = function(){ that.handleDelayedShow(); }
      props.onMouseOut = function(e){
        var trigger = true;

        var children = that.getDOMNode().children;
        if(children &&
          (children.indexOf(e.target) > -1 || e.target === that.getDOMNode()) &&
          (children.indexOf(e.relatedTarget) > -1 || e.relatedTarget === that.getDOMNode()))
          trigger = false;

        if(e.relatedTarget.classList.contains('tooltip'))
          trigger = false;

        if(trigger) that.handleDelayedHide();
      }
    }

    if (this.props.trigger === 'focus') {
      props.onFocus = function(){that.handleDelayedShow(); }
      props.onBlur = function(){that.handleDelayedHide(); }
    }

    return React.addons.cloneWithProps(
      React.Children.only(this.props.children),
      props
    );
  },

 renderOverlay: function () {
    if (!this.state.isOverlayShown) {
      return <span />;
    }

    return React.addons.cloneWithProps(
      this.props.overlay,
      {
        onRequestHide: this.hide,
        placement: this.props.placement,
        positionLeft: this.state.overlayLeft,
        positionTop: this.state.overlayTop,
        onMouseOut: this.overlayMouseOut,
      }
    );
  },

  overlayMouseOut: function(e){
    if(this.props.trigger === 'hover')
      this.hide();
  },

  calcOverlayPosition: function () {
    var childOffset = this.getPosition();

    var overlayNode = this._overlayInstance.getDOMNode();
    var overlayHeight = overlayNode.offsetHeight;
    var overlayWidth = overlayNode.offsetWidth;

    switch (this.props.placement) {
      case 'right':
        return {
          top: childOffset.top + childOffset.height / 2 - overlayHeight / 2,
          left: childOffset.left + childOffset.width
        };
      case 'left':
        return {
          top: childOffset.top + childOffset.height / 2 - overlayHeight / 2,
          left: childOffset.left - overlayWidth
        };
      case 'top':
        return {
          top: childOffset.top - overlayHeight,
          left: childOffset.left + childOffset.width / 2 - overlayWidth / 2
        };
      case 'bottom':
        return {
          top: childOffset.top + childOffset.height,
          left: childOffset.left + childOffset.width / 2 - overlayWidth / 2
        };
      default:
        throw new Error('calcOverlayPosition(): No such placement of "' + this.props.placement + '" found.');
    }
  },

  updateOverlayPosition: function () {
    if (!this.isMounted()) {
      return;
    }

    var pos = this.calcOverlayPosition();

    this.setState({
      overlayLeft: pos.left,
      overlayTop: pos.top
    });
  },


  getPosition: function () {
    var node = this.getDOMNode();

    return {
      top: node.offsetTop,
      left: node.offsetLeft,
      height: node.offsetHeight,
      width: node.offsetWidth
    };
  }


});

module.exports = OverlayTrigger;