window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var Key = {
  _pressed: {},

  W: 87,
  A: 65,
  S: 83,
  D: 68,

  T: 65 + getDif("T"),
  F: 65 + getDif("F"),
  G: 65 + getDif("G"),
  H: 65 + getDif("H"),
  
  Q: 65 + getDif("Q"),
  E: 65 + getDif("E"),
  
  SPACE: 32,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  },
  
  
  
};

function getDif(thisstr) {
  return thisstr.charCodeAt(0) - "A".charCodeAt(0);
}