var config = require('./config.js');
var Camera = require('./camera.js');
var DiffRobot = require('./diffRobot.js');

function App (config) {
    var camera = new Camera(config.browsers);
    var diffRobot = new DiffRobot();
}

new App(config);
