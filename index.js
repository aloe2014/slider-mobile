var jdCarouse = document.querySelector('.jd-carouse');
var carouseWrap = jdCarouse.querySelector('.carouse-wrap');
var carouseWrapLi = carouseWrap.querySelectorAll('li');
var pointWrap = jdCarouse.querySelector('.point-wrap');
var carouseTimer = null;
// 获取屏幕的宽度
var windowWidth = document.documentElement.offsetWidth;
// 初始化
var left,center,right;
// 获取li的高度赋值给ul
carouseWrap.style.height = carouseWrapLi[0].offsetHeight + 'px';

// 动态根据li的个数循环小圆点
for(var i = 0; i < carouseWrapLi.length; i++){
	var li = document.createElement('li');
	// 如果是第一个，默认添加上当前类
	if(i == 0){
		li.classList.add('active');
	}
	pointWrap.appendChild(li);
}

// 将最初始的位置赋值
left = carouseWrapLi.length - 1;
center = 0;
right = 1;
// 将最开始的三张先就位
carouseWrapLi[left].style.transform = 'translateX('+ -windowWidth +'px)';
carouseWrapLi[center].style.transform = 'translateX(0px)';
carouseWrapLi[right].style.transform = 'translateX('+ windowWidth +'px)';
// 看到下一张的逻辑
function showNext(){
	// 轮转下标
	left = center;
	center = right;
	right++;

	// 极值判断
	if(right > carouseWrapLi.length - 1){
		right = 0;
	}
	// 给元素添加过渡
	carouseWrapLi[center].style.transition = 'transform .5s';
	carouseWrapLi[left].style.transition = 'transform .5s';
	// 右边的图片永远是替补图片，所以不需要走过渡，因为走过渡会穿帮
	carouseWrapLi[right].style.transition = 'none';

	// 设置小圆点
	setPoint();

	// 归位
	carouseWrapLi[center].style.transform = 'translateX(0px)';
	carouseWrapLi[left].style.transform = 'translateX('+ -windowWidth +'px)';
	carouseWrapLi[right].style.transform = 'translateX('+ windowWidth +'px)';
}
// 看到上一张的逻辑
function showPrev(){
	// 轮转下标
	right = center;
	center = left;
	left--;

	// 极值判断
	if(left < 0){
		left = carouseWrapLi.length - 1;
	}
	// 给元素添加过渡
	carouseWrapLi[center].style.transition = 'transform .5s';
	carouseWrapLi[left].style.transition = 'none';
	// 右边的图片是替补图片，所以不需要过渡，走过渡会穿帮
	carouseWrapLi[right].style.transition = 'transform .5s';

	// 设置小圆点
	setPoint();

	// 归位
	carouseWrapLi[center].style.transform = 'translateX(0px)';
	carouseWrapLi[left].style.transform = 'translateX('+ -windowWidth +'px)';
	carouseWrapLi[right].style.transform = 'translateX('+ windowWidth +'px)';
}
// 在这里去获取小圆点，因为在上面获取那个时候还没有被创建出来
var pointWrapLi = pointWrap.querySelectorAll('li');

//给当前小圆点添加active类
function setPoint(){
	for(var i = 0; i < pointWrapLi.length; i++){
		pointWrapLi[i].classList.remove('active');
	}
	pointWrapLi[center].classList.add('active');
}
carouseTimer = setInterval(showNext, 1000);

// 手指touch的时候去切换图片
jdCarouse.addEventListener('touchstart',touchstartHandler);
jdCarouse.addEventListener('touchmove',touchmoveHandler);
jdCarouse.addEventListener('touchend',touchendHandler);

var startX = 0;  // 记录开始的时候的手指落点
var moveX = 0;	// 记录移动最终的手指落点
var starTime = null;

function touchstartHandler(event){
	// 记录滑动开始的时间
	starTime = new Date();
	// 在最开始的时候清除定时器
	clearInterval(carouseTimer);
	// 获取手指的落点
	startX = event.touches[0].pageX;
	// 清除过渡
	carouseWrapLi[center].style.transition = 'none';
	carouseWrapLi[left].style.transition = 'none';
	carouseWrapLi[right].style.transition = 'none';
}
function touchmoveHandler(event){
	// 获取移动的最终的手指落点
	moveX = event.touches[0].pageX;
	// 手指滑动的距离
	var dx = moveX - startX;

	// 滑动
	carouseWrapLi[center].style.transform = 'translateX('+ dx +'px)';
	carouseWrapLi[left].style.transform = 'translateX('+ (-windowWidth + dx) +'px)';
	carouseWrapLi[right].style.transform = 'translateX('+ (windowWidth + dx) +'px)';

}
function touchendHandler(event){
	// 获取滑动的时间
	var dTime = new Date() - starTime;

	// 判定是否滑动成功
	var endX = event.changedTouches[0].pageX - startX;
	// 往左滑动成功
	// 滑动的距离超过屏幕的四分之一或者滑动的时间小于200同时滑动的距离大于30px则判断滑动成功
	if(endX < (-windowWidth/4) || (dTime < 300 && endX < -30)){
		showNext();
	}else if(endX > (windowWidth/4) || (dTime < 300 && endX > 30)){
		showPrev();
	}else{
		// 给所有的元素添加上过渡
		carouseWrapLi[center].style.transition = 'transform .5s';
		carouseWrapLi[left].style.transition = 'transform .5s';
		carouseWrapLi[right].style.transition = 'transform .5s';
		// 归位
		carouseWrapLi[center].style.transform = 'translateX(0px)';
		carouseWrapLi[left].style.transform = 'translateX('+ -windowWidth +'px)';
		carouseWrapLi[right].style.transform = 'translateX('+ windowWidth +'px)';
	}
	// 重新开启定时器
	carouseTimer = setInterval(showNext, 1000);
}
