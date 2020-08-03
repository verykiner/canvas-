
// 画线主要是不断地进行 canvas 中的 lineTo 操作
/** 
 * 1. 初始化
 * 2. 设置基本的 line 属性
 * 3. 鼠标监听事件轮子封装
 * 4. draw 事件
 * 5. 优化，提取公共属性为参数
 */

// 默认参数
let settings = {
    width: 0,
    height: 0,
    lineWidth: 2, // 线条宽度 
    lineCap: 'butt', // 线条末端样式
    strokeStyle: '#000', // 轮廓/线条颜色
    type: '', // 绘制类型, line: 线条 circle: 圆  rect: 矩形
}

// 临时缓存
let canvas_cache = [];

let canvas,
    ctx,
    drawing = false;// 绘制状态

function init() {
    canvas = document.getElementById('panel');
    resizeCanvas();
    // 获得渲染上下文和它的绘画功能
    ctx = canvas.getContext('2d');

    // 设置线条宽度
    ctx.lineWidth = settings.lineWidth;
    // 设置线条末端样式
    ctx.lineCap = settings.lineCap;
    // 设置线条颜色
    ctx.strokeStyle = settings.strokeStyle;
}
init();

function resizeCanvas() {
    // 设置canvas容器宽高自适应
    canvas.width = settings.width = document.documentElement.offsetWidth;
    canvas.height = settings.height = document.documentElement.offsetHeight;
    canvas['style']['width'] = document.documentElement.offsetWidth + 'px';
    canvas['style']['height'] = document.documentElement.offsetHeight + 'px';

}

// 笔触开始
function start(event) {
    let [x, y] = [event.point.x, event.point.y];
    drawing = settings.type ? true : false;
    if (drawing) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
}

// 笔触移动
function move() {
    let [x, y] = [event.point.x, event.point.y];

    if (drawing) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

// 笔触结束
function end(event) {
    let [x, y] = [event.point.x, event.point.y];
    if (drawing) {
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
        canvas_cache.push(canvas.toDataURL());
    }
    console.log(canvas_cache)
    drawing = false;
}
tool.mouseCapture(canvas, start, move, end);

// 工具事件
let tools = document.querySelectorAll('.tools .btn');
tools.forEach(tool => {
    tool.addEventListener('click', e => {
        tools.forEach(tool_item => {
            tool_item.classList.remove('active');
        });
        e.target.classList.add('active');
        settings.type = e.target.getAttribute('data-type');
    }, false);
})

// 颜色板事件
let colors = document.querySelectorAll('.color');
colors.forEach(color => {
    color.addEventListener('click', e => {
        colors.forEach(color_item => {
            color_item.classList.remove('active');
        });
        e.target.classList.add('active');
        settings.strokeStyle = e.target.style.backgroundColor;
        ctx.strokeStyle = settings.strokeStyle;
    }, false);
})

// 操作事件
let operates = document.querySelectorAll('.operate .btn');
operates.forEach(operate => {
    operate.addEventListener('click', e => {
        // 撤销
        if ((' ' + e.target.className + ' ').indexOf('iconrevoke') > -1) {
            revoke()
        }
        // 清空
        if ((' ' + e.target.className + ' ').indexOf('iconclear') > -1) {
            ctx.clearRect(0, 0, settings.width, settings.height);
            canvas_cache = [];
        }
    }, false);
})

// 撤销操作
function revoke() {
    let len = canvas_cache.length;
    if (len < 1) return;
    canvas_cache.pop();
    ctx.clearRect(0, 0, settings.width, settings.height);
    let img = new Image();
    let imgURL = canvas_cache.pop();
    if (imgURL) {
        img['src'] = imgURL;
        img.addEventListener('load', () => {
            ctx.drawImage(img, 0, 0, settings.width, settings.height)
        });
    }
}

// 下载
let downlink = document.getElementById('down');
downlink.addEventListener('click', (e) => {
    let dataURL = canvas.toDataURL('image/png'); //转换图片为dataURL
    downlink.download = 'canvas_img';
    downlink.href = dataURL;
});

window.addEventListener('resize', e => {
    resizeCanvas();
    let img = new Image();
    let imgURL = canvas_cache[canvas_cache.length-1];
    if (imgURL) {
        img['src'] = imgURL;
        img.addEventListener('load', () => {
            ctx.drawImage(img, 0, 0, settings.width, settings.height)
        });
    }
});