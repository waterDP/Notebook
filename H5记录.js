=> audio 音频播放
	·使用语法
	`<audio src="song.mp3" controls='controls' loop='loop' autoplay="autoplay">亲，您的浏览器不支html5的audio标签</audio>`
	>> 属性
		src: 是歌曲的路径
		controls: 播放控制 如果给标签是写了controls='controls'那么网页会显示为audio自带的播放控制，如果没写则不会显示。
		loop: 歌曲循环 在标签里添加该属性，歌曲循环，如果你的歌曲是从后台调取的，也可以在ajax时设置loop=true，来控制
		autoplay: 当歌曲加载后自动播放，但是只有pc端可以实现，移动端不行。

		以上是标签内的属性 当然也可以作为对象属性来调取控制audio 
		
	audio不单单是个标签，他也是window下的一个对象，对象就有属性和方法；

	>> 对象属性
		currentTime: 获取当前播放时间。
		duration: 获取歌曲的总时间。
		play: 是否在播放 返回true/false
		pause：是否暂停 返回true/false

	>>对象方法
	  play() 播放歌曲
	  pause() 暂停歌曲
	  load() 重新加载歌曲

	>> audio事件
		play 播放事件 可判断歌曲是否正在播放中
		pause 暂停事件 判断歌曲是暂停
		loadstart, durationchange, loadeddata, progress, canplay, canplaythrough. (这些事件在加载过程中按以上顺序触发)

	function getSonge() {
		let audio = document.getElement('audio');
		audio.src = 'http://frontman.qinniudn.com/songTime.mp3';
		audio.loop = true; 
	}		

=> Web Socket API

=> 本地文件的操作与上传
	前端无法像原生APP一样直接操作本地文件，需要通过用户触发，用户可通过以下三种方式触发：
	1.通过<input type='file'>选择本地文件。
	2.通过拖拽的方式把文件拖过来。
	3.在编辑框的复制粘贴。

	> 第一种方式是最常用的手段，通常还会自定义一个按钮，然后盖在它上面，因为type='file'的input不好改样式。如下代码写一个选择控件，并放在form里面。
		`
			<form>
				<input type="file" id='file-input' name='fileContent' />
			</form>
		`

		然后就可能用FormData获取整个表单的内容
		$('#file-input').on('change', function() {
			console.log(`file name is ${this.value}`);
			let formData = new FormData(this.form);
			formData.append('fileName', this.value);
			console.log(formData);
		});

		可以看到文件的路径是一个假路径，也就是说浏览器无法获取到文件的真实存放位置。同时FormData打印出来的是一个空的Object，但并不是说的内容是空的，只是对当前前端开发人员是透明的，无法查看、修改、删除里面的内容，只能append添加字段。
		formData无法得到文件的内容，而使用FileReader可以读取整个文件的内容。用户选择文件之后，input.files就可以得到用户选择的文件，代码如下：
		$("#file-input").on('change', function() {
			let fileReader = new FileReader(),
					fileType = this.files[0].type;

			fileReader.onload = function() {
				if(/^image/.test(fileType)) {
					// 读取结果在fileReader.result里面
					$(`<img src="${this.result}" />`).appendTo('body');
				}

				// 打印原始file对象
				console.log(this.files[0]);

				// base64方式读取
				fileReader.readAsDataURL(this.files[0]);

			}
		});

		使用FileReader除了可读取base64之外，还能读取以下格式：

		// 按base64的方式读取，结果是base64，任何文件都可以转成base64的形式。
		fileReader.readAsDataURL(this.files[0]);
		// 以二进制字符串方式读取，结果是二进制内容的utf-8形式，已被废弃了。
		fileReader.readAsBinaryString(this.files[0]);
		// 以原始二进制方式读取，读取结果可直接转成整数数组
		fileReader.readAarrayBuffer(this.files[0]);

	> 第二种方式是拖拽的方式

		`
			<div class="img-container">
				drop yo image here
			</div>
		`

		然后监听它的拖拽事件
		$('.img-container').on('dragover', function (event) {
			event.preventDefault();
		}).on('drop', function (event) {
			event.preventDefault();
			// 数据在event的dataTransfer对象里
			let file = event.originalEvent.dataTransfer.files[0];
			// 然后就可以使用FileReader进行操作
			fileReader.readAsDataURL(file);
			// 或者是添加一个formData
			let formData = new FormData();
			formData.append('fileContent', file);
		});

	> 第三种方式是粘贴：通常是在一个编辑框里操作，如把div的contenteditable设置为true;
		`
			<div contenteditable='true'>
				hello, paste your image here
			</div>
		`

		粘贴的数据是在 event.clipboardData.files里面：
		$('#edit').on('paste', function(event) {
			let file = event.originalEvent.clipboardData.files[0];
		});

		但是Safari的粘贴不是通过event传递的，它是直接在输入框添加一张图片，它新建了一个img标签，并把img的src指向一个blob的本地数据。什么是blob呢，如何读取blob的内容呢？
		blob是一种类文件有存储格式，它可以存储几乎任何格式的内容。如json

		let data = { hello: "world" };
		let blob = new Blob([JSON.stringify(data), {type: 'application/json'}]);

		为了获取本地的blob数据，我们可以用ajax发个本地的请求：
		$('#edit').on('paste', function(event) {
			//需要setTimeout 0等图片出来了再处理
			setTimeout(() => {
				let img = $(this).find("img[src^='blob']")[0];
				console.log(img.src);
				// 用一个xhr获取blob数据
				let xhr = new XMLHttpRequest();
				xhr.open("GET", img.src);
				// 改变mime类型
				xhr.responseType = 'blob';
				xhr.onload = function () {
					// response就是一个Blob对象
					console.log(this.response);
				};
				xhr.send(); 
			}, 0);
		});

		能得到它的大小和类型，但是具体内容也是不可见的，它有一个slice的方法，可用于切割大文件。和File一样，可以使用FileReader读取它的内容：

		function readBlob(blobImg) {
			let fileReader = new FileReader();

			fileReader.onload = function() {
				console.log(this.result);
			}

			fileReader.onerror = function(err) {
				console.log(err)
			}

			fileReader.readAsDataURL(blobImg);

		}

		readBlob(this.response);

		除此，还能使用 window.URL读取，这是一个新的API，经常和Service Worker配套使用，因为SW里面常常要解析url。如下代码：

		function readeBlob(blobImg) {
			let urlCreator = window.URL || window.webkitURL;
			// 得到base64结果
			let imageUrl = urlCreator.createObjectURL(this.response);
			return imageUrl;
		}

		readBlob(this.response);

