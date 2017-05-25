(function() {
    var dragImage = {
        top: 0,
        left: 0,
        lastX: 0,
        lastY: 0,
        line: 0,
        p: true,
        time: 0,
        count: 1,
    };
    dragImage.install = function(vue, option) {
            var self = this;

            vue.prototype.$drawImg = function(option) {

                self.element = document.getElementById(option.imgbox);
                self.sm_box = document.getElementById(option.drawbox);
                self.img = self.element.querySelector("img");
                self.btn = document.getElementById(option.btn);
                self.fun = option.fun;
                self.img.style.left = 0;
                self.img.style.top = 0;

                self.width = self.element.clientWidth;
                self.sm_width = self.sm_box.clientWidth;
                self.topAndLeft = (self.width - self.sm_width) / 2;

                var img = new Image();
                img.src = option.src;
                img.onload = function() {
                    self.init();
                }
            }

        }
        //剪裁图片
    dragImage.btnFun = function() {
            var self = this;
            self.btn.addEventListener("click", function() {
                var obj = {
                    x: self.topAndLeft - self.left,
                    y: self.topAndLeft - self.top,
                    img_w: self.img.width,
                    img_h: self.img.height,
                    w: 200,
                    h: 200
                }
                self.fun(obj)
            })
        }
        //清除浏览器默认行为
    dragImage.clearHtml = function() {
            this.element.addEventListener("touchstart", function(e) {
                e.preventDefault();
            })
        }
        //固定选择框
    dragImage.g_imgBox = function() {
            var self = this;
            self.sm_box.style.top = self.topAndLeft + "px";
            self.sm_box.style.left = self.topAndLeft + "px";
        }
        //调整图片位置
    dragImage.fixImage = function() {
            var self = this;
            if (self.img.width <= 210) {
                self.sm_box.style.top = (self.topAndLeft + 2) + "px";
                self.sm_box.style.left = (self.topAndLeft + 2) + "px";
            }
        }
        //图片控制
    dragImage.moveImg = function(e) {
        var self = this;
        self.element.addEventListener("touchstart", function(e) {
            self.img.style.transition = "";
            var touch = e.touches[0]; //获取第一个触点
            var touch_t = e.touches[1]; //获取第一个触点
            self.count++;
            if (self.time == 0) {
                self.time = new Date().getTime()
            }
            if (!touch_t) {
                self.lastX = touch.pageX;
                self.lastY = touch.pageY;
                self.p = true;
            } else {
                self.line = parseInt(Math.sqrt(Math.pow(Math.abs(touch.pageX - touch_t.pageX), 2) + Math.pow(Math.abs(touch.pageY - touch_t.pageY), 2)));
                self.p = false;
            }
        })
        self.element.addEventListener("touchmove", function(e) {

            var touch = e.touches[0]; //获取第一个触点
            var touch_t = e.touches[1]; //获取第二个触点
            if (!touch_t) { //移动图片

                if (Math.abs(self.lastX - touch.pageX) > 10 || Math.abs(self.lastY - touch.pageY) > 10) {
                    self.time = 0;
                    self.count = 1;
                }

                if (self.p) {
                    var lf = self.img.style.left == "" ? 0 : self.img.style.left;
                    var tp = self.img.style.top == "" ? 0 : self.img.style.top;
                    self.left = parseInt(lf) + (touch.pageX - self.lastX);
                    self.top = parseInt(tp) + (touch.pageY - self.lastY);

                    //判断left,top最大临界值
                    self.left = self.left > self.topAndLeft ? self.topAndLeft : self.left;
                    self.top = self.top > self.topAndLeft ? self.topAndLeft : self.top;
                    //判断left,top最小临界值
                    var num_x = self.img.width >= self.topAndLeft + self.sm_width ? -1 : 1;
                    var num_y = self.img.height >= self.topAndLeft + self.sm_width ? -1 : 1;
                    self.left = self.left < (num_x * Math.abs(self.img.width - (self.topAndLeft + self.sm_width)) + 4) ? (num_x * Math.abs(self.img.width - (self.topAndLeft + self.sm_width)) + 4) : self.left;
                    self.top = self.top < (num_y * Math.abs(self.img.height - (self.topAndLeft + self.sm_width)) + 4) ? (num_y * Math.abs(self.img.height - (self.topAndLeft + self.sm_width)) + 4) : self.top;
                    //判断当前图片是否小于 选择框
                    var left = self.img.width < self.sm_width || self.img.height <= self.sm_width ? self.topAndLeft + 2 : self.left;
                    var top = self.img.width < self.sm_width || self.img.height <= self.sm_width ? self.topAndLeft + 2 : self.top;

                    self.img.style.left = self.left + "px";
                    self.img.style.top = self.top + "px";

                    self.lastX = touch.pageX;
                    self.lastY = touch.pageY;
                }
            } else { //缩放图片
                self.p = false; //图片移动不触发
                self.time = 0;
                self.count = 1;
                if (self.line == 0) {
                    self.line = parseInt(Math.sqrt(Math.pow(Math.abs(touch.pageX - touch_t.pageX), 2) + Math.pow(Math.abs(touch.pageY - touch_t.pageY), 2)));
                    return;
                }
                //计算两个手指间的距离
                var line = parseInt(Math.sqrt(Math.pow(Math.abs(touch.pageX - touch_t.pageX), 2) + Math.pow(Math.abs(touch.pageY - touch_t.pageY), 2)));
                if (Math.abs(line - self.line) < 10) {
                    return;
                }
                var width = self.img.width;

                var s = line > self.line ? Math.abs(line - self.line) : -1 * Math.abs(line - self.line);
                s = s * 2;

                var left = s > 0 ? (parseInt(self.img.style.left) - (Math.abs(line - self.line))) : (parseInt(self.img.style.left) + (Math.abs(line - self.line)));
                var top = s > 0 ? (parseInt(self.img.style.top) - (Math.abs(line - self.line))) : (parseInt(self.img.style.top) + (Math.abs(line - self.line)));

                self.img.style.width = (width + s) + "px";
                self.img.style.left = left + "px";
                self.img.style.top = top + "px";
                self.line = line;
            }
        })
        self.element.addEventListener("touchend", function(e) {
            //判断 图片大小
            if (self.img.width < 200) {
                self.img.style.transition = "all .3s";
                self.img.style.width = (self.sm_width + 4) + "px";
                self.img.style.left = self.topAndLeft + "px";
                self.img.style.top = self.topAndLeft + "px";
                setTimeout(function() {
                    self.p = true;
                }, 300)
            }

            var t = new Date().getTime();
            if (t - self.time < 300 && self.count >= 3) {
                self.img.style.transition = "all .1s";
                self.img.style.width = (self.sm_width + 4) + "px";
                self.img.style.left = self.topAndLeft + "px";
                self.img.style.top = self.topAndLeft + "px";
                self.left = self.topAndLeft;
                self.top = self.topAndLeft;
                setTimeout(function() {
                    self.p = true;
                }, 100)
                self.time = 0;
                self.count = 1;
            }
        })
    }

    //初始化
    dragImage.init = function() {
        this.moveImg();
        this.clearHtml();
        this.fixImage();
        this.btnFun();
    }

    if (typeof exports == "object") {
        module.exports = dragImage
    } else if (typeof define == "function" && define.amd) {
        define([], function() {
            return dragImage
        })
    } else if (window.Vue) {
        Vue.use(dragImage)
    }
})()