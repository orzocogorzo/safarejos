module.exports = function (app, opts) {
  var reload = require('reload');
  return reload(app, opts);
}