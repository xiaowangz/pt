//获取样式的兼容写法
function getStyle(obj, attr) {
	if(obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
}
var oDiv1 = document.getElementById('div1');
var timer = null;
//回调函数
//链式运动
//json是一个键值对集合
function startMove(obj, json, fnEnd) {
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		//由于不同的动作执行时间不同 清除定时器后 动作时间长的无法达到预期效果  
		//所以在所有动作完成时再清除定时器
		//分两种情况 1所有动作完成   2有某个动作没有完成
		//定义一个布尔型变量为true 指代所有动作完成
		var bStop = true;
		//由于json不是数组 没有长度 用for in 来遍历
		//定义一个json内的attr变量 循环
		for(var attr in json) {
			//定义一个变量来存透明度
			var cur = 0;
			//透明度兼容性判断
			//如果参数为opacity
			if(attr == 'opacity') {
				//透明度是一个浮点数  但获取的是一个字符串  用parseFloat转换  要取整数*100
				//由于计算机二进制 浮点数类型存在问题 所以用round()取整
				var cur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
			} else {
				//参数不为opacity时 正常获取
				var cur = parseInt(getStyle(obj, attr));
			}

			//定义速度来做一个缓冲运动
			var speed = (json[attr] - cur) / 6;
			//三元运算符
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			
			//如果有目标值与所获取值不同时 代表动作没有达到预期 没有完成 使布尔值为false
			if(json[attr] != cur) {
				bStop = false;
			}
			//判断传参数是否为透明度
			if(attr == 'opacity') {
				obj.style.opacity = (cur + speed) / 100;
				obj.style.filter = 'alpha(opacity=' + (cur + speed) + ')';
			} else {
				//不是的话正常设置属性值变化
				//获取到的是一个字符串
				//parseInt把字符串 把它转化为整数型来操作
				obj.style[attr] = parseInt(getStyle(obj, attr)) + speed + 'px';
			}

		}
		//如果所有动作完成 清除定时器
		//并判断是否有 函数参数 是否进行回调
		if(bStop) {
			clearInterval(obj.timer);
			//函数回调
			if(fnEnd) {
				fnEnd();
			}
		}
	}, 30)
}