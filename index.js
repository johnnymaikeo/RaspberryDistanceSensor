const Gpio = require('pigpio').Gpio;
const OnOff = require('onoff').Gpio;

const MICROSECONDS_PER_CM = 1e6/34321;

const LED = new OnOff(4, 'out');
const trigger = new Gpio(23, { mode: Gpio.OUTPUT });
const echo = new Gpio(24, { mode: Gpio.INPUT, alert: true });

trigger.digitalWrite(0);

let ledOn = false;

const watchHCSR04 = () => {
	let startTick;
	echo.on('alert', (level, tick) => {
		if (level == 1) {
			startTick = tick;
		} else {
			const endTick = tick;
			const diff = (endTick >> 0) - (startTick >> 0);
			const dist = diff / 2 / MICROSECONDS_PER_CM;
			if (dist > 10) {
				switchOff();
			} else {
				switchOn()
			}
			console.log(dist);
		}
	});
};
watchHCSR04();
setInterval(() => {
	trigger.trigger(10, 1);
}, 1000);


function switchOff() {
	if (!ledOn) {
		return;
	}
	ledOn = false;
	LED.writeSync(0);
	//LED.unexport();
}

function switchOn() {
	if (ledOn) {
		return;
	}
	ledOn= true;
	LED.writeSync(1);
}
