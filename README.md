#vue-drawimg

//模块引入需要vue.use();
//页面直接调用 不需要
// 此方法 会得到一个剪裁图片的开始坐标  和图片缩放后的宽高，传入后台之后，后台把图片缩放至传入宽高  再更具其实位置 要剪裁的大小 就可剪裁出需要的大小


因为需要dom操作 故此方法执行 需要如下执行  或者放在得到url地址后执行
 mounted: function() {
        this.$nextTick(function() {
            this.$nextTick(function() {
                self.$drawImg({
                    imgbox: "img_box",//外框id
                    drawbox: "img_drag_box",//剪裁框id
                    src: "meizi_tx.jpg",//需要剪裁的图片地址
                    btn: "btn",//剪裁按钮id
                    fun: self.getData//点击剪裁按钮回掉，上传图片可以在这里面执行
                });
            })
        })
}

