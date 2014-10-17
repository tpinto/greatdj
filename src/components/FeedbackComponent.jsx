/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactTransitionGroup = React.addons.TransitionGroup;

var FeedbackComponent = React.createClass({

  handleSubmitFeedback: function(){
    console.log('okok');
  },

  handleDispose: function(){
    this.props.handleDispose();
  },

  render: function() {
    var contents = this.props.show ? (
      <div id="feedback-form">
        <div className="backdrop"></div>
        <div className="form">
        <h3>Feedback form</h3>
          <p>Thanks so much for your feedback! :)</p>
          <textarea></textarea>
          <label>Leave a Contact? (twitter, email, whatever, optional)</label>
          <input type="text" name="contact" />

          <button onClick={this.handleDispose}>Cancel</button>
          <button onClick={this.handleSubmitFeedback}>Submit</button>
        </div>
      </div>
    ) : <span/>;

    return (
      <ReactTransitionGroup transitionName="fade" component={React.DOM.div}>
        {contents}
      </ReactTransitionGroup>
    );
  }

});

module.exports = FeedbackComponent;