const Koa = require('koa');
const app = new Koa();

// x-response-time
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Respnse-Time', `${ms}ms`);
})

// logger
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}`)
})

// response 
app.use(async ctx => {
	ctx.response.body = 'Hello World';
});

app.listen(3000);

这意味着您可以将同d一个应用程序同时作为 HTTP 和 HTTPS 或多个地址：

const http = require('http');
const https = require('https');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
https.createServer(app.callback()).listen(3001);

&& context 对象
	const Koa = require('koa')
	const app = new Koa();

	const main = ctx => {
		ctx.response.body = 'Hello World';
	}

	app.use(main);
	app.listen(3000);

=> Http Request 类型
	Koa 默认的返回类型是text/plain，如果想返回其他类型的内容，可以先用ctx.request.accepts判断一下，客户端希望接受什么数据（根据 HTTP Request 的Accept字段），然后使用ctx.response.type指定返回类型。请看下面的例子。
	const main = ctx => {
		if (ctx.request.accepts('xml')) {
			ctx.response.type = 'xml';
			ctx.response.body = '<data>Hello World</data>'
		} else if (ctx.request.accepts('json')) {
			ctx.response.type = 'json';
			ctx.response.body = {data: 'Hello World'}
		} else if (ctx.request.accepts('html')) {
			ctx.response.type = 'html';
			ctx.response.body = '<p>Hello world</p>'
		} else {
			ctx.response.type = 'text';
			ctx.response.body = 'Hollo World';
		}
	}	
=> 网页模板
	const fs = require('fs');

	const main = ctx => {
		ctx.response.type = 'html';
		ctx.response.body = fs.createReadStream('./demos/template.html');
	}


&& 路由
	可以通过ctx.request.path可以获取用户请求的路径，由此实现简单路由。
	const main = ctx => {
		if (ctx.request.path !== '') {
			ctx.response.type = 'html';
			ctx.response.body = '<a href="/">Index Page</a>';
		} else {
			ctx.response.body = 'Hello World';
		}
	}

=> koa-router 模块
	原生路由用起来不太方便，我们可以使用封装好的koa-router模块，

	const router = require('koa-router');

	const about = ctx => {
		ctx.response.type = 'html';
		ctx.response.body = '<a href="/">Index Page</a>'
	}

	const main = ctx => {
		ctx.response.body = 'Hello World';
	}

	app.use(router.get('/'), main);
	app.use(router.get('/about'), about);

&& 静态资源
	const path = require('path');
	const koaStatic = require('koa-static');

	const main = koaStatic(path.join(__dirname));
	app.use(main);	
&& 重定向
	ctx.response.redirect() 方法

	const redirect = ctx => {
		ctx.response.redirect('/');
		ctx.response.body = '<a href="/">Index Page</a>'
	}

	app.use(route.get('/redirect'), redirect);


&& 中间件
	=> Logger功能
		const logger = (ctx, next) => {
			console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
			next();
		}

		app.use(logger);

	=> 异步中间件
		如果有异步操作（比如读取数据库），中间件就必须写成async函数。

		const fs = require('fs');
		const Koa = require('koa');
		const app = new Koa();

		const main = async function (ctx, next) {
			ctx.response.type = 'html';
			ctx.response.body = await fs.readFile('./demo/template.html', 'utf8');
		}	

		app.use(main);
		app.listen(3000);
=> 中间件的合成
	koa-compose模块可以将多个中间件做成为一个

	const compose = require('koa-compose');

	const logger = (ctx, next) => {
		console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
		next();
	}		

	const main = ctx => {
		ctx.response.body = 'Hello World';
	}

	const middlewares = compose([logger, main]);
	app.use(middlewares);

=> 处理错误的中间件
	为了方便处理错误，最好使用try...catch将其捕获。但是，为每个中间件都写try...catch太麻烦，我们可以让最外层的中间件，负责所有中间件的错误处理。
	const handler = async (ctx, next) => {
		try {
			await next();
		} catch (err) {
			ctx.response.status = err.statusCode || err.status || 500;
			ctx.response.body = {
				message: err.message
			}
		}
	}

	const main = ctx => {
		ctx.throw(500);
	}	

	app.use(handles);
	app.use(main);

=> error 事件的监听
	app.on('error', (err, ctx) => {
		console.error('server error', err);
	});	
=> 释放error事件
	需要注意的是，如果错误被try...catch捕获，就不会触发error事件。这时，必须调用ctx.app.emit(),手动释放error事件，才能让监听函数生效。
	const handler = async (ctx, next) => {
		try {
			await next();
		} catch(err) {
			ctx.response.status = err.statusCode || err.status || 500;
	    ctx.response.type = 'html';
	    ctx.response.body = '<p>Something wrong, please contact administrator.</p>';
	    ctx.app.emit('error', err, ctx);
		}
	}

	const main = ctx => {
	  ctx.throw(500);
	};

	app.on('error', function(err, ctx) {
	  console.log('logging error ', err.message);
	  console.log(err);
	});

=> Cookies
	const main = ctx => {
		const n = Number(ctx.cookies.get('view') || 0) + 1;
		ctx.cookies.set('view', n);
		ctx.response.body = n + 'views';
	}

=> 文件上传
	koa-body模块还可以用来处理文件上传；

	const os = require('os');
	const path = require('path');
	const koaBody = require('koa-body');

	const main = async function (ctx) {
		const tmpdir = os.tmpdir();
		const filePaths = [];
		const files = ctx.request.body.files;

		for (let key of files) {
			const file = files[key];
			const filePath = path.join(tmpdir, file.name);
			const reader = fs.createReadStream(file.path);
			const writer = fs.createWriteStream(filePath);
			reader.pipe(writer);
			filePaths.push(filePath);
		}

		ctx.body = filePaths;
	}	

	app.use(koaBody({multipart: true}));