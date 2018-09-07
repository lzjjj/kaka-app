var grobalUrl = "http://111.230.228.102:3000/";
//var grobalUrl =  'http://192.168.23.1:3000/';
//var grobalUrl =  'http://192.168.199.241:3000/';
//拍照
function getpic() {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var s = entry.toLocalURL() ;
			uploadHead(s); /*上传图片*/
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(s) {
		console.log("error" + s);
	}, {
		filename: "_doc/head.png"
	})
}

//获取相册
function getimg() {
	plus.gallery.pick(function(a) {
		plus.io.resolveLocalFileSystemURL(a, function(entry) {
			plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
				root.getFile("head.png", {}, function(file) {
					//文件已存在
					file.remove(function() {
						console.log("删除成功");
						entry.copyTo(root, "head.png", function(e) {
							var e = e.fullPath ;
							uploadHead(e); /*上传图片*/
							//变更大的图预览的src
							//目前只有一张图暂且这样处理，后续需要用标准组件实现
						}, function(e) {
							console.log("copy img file:" + e.message);
						});
					}, function() {
						console.log("删除" + e.message)
					});
				}, function() {
					//文件不存在
					entry.copyTo(root, "head.png", function(e) {
						var path = e.fullPath ;
						uploadhead(path); /*上传图片*/
					}, function(e) {
						console.log("copy img file:" + e.message);
					});
				});
			}, function(e) {
				console.log("get _www folder fail");
			})
		}, function(e) {
			console.log("读取拍照文件错误" + e.message);
		})
	}, function(a) {}, {
		filter: "image"
	})
}
//上传头像图片
function uploadHead(imgPath) {
	var mainImage = document.getElementById("headImg");
	mainImage.src = imgPath;

	var image = new Image();
	image.src = imgPath;
	image.onload = function() {
		var imgData = getBase64Image(image);
		mui.ajax(grobalUrl+"upload", {
			data: {
				imgData: imgData,
				user_id:JSON.parse(localStorage.getItem('user')).user_id
			},
			type: 'post',
			success: function(data) {
				var obj = JSON.parse(localStorage.getItem('user'));
				obj.user_pic = data.picPath;

				localStorage.setItem("user",JSON.stringify(obj));
				var minewebview = plus.webview.getWebviewById('barItem/mine.html');//更新数据
				mui.fire(minewebview,'pageflowrefresh');

				mui.toast('成功');
			},
			error: function(xhr, type, errorThrown) {
				mui.toast('错误');
			}
		});

	}
}

//转换64
function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	var width = img.width;
	var height = img.height;

	if(width > height) {
		if(width > 300) {
			height = Math.round(height *= 300 / width);
			width = 300;
		}
	} else {
		if(height > 300) {
			width = Math.round(width *= 300 / height);
			height = 300;
		}
	}

	canvas.width = width;
	canvas.height = height;

	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height); /*绘图*/
	var dataURL = canvas.toDataURL("image/png", 0.8);
	return dataURL.replace("data:image/png;base64,", "");

}