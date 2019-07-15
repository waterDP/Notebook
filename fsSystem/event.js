  const util = require('util');
  const events = require('events');

  function Pulsar(speed, times) {
  	events.EventEmitter.call(this);

  	this.speed = speed;
  	this.times = times;

  	this.on('newListener', (eventName, listener) => {
  		if (eventName === 'pulse') {
  			this.start();
  		}
  	});
  }

  util.inherits(Pulsar, events.EventEmitter);

  Pulsar.prototype.start = function() {
  	let id = setInterval(() => {
  		this.emit('pulse');
  		this.times--;
  		if (this.times === 0) {
  			clearInterval(id);
  		}
  	}, this.speed);
  };

  const pulsar = new Pulsar(500, 5);

  pulsar.on('pulse', () => {
  	console.log('.');
  });

  // pulsar.emit('pulse');