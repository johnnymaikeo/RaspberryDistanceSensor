const OnOff = require('onoff').Gpio;
const LED = new OnOff(4, 'out');

LED.writeSync(1);

function switchOff() {
		LED.writeSync(0);
		LED.unexport();
}

setTimeout(switchOff, 5000);
