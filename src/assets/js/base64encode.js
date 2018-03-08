var escapeObj = (function() {

  return {
    encode: function(data) {
      var data1 = escape(data);
      return data1;
    }
  }

})(escapeObj||{})


var webGlObject = (function() {
  return {
    init: function() {
      alert('webGlObject initialized');
    }
  }
})(webGlObject||{})
