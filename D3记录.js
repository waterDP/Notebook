=> 选取元素
	`<p id='target'></p>`
	d3.select('p#target').text('hello world');
 > select.attr函数：用来读取或改变元素上的给定属性。
 	// 将p元素的foo属性设为goo
 	d3.select('p').attr('foo', 'goo');
 	// 读取p元素的foo属性
 	d3.select('p').attr('foo');

 >select.classed函数，用来添加、删除选定元素上的css class;
 >select.style函数，用来给选定的元素添加指定的样式；
 >select.text函数，用来获取或设置选定元素的文本内容；
 >select.html函数，用来更改元素内容的html;

=> 选取多个元素
	`<div></div>
		<div></div>
		<div></div>`
	d3.selectAll('div').attr('class', 'red box');	

=> 迭代集合中的元素
	d3.selectAll('div')
		.attr('class', 'red box')
		.each(function(d, i) {
			d3.select(this).append('h1').text(i);
		});

=> 进入-选择-更新
		let data= [10, 15, 20, 63, 15, 48, 156];
		function render(data) {
			// 进入
			d3.select('body').selectAll('div.b-bar')
				.data(data)
				.enter()
				.append('div')
					.attr('class', 'h-bar')
						.append('span');
			// 更新			
			d3.select('body').selectAll('div.h-bar')			
				.data(data)
				.style('width', d => `${d * 3}px`)
				.select('span')
					.text(d => d);
			// 退出		
			d3.select('body').selectAll('div.h-bar')
				.data(data)
				.exit()
					.remove();
		}

		setInterval(() => {
			data.shift();
			data.push(Math.round(Math.random() * 100));

			render(data);
		}, 1500);

		render(data);
