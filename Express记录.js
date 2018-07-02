=> express()
	express() 用来创建一个Express的程序。express() 方法是express模块导出的顶层方法。

	const express = require('express');
	const app = express();

=> Methods
	> express.static(root, [options]) 
	express.static 是Express中唯一的内建中件间。它以server-static模块为基础开发，负责托管Express内的静态资源。

	参数root为静太资源所有的根目录。
	参数options是可选的，运行以下的属性。

	1.dotfiles<String> default: 'ignore' 是否响应点文件。供选择的值有 'allow', 'deny', 'ignore';
	2.etag<Boolean> default: true 使能或者关闭etag;
	3.extensions<Boolean> default: true 设置文件延期退回;
	4.index<Mixed> default: 'index.html' 发送目录索引文件。设置false将不发送;
	5.lastModified<Boolean> default: true 设置文件在系统中最后修改的时间到last-Modified头部。可能的取值是 true 或 false;
	6.maxAge<Number> default: 0 在Cache-Control头部中设置max-age属性，精度为毫秒（ms）或则一段msformat字符串;
	7.redirect<Boolean> default: true 当请求的pathname是一个目录的时候，重定向到尾随"/";
	8.setHeaders<Function> 当响应静态文件请求时设置headers的方法;

=> Application()
	app对象一般用来表示Express程序。通过调用Express模块导出和顶层 express() 方法来创建它：

	const express = require('express');
	const app = express();

	app.get('/', (req, res) => {
		res.send('hello world');
	});

	app.listen(3000);

	app对象具有以下的方法：
	> 路由HTTP请求：具体的可以看 app.METHOD和app.param这两个例子。
	> 配置中间件：具体请看 app.route
	> 渲染HTML视图：具体请看 app.render
	> 注册模板引擎：具体请看 app.engine

	&& Peoperties

	>>app.locals
	app.locals对象是一个javascript对象，它的属性就是程序本地的变量。
	app.locals.title // => 'MyApp'		
	app.locals.email // => 'me@myapp.com'

	一旦设定，app.locals的各属性值将贯穿程序的整个生命周期，与其相反的是 res.locals，它只在这次在这次请求的生命周期中有效。在程序中，你可以在渲染模板时使用这些本地变量。它们是非常有用的，可以为模板提供一些有用的方法，以及app级别的数据通过 
	req.app.locals, Locals可以有中间件中使用。
	app.locals.title = 'My App';
	app.locals.strftime = require('strftime');
	app.locals.email ='me@myapp.com';

	>>app.mountpath
	app.mountpath属性是子程序挂载的路径模式。
	一个子程序是一个express的实例，其可以被用来作为路由句柄来处理请求。

	const express = require('express');

	let app = express(); //the main app;
	let admin = express(); //the sub app;

	admin.get('/', 	(req, res) => {
		console.log(admin.mountpath); // /admin
		res.send('Admin Homepage')
	});

	app.use('/admin', admin); //mount the sub app

	它和req对象的baseUrl属性比较相似，除了 req.baseUrl 是匹配URL路径，而不是匹配的模式。如果一个子程序被挂载在多条路径模式，
	app.mountpath就是一个关于挂载路径模式项的列表，如下面的例子所示。
	
	const express = require('express');

	let admin = express();

	admin.get('/', (req, res)=>{
		console.log(admin.mountpath) // ['adm*n', '/manager']
		res.send('Admin Homepage')
	});

	let secret = express();
	secret.get('/', (req, res) => {
		console.log(secret.mountpath) // secr*t
		res.send('Admin secret')
	});

	admin.use('/secr*t', secret);
	app.use(['/adm*n', '/manager'], admin);

	&& Events
	>> app.on('mount', callback(parent));
	当子程序被挂载到父程序时，mount事件被发射。父程序对象作为参数，传递给回调方法；

	let admin = express();

	admin.on('mount', (parent) => {
		console.log('Admin Mounted'); 
		console.log(parent); // refers to the parent app
	});

	admin.get('/', (req, res) => {
		res.send('Admin Homepage');
	});

	app.use('/admin', admin);

	&& Methods

	>> app.all(path, callback[, callback ...]);
	app.all方法和标准的app.METHOD()方法相似，除了它匹配所有的HTTP动词。
	对于给一个特殊前缀映射一个全局的逻辑处理，或者无条件匹配，它是很有效的。例如，如果你把下面内容放在所有其他的路由定义的前面，它要求所有从这个点开始的路由需要认证和自动加载一个用户。记住这些回调并不一定是终点：loadUser可以在完成一个任务后，调用 next()方法来继续匹配随后的路由。

	app.all('*', requireAuthentication, loadUser);

	或者这样相等的形式：
	app.all('*', requireAuthentication);
	app.all('*', loadUser);

	另一个例子是全局的白名单方法。这个例子和前面的很像，然而它只是限制以/api开头的路径。
	app.all('/app/*', requireAuthentication);

	>> app.delete(path, callback[, callback ...])

	路由HTTP DELETE请求到有特殊回调方法的特殊的路径。获取更多的信息，可以查阅routing guide。 
	你可以提供多个回调函数，它们的行为和中间件一样，除了这些回调可以通过调用 next('router')来绕过剩余的路由回调。你可以使用这个机制来为一个路由设置一些前提条件，如果不能满足当前路由的处理条件，那么你可以传递控制到随后的路由。

	app.delete('/', function(req, res) {
	    res.send('DELETE request to homepage');
	});

	>> app.disable(name)

	设置类型为布尔的设置名为name的值为false，此处的name是app settings table中各属性的一个。调用app.set('foo', false)和调用
	app.disable('foo')是等价的。 比如:

	app.disable('trust proxy');
	app.get('trust proxy');
	// => false

	>> app.disabled(name)

	返回true如果布尔类型的设置值name被禁用为false，此处的name是app settings table中各属性的一个。

  app.disabled('trust proxy');
  // => true
  app.enable('trust proxy');
  app.disabled('trust proxy');
  // => false

  >> app.enable(name)

	设置布尔类型的设置值name为true，此处的name是app settings table中各属性的一个。调用app.set('foo', true)和调用
	app.enable('foo')是等价的。

    app.enable('trust proxy');
    app.get('trust proxy');
    // => true

	>> app.enabled(name)

  返回true如果布尔类型的设置值name被启动为true，此处的name是app settings table中各属性的一个。

  app.enabled('trust proxy');
  // => false
  app.enable('trust proxy');
  app.enabled('trust proxy');
  // => true


  >> app.engine(ext, callback)

	注册给定引擎的回调，用来渲染处理ext文件。 
	默认情况下，Express需要使用 require()来加载基于文件扩展的引擎。例如，如果你尝试渲染一个 foo.jade 文件，Express在内部调用下面的内容，同时缓存 require()结果供随后的调用，来加速性能。

  app.engine('jade', require('jade').__express);
	使用下面的方法对于那些没有提供开箱即用的__express方法的模板，或者你希望使用不同的模板引擎扩展。 
	比如，使用EJS模板引擎来渲染 html文件：

  app.engine('html', require('ejs').renderFile);
	在这个例子中，EJS提供了一个 renderFile方法，这个方法满足了Express规定的签名规则：(path, options, callback)，然而记住在内部它只是 ejs.__express的一个别名，所以你可以在不做任何事的情况下直接使用 ejs扩展。 
	一些模板引擎没有遵循这种规范，consolidate.js库映射模板引擎以下面的使用方式，所以他们可以无缝的和Express工作。

	var engines = require('consolidate');
	app.engine('haml', engines.haml);
	app.engine('html', engines.hogan);

	>> app.get(name)

	获得设置名为name的app设置的值，此处的name是app settings table中各属性的一个。 
	如下：

	app.get('title');
	// => undefined
	app.set('title', 'My Site');
	app.get('title');
	// => 'My Site'

	>> app.get(path, callback [, callback ...])

	路由HTTP GET请求到有特殊回调的特殊路径。获取更多的信息，可以查阅routing guide。你可以提供多个回调函数，它们的行为和中间件一样，除了这些回调可以通过调用 next('router')来绕过剩余的路由回调。你可以使用这个机制来为一个路由设置一些前提条件，如果请求没能满足当前路由的处理条件，那么传递控制到随后的路由。

  app.get('/', function(req, res) {
    res.send('GET request to homepage');
  });

  >> app.listen(port, [hostname], [backlog], [callback]);

  绑定程序监听端口到指定的主机和端口号。这个方法和Node中的 http.Server.listen() 是一样的。
  
  const express = require('express');

  let app = express();
  app.listen(3000);

  通过调用 express()返回得到的app实际上是一个JavaScript的Function，被设计用来作为一个回调传递给Node HTTP servers来处理请求。这样，其就可以很简便的基于同一份代码提供http和https版本，所以app没有从这些继承（它只是一个简单的回调）。

  const express = require('express');
  const https = require('https');
  const http = require('http');

  let app = express();

  http.createServer(app).listen(80);
  https.createServer(app).listen(443);

  app.listen() 方法是下面所示的一个便利的方法（只针对http协议）

  app.listen = function() {
  	let server = http.createServer(this);
  	return server.listen.apply(server, arguments);
  }

  && app.METHOD(path, callback[,callback...])
  路由一个HTTP请求，METHOD是这个请求的HTTP方法，比如GET，PUT，POST等等，注意是小写的。所以，实际的方法是app.get()，app.post()，app.put()等等。
	你可以提供多个回调函数，它们的行为和中间件一样，除了这些回调可以通过调用 next('router')来绕过剩余的路由回调。你可以使用这个机制来为一个路由设置一些前提条件，如果请求没有满足当前路由的处理条件，那么传递控制到随后的路由。


  >> app.all() 是一个特殊的路由方法，它不属于HTTP协议中规定的方法。它为一个路径加载中间件，其对所有方法都有效。
  app.all('/secret', (req, res, next)=>{
  	console.log('Accessing the secret section...');
  	next(); //pass controll to the next handler
  });


  >> app.param([name], callback);

  给路由参数添加回调触发器，这里的name是参数名或者参数数组，callback回调方法。回调方法的参数按序是请求对象（req），响应对象（res），下个中间件（next），参数值和参数名。
  如果name是数组，会按照各个参数在数组中被声明的顺序将回调触发器注册下来。还有，对于除了最后一个参数的其他参数，在它们的回调中调用next()来调用下个声明参数的回调。对于最后一个参数，在回调中调用 next()将调用位于当前处理路由中的下一个中间件，如果name只是一个string那就和它一样的（就是说只在一个参数，那么就是最后一个参数）
 
  例如，当:user出现在路由路径中，你可以映射用户加载的逻辑处理来自动提供 req.user给这个路由，或者对输入的参数进行验证。
	app.param('user', (req, res, next, id)=>{
  	User.find(id, (err, user)=>{
  		if (err) {
  			next(err);
  		} else if (user) {
  			req.user = user;
  		} else {
  			next(new Error('failed to load user'));
  		}
  	});
  });
	对于Param的回调定义的路由来说，他们是局部的。它们不会被挂载的app或者路由继承。所以，定义在app上的param回调只有是在app上的路由具有这样的参数时才起作用。
	在定义param的路由上，param回调都是第一个被调用的，它们在一个请求-响应循环中都会被调用一次并且只有一次，即使多个路由都匹配，如下面的例子：
	app.param('id', (req, res, next, id) => {
		console.log('CALLED ONLY ONCE');
		next();
	});

	app.get('/user/:id', (req, res, next) => {
		console.log('although this matches');
		next();
	});

	app.get('/user/:id', (req, res) => {
		console.log('and this matches too');
		res.end();
	});
	/*当GET /user/42, 得到下面的结果：
		CALLED ONLY ONCE
		although this matches
		and this matches too*/

	app.param(['id', 'page'], (req, res, next, value) => {
		console.log('CALLED ONLY ONCE with', value);
		next();
	});	

	app.get('/user/:id/:page', (req, res, next) => {
		console.log('although this matches');
		next();
	});

	app.get('/user/:id/:page', (req, res, next) => {
		console.log('and this matches too');
		next();
	});
	/*当执行GET /user/42/3 
	 CALLED ONLY with 42
	 CALLED ONLY with 3
	 although this matches
	 and this matches too*/

	>> app.path();
	通过这个方法可以得到app典型的路径，其是一个string
	const express = require('express'); 

	let app = blog = blogAdmin = express();

	app.use('/blog', blog);
	app.use('/admin', blogAdmin);

	console.log(app.path()); //''
	console.log(blog.path()); // '/blog'
	console.log(blogAdmin.path()); // '/blog/admin'
	如果app挂载很复杂下，那么这个方法的行为也会很复杂：一种更好的方式是使用req.baseUrl来获取这个app典型路径。

	>> app.post(path, callback, [callback ...])  / app.put(path, callback, [callback ...])
	你可以提供多个回调函数，它们的行为和中间件一样，除了这些回调可以通过调用 next('router')来绕过剩余的路由回调。你可以使用这个机制来为一个路由设置一些前提条件，如果请求没有满足当前路由的处理条件，那么传递控制到随后的路由。
	app.post('/', (req, res) => {
		res.send('POST request to homepage');
	});

	>> app.render(view, [locals], callback)
	通过callback回调返回一个view渲染之后得到的HTML文本。它可以接受一个可选的参数，可选参数包含了这个view需要用到的本地数据。这个方法类似于res.render()，除了它不能把渲染得到HTML文本发送给客户端。
	将app.render()当作是可以生成渲染视图字符串的工具方法。在res.render()内部，就是使用的app.render()来渲染视图。
	如果使用了视图缓存，那么本地变量缓存就会保留。如果你想在开发的过程中缓存视图，设置它为 true 。在生产环境中，视图缓存默认是打开的。
		app.render('email', (err, html) => {
			// ...
		});

		app.render('email', {name: 'Tobi'}, (err, html) => {
			// ...
		});

