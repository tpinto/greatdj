window.React = require('react');

// some things should just work...
NodeList.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.indexOf = Array.prototype.indexOf;
HTMLCollection.prototype.forEach = Array.prototype.forEach;

// CustomEvent Polyfill for older browsers and IE
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   };

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

// Google Analytics tracking
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-38568098-2', 'auto');
ga('send', 'pageview');

window.DATA = JSON.parse(atob(window.RAW));

// application wide initizalizations
window.app = {
	baseTitle: 'GREAT DJ!'
};

// Start App
require('./components/StateHandler');
