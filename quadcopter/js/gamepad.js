
var haveEvents = 'GamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {

}
function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  delete controllers[gamepad.index];
}

function updateStatus() {
    scangamepads();
    for (j in controllers) {
        var controller = controllers[j];
        for (var i=0; i<controller.buttons.length; i++) {
            // Do something with the buttons
        }

        // X-axis is index 0
        if(writePermission) {
            var x = controller.axes[0];
            var y = 0;

            if( x > 0.1) {
                exCharVal[5] = 200 * x;
                exCharVal[6] = 0;
            }
            else if(x < -0.1) {
                exCharVal[5] = 0;
                exCharVal[6] = -1 * 200 * x;
            }
            else {
                exCharVal[5] = 0;
                exCharVal[6] = 0;
            }

            if(y > 0.1)
                y = -1 *(controller.axes[1] * 255)
            else
                y = 0;

            exCharVal[0] = y;

            writeArrayToChar(exChar, exCharVal);
        }
    }
    rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}
