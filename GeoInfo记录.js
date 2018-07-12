/**
 * 地理信息相关
 * H5
 * 百度Api
 */

=> H5 
	oBtn.onclick = function () {
		navigator.geolocation.getCurrentPosition(pos => {
			oTxt.value = pos.coords.longitude;  // 经度
			/*
			 coords.latitude 纬度
			 coords.accuracy 精确度
			 coords.altitude 海拔
			 coords.altitudeAccuracy 海拔精确度
			 coords.heading 行进方法
			 coords.speed 地面速度
			 new Date(pos.timestamp) 时间戳
			*/
		})
	}

	oBtn.onclick = function () {
		// 单次定位请求
		navigator.geolocation.getCurrentPosition();
		// 多次定位请求
		navigator.geolocation.watchPosition();
	}

=> BaiduMap 使用
	> 入门指南
		1.创建地图实例
			/*位于BMap命名空间下的Map类表示地图，通过new操作符可以创建一个地图实例。其参数可以是元素id也可以是元素对象。*/
			let map = new BMap.Map('container')
		2.设置中心点坐标
			let point = new BMap.Point(longitude, latitude);
		3.地图初始化，同时设置地图展示级别
			在创建地图实例后，我们需要对其进行初始化，BMap.Map.centerAndZoom()方法要求设置中心点坐标和地图级别。 地图必须经过初始化才可以执行其他操作。
			map.centerAndZoom(point, 15);  	
		4.开启鼠标滚轮缩放	
			map.enableScrollWheelZoom(true);  // 开启鼠标滚轮缩放
	> 添加控件
		抽象基类       Control                  所有的控件继承此类的方法、属性。通过此类你可以现实自定义控件  
		平移缩放控件   NavigationControl        PC端默认位于地图左上角，它包含控制地图的平衡和缩放功能。移动端提供缩放控件，默认位于地图右下方。
		缩略地图       OverviewMapControl       默认位于地图右下方，是一个可折叠的缩略地图
		比例尺        ScaleControl              默认位于地图左下方，显示地图的比例关系
		地图类型      MapTypeControl            默认位于地图右上方
		版权          CopyrightControl          默认位于地图左下方
		定位          GeolocationControl        针对移动端开发，默认位于地图左下方

	map.addControl(new BMap.NavigationControl()); 

	> 地图的覆盖物
		可以使用map.addOverlay方法向地图添加覆盖物，使用map.removeOverlay方法移除覆盖物，注意此方法不适用于InfoWindow。
		抽象基类     Overlay       所有的覆盖物均继承此类的方法
		点  	        Marker	      表示地图上的点，可自定义标注的图标
		信息窗口	    InfoWindow  	信息窗口也是一种特殊的覆盖物，它可以展示更为丰富的文字和多媒体信息。注意：同一时刻只能有一个信息窗口在地图上打开

		1.向地图添加标注
			如下示例，向地图中心点添加了一个标注，并使用默认的标注样式：
			var point = new BMap.Point(116.404, 39.915);       
			var marker = new BMap.Marker(point);        // 创建标注    
			map.addOverlay(marker);                     // 将标注添加到地图中 	
		2.监听标事件	
			marker.addEventListener('click', () => {
				alert('你点击了标');
			});

		3.可拖拽的标注
			marker的enableDragging和disableDragging方法可用来开启和关闭标注的拖拽功能。默认情况下标注不支持拖拽，您需要调用marker.enableDragging()方法来开启拖拽功能。在标注开启拖拽功能后，您可以监听标注的dragend事件来捕获拖拽后标注的最新位置。
			marker.enableDragging();    
			marker.addEventListener("dragend", function(e){    
			    alert("当前位置：" + e.point.lng + ", " + e.point.lat);    
			});  	

	> 自定义标注	
		1.定义构造函数并继承Overlay
			首先您需要定义自定义覆盖物的构造函数，通过构造函数参数可以传递一些自由的变量。设置自定义覆盖物对象的prototype属性为Overlay的实例，以便继承覆盖物基类。
			如下示例，我们定义一个名为SquareOverlay的构造函数，它包含中心点和边长两个参数，用来在地图上创建一个方形覆盖物。
			// 定义自定义覆盖物的构造函数  
			function SquareOverlay(center, length, color) {
			    this._center = center;
			    this._length = length;
			    this._color = color;
			}
			// 继承API的BMap.Overlay
			SquareOverlay.prototype = new BMap.Overlay();
		2.初始化自定义覆盖物
			实现initialize方法，当调用map.addOverlay方法时，API会调用此方法。
			当调用map.addOverlay方法添加自定义覆盖物时，API会调用该对象的initialize方法用来初始化覆盖物，在初始化过程中需要创建覆盖物所需要的DOM元素，并添加到地图相应的容器中。这里我们选择添加在容器markerPane上。
			// 实现初始化方法  
			SquareOverlay.prototype.initialize = function(map) {
		    // 保存map对象实例
		    this._map = map;
		    // 创建div元素，作为自定义覆盖物的容器
		    let div = document.createElement("div");
		    div.style.position = "absolute";
		    // 可以根据参数设置元素外观
		    div.style.width = this._length + "px";
		    div.style.height = this._length + "px";
		    div.style.background = this._color;
		    // 将div添加到覆盖物容器中
		    map.getPanes().markerPane.appendChild(div);
		    // 保存div实例
		    this._div = div;
		    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
		    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
		    return div;
			}
			地图提供了若干容器供覆盖物展示，通过map.getPanes方法可以得到这些容器元素，它们包括：
				floatPane
				markerMouseTarget
				floatShadow
				labelPane
				markerPane
				mapPane
			这些对象代表了不同的覆盖物容器元素，它们之间存在着覆盖关系，最上一层为floatPane，用于显示信息窗口内容，下面依次为标注点击区域层、信息窗口阴影层、文本标注层、标注层和矢量图形层。
			我们自定义的方形覆盖物可以添加到任意图层上，如上示例，我们选择添加到markerPane上，作为其一个子结点。
		3.绘制覆盖物
			实现draw方法。
			到目前为止，我们仅仅把覆盖物添加到了地图上，但是并没有将它放置在正确的位置上。
			您需要在draw方法中设置覆盖物的位置，每当地图状态发生变化（比如：位置移动、级别变化）时，API都会调用覆盖物的draw方法，用于重新计算覆盖物的位置。
			通过map.pointToOverlayPixel方法可以将地理坐标转换到覆盖物的所需要的像素坐标。
			// 实现绘制方法   
			SquareOverlay.prototype.draw = function(){    
				// 根据地理坐标转换为像素坐标，并设置给容器    
		    let position = this._map.pointToOverlayPixel(this._center);    
		    this._div.style.left = position.x - this._length / 2 + "px";    
		    this._div.style.top = position.y - this._length / 2 + "px";    
			}
		4.移除覆盖物
			当调用map.removeOverlay或者map.clearOverlays方法时，API会自动将initialize方法返回的DOM元素进行移除。
		5.显示和隐藏覆盖物
			自定义覆盖物会自动继承Overlay的show和hide方法，方法会修改由initialize方法返回的DOM元素的style.display属性。
			如果自定义覆盖物元素较为复杂，您也可以自己实现show和hide方法。
			// 实现显示方法    
			SquareOverlay.prototype.show = function(){    
			    if (this._div){    
			        this._div.style.display = "";    
			    }    
			}      
			// 实现隐藏方法  
			SquareOverlay.prototype.hide = function(){    
			    if (this._div){    
			        this._div.style.display = "none";    
			    }    
			}
			自定义其他方法 通过构造函数的prototype属性，您可以添加任何自定义的方法，比如下面这个方法每调用一次就能改变覆盖物的显示状态：
			// 添加自定义方法   
			SquareOverlay.prototype.toggle = function(){    
			    if (this._div){    
			        if (this._div.style.display == ""){    
			            this.hide();    
			        }    
			        else {    
			            this.show();    
			        }    
			    }    
			}
		6.添加覆盖物
			您现在已经完成了一个完整的自定义覆盖物的编写，可以添加到地图上了。
			// 初始化地图  
			let map = new BMap.Map("container");    
			let point = new BMap.Point(116.404, 39.915);    
			map.centerAndZoom(point, 15);    
			// 添加自定义覆盖物   
			let mySquare = new SquareOverlay(map.getCenter(), 100, "red");    
			map.addOverlay(mySquare);

	> 信息窗口	
		添加信息窗口
			信息窗口在地图的上方浮动显示HTML内容
			信息窗口可直接在地图上的任意位置打开，也可以在标注对象上打开（此时信息窗口的坐标与标注的坐标一致）。
			您可以使用InfoWindow来创建一个信息窗实例，
			注意同一时刻地图上只能有一个信息窗口处于打开状态。

			let opts = {
				width: 250,     // 信息窗口宽度
				height: 100,    // 信息窗口高度
				title: 'Hello'  // 信息窗口标题
			}

			let infoWindow = new BMap.InfoWindow("window", opts); // 创建信息窗口对象
			map.openInfoWindow(infoWindow, map.getCenter());      // 打开信息窗口







			

=> BaiduMap API			
	&& Marker类： 
		Method：
			/**
			 * @return {Point}
			 * @Point {lat: number, lng: number}
			 */
			getPosition(): 返回标注的地理坐标

			setLabel(label: Label): 为标注添加文本标记

			setTitle(title: string): 设置标注的标题，当鼠标移至标注上方时显示此标题

	&& LocalSearch类：
		LocalSearch(location: Map|Point|String, opts: LocalSearchOption)
		创建一个搜索类实例，其中location表示检索区域，其类型可为地图实例、坐标点或城市名称的字符串。当参数为地图实例时，检索位置由当前地图中心点确定，且搜索结果的标注将自动加载到地图上，并支持调整地图视野层级；当参数为坐标时，检索位置由该点所在位置确定；当参数为城市名称时，检索会在该城市内进行。
		Method：

=> BaiduMap interface 		
	地理编码：'http://api.map.baidu.com/geocoder/v2/?address=北京市海淀区上地十街10号&output=json&ak=您的ak&callback=showLocation'
	逆地理编码： 'http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=35.658651,139.745415&output=json&pois=1&ak=您的ak' 

