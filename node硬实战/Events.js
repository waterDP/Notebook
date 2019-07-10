... 从EventEmitter继承
	const util = require('util');
	const events = require('events');

	function MusicPlayer() {
		events.EventEmitter.call(this);
	}

	util.inherits(MusicPlayer, events.Emitter);

... 从EventEmitter继承
	const util = require('util');
	const events = require('events');
	const AudioDevice = {
		play(trach) {
			// stub: Trigger playback throug iTunes, mpg123, etc.
		},
		stop() {

		}
	};

	function MusicPlayer() {
		this.play = false;
		events.EventEmitter.call(this);
	}

	unti.inherits(MusicPlayer, events.EventEmitter);

	const musicPlayer = new MusicPlayer();

	musicPlayer.on('play', track => {
		this.playing = true;
		AudioDevice.play(track);
	});

	musicPlayer.on('play', console.log); // 添加多个监听器

	musicPlayer.on('stop', () => {
		this.playing = false;
		AudioDevice.stop();
	});

	musicPlayer.emit('play', 'The Roots - The Fire');

	setTimeout(() => {
		musicPlayer.emit('stop');
	}, 1000);

... 混合EventEmitter
	/**
	 * 除了将EventEmitter作为来继承，还可以交它的方法拷贝到另一个类中。
	 * 这种情况适合于当你有一个现成的类，并且不能简单地将它继承EventEmitter的时候很有用
	 */
	/**
	 * 通过for-in循环就足以将属性从一个原型对象拷贝到时另一个原型对象上。这样，你可以只拷贝你需要的那些属性
	 */
	const EventEmitter = require('EventEmitter');

	function MusicPlayer(track) {
		this.track = track;
		this.play = false;

		for (let methodName in EventEmitter.prototype) {
			this[methodName] = EventEmitter.prototype[methodName];
		}
	}

	MusicPlayer.prototype = {
		toString() {
			if (this.playing) {
				return 'Mow Playing: ' + this.track;
			} else {
				return 'Stopped'
			}
		}
	}

	let musicPlayer = new MusicPlayer('Girl Talk - Still Here');

	musicPlayer.on('play', () => {
		this.playing = true;
		console.log(this.toString());
	});

	musicPlayer.emit('play');

... 基于事件的错误
	/**
	 * 问题
	 * 你正在使用EventEmitter, 使用在异常发生时希望能够优雅地处理，但它却不断的抛出异常。
	 * 解决方案
	 * 要在异常发生时阻止异常抛出，只要在error事件上添加一个监听器，任何从EventEmitter继承自定义类，
	 * 或者标准类都可以通过这个方法来解决
	 */
	const util = require('util');
	const events = require('events');

	function MusicPlayer() {
		events.EventEmitter.call(this);
	}

	util.inherits(MusicPlayer, events.EventEmitter);

	let musicPlayer = new MusicPlayer();

	musicPlayer.on('play', track => {
		this.emit('error', 'unable to play!');
	});

	musicPlayer.on('error', err => {
		console.error(err);
	});

	setTimeout(() => {
		musicPlayer.emit('play', 'Litte Comets - Jennifer');
	});

	/**
	 * 当一个EventEmitter实例发生错误时，通常会发出一个error事件。
	 * 在NOde中，error事件被当作特殊的情况，假如没有监听器，那么默认的动作是打印一个堆栈并退出程序。
	 */
	
... 通过domains管理异常
	/**
	 * Node的domain模块能被用来集中地处理多个异步操作，这包括EventEmitter实例发出未处理的error事件
	 */
	const util = require('util');
	const domain = require('domain');
	const events = require('events');

	const audioDomain = new domain();

	function AudioDevice() {
		events.EventEmitter.call(this);
		this.on('play', this.play.bind(this));
	}

	util.inherits(AudioDevice, events.EventEmitter);

	AudioDevice.prototype.play = function () {
		this.emit('error', 'not implemented yet');
	}

	function MusicPlayer() {
		events.EventEmitter.call(this);

		this.audioDevice = new AudioDevice();
		this.on('play', this.play.bind(this));

		this.emit('error', "No Audio tracks are available");
	}

	util.inherits(MusicPlayer, events.EventEmitter);

	MusicePlayer.prototype.play = function() {
		this.AudioDevice.emit('play');
		console.log('Now Play');
	};

	audioDomain.on('error', err => {
		console.log('audioDomain error:', err);
	});

	/**
	 * 任何在这个回调中导致错误的代码都会被domain覆盖到
	 */
	audioDomain.run(() => {
		const musicPlayer = new MusicPlayer();
		musicPlayer.play();
	});
... 反射
	/*
		有时候你需要动态地响应一个EventEmitter实例的变化，或者查询现有它的监听
	 */	
  > 密切关注新的监听
  const util = require('util');
  const events = require('events');

  function EventTracker() {
  	events.EventEmitter.call(this);
  }	

  util.inherits(EventTrakcker, events.EventEmitter);

  const eventTracker = new EventTrakcker();
  eventTracker.on('newListner', (name, listener) => {
  	console.log('Event name added: ', name);
  });

  eventTracker.on('a listner', () => {
  	// This will cause 'newListner' to fire
  });

  > 在有新建监听器事件中自动触发事件
  // rxjs Hot vs Cold Observables
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

  /*查询监听器*/
  Pulsar.prototype.stop = function() {
  	if (this.listeners('pulse').length === 0) {
  		throw new Error('No listener have been added');
  	}
  }

... 在Express中复用EventEmitter
	const express = require('express');
	const app = express();

	app.on('hello-alert', () => {
		console.warn('Warning');
	});

	app.get('/', (req, res) => {
		res.app.emit('hello-alert');
		res.send('hello world');
	});

	app.listen(3000);

... 组织事件名称
	const util = require('util');
	const events = require('events');

	function MusicePlayer () {
		events.EventEmitter.call(this);
		this.on(MusicePlayer.events.play, this.play.bind(this));
	}	  

	const e = MusicePlayer.events = {
		play: 'play',
		pause: 'pause',
		stop: 'stop',
		ff: 'ff',
		rw: 'rw',
		addTrack: 'add-track'
	};

	util.inherits(MusicePlayer, events.EventEmitter);

	MusicePlayer.prototype.play = function() {
		this.playing = true;
	}

	const musicPlayer = new MusicePlayer();

	musicPlayer.on(e.play,  () => {
		console.log('Now playing')
	});

	musicPlayer.emit(e.play);
