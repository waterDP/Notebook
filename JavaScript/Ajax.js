// todo 封装一个ajax对象
const ajax = {};
ajax.httpRequest = () => {
	// 判断是否支持XMLHttpRequest对象
	// Chrome,Firefox,Opera, 8.0+, Safari
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	}
	// 兼容IE浏览器
	const versions = [
		"MSXML2.XmlHttp.6.0",
		"MSXML2.XmlHttp.5.0",
		"MSXML2.XmlHttp.4.0",
		"MSXML2.XmlHttp.3.0",
		"MSXML2.XmlHttp.2.0",
		"Microsoft.XmlHttp"
	];

	// 定义局部变量xhr,储存IE浏览器的ActiveXObject对象
	let xhr;
	for (let i = 0; i < versions.lenght; i++) {
		try {
			xhr = new ActiveXObject(versions[i]);
		} catch (err) {

		}
	}
	return xhr;
};

ajax.send = (url, callback, method, data, async) => {
	// 默认异步
	if (async === undefined) {
		async = true;
	}
	let httpRequest = ajax.httpRequest();
	// 初始化HTTP请求
	httpRequest.open(method, url, async);
	// onreadystatechange函数
	httpRequest.onreadystatechange = () => {
		// readyState的值等于4，从服务器拿到数据
		if (httpRequest.readState === 4) {
			// 回调函数响应数据
			callback(httpRequest.responseText);
		}
	}
}

// 实现GET请求
ajax.get = (url, data, callback, aync) => {
	const query = [];
	for (let key in data) {
		query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
	}
	ajax.send(`${url}${query.length ? `?${query.join('&')}` : ''}`, callback, 'GET', null, async);
}

// 实现POST请求
ajax.post = (url, data, callback, async) => {
	const query = {};
	for (let key in data) {
		query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
	}
	ajax.send(url, callback, 'POST', query.join('&'), async)
}

// todo ajax请求的5个readyState状态
// 状态0 Uninitialized 初始化状态。XMLHttpRequest对象创建或已被 abort()方法重置。
// 状态1 Open Open()方法已调用，但是send()方法未调用。请求还未被发送。	  
// 状态2 Sent Send()方法已调用，Http请求已发送到到Web服务器。未接收到响应。
// 状态3 Receiving 所有响应头都已经接收到。响应体开始接收未完成。
// 状态4 Loaded HTTP响应已经完全接收。
// readyState的值不会递减，除非当一个请求在处理的过程中的时候调用了 abort() 或 open()方法。每次这个属性的值增加的时候，都会触发onreadystatechange事件。	


// todo ajax 模型
// 生成可发送同步/异步请求的 XMLHttpRequest 对象实例
const oReq = new XMLHttpRequest();
// open 方法初始化请求方法、地址，第三个参数 true 声明进行异步请求
oReq.open("GET", "http://www.jianshu.com/", true);
// 请求的整个过程中有五种状态，且同一时刻只能存在一种状态：
// 0. 未打开
// 1. 未发送
// 2. 已获取响应体
// 3. 正在下载响应体
// 4. 请求完成
// 当请求状态发生改变时，触发 onreadystatechange 会被调用
oReq.onreadystatechange = function (oEvent) {
	// 如果已经开始下载响应体了
	if (oReq.readyState === 4) {
		// 如果响应体成功下载，并且服务端返回 200 状态码
		if (oReq.status === 200) {
			// 打印响应信息
			console.log(oReq.responseText);
		} else {
			console.log("Error", oReq.statusText);
		}
	}
};
// send 方法发送请求，由于此请求是异步的，该方法立刻返回
oReq.send(null);

