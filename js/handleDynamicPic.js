var grobalUrl = "http://111.230.228.102:3000/";
window.dynamicPic = [];
//var grobalUrl =  'http://192.168.23.1:3000/';
//var grobalUrl =  'http://192.168.199.241:3000/';

//拍照
function getpic() {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var s = entry.toLocalURL() + "?version=" + new Date().getTime();;
			uploadHead(s); /*上传图片*/
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(s) {
		console.log("error" + s);
	}, {
		filename: "_doc/camera/"
	})
}

// 从相册中选择图片   
function getimg() {
	// 从相册中选择图片  
	plus.gallery.pick(function(e) {
		for(var i in e.files) {
			var fileSrc = e.files[i]
			uploadHead(fileSrc);
		}
	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image",
		multiple: true,
		maximum: 5,
		system: false,
		onmaxed: function() {
			plus.nativeUI.alert('最多只能选择5张图片');
		}
	});
}

//上传头像图片
function uploadHead(imgPath) {
	window.dynamicPic.push(imgPath);
	var dynamic_img_box = document.getElementById("dynamic_img_box");
	var add_img = document.getElementById("add_img");
	var newNode = document.createElement("div");
	newNode.onclick = function() {
		deletePic(imgPath,this)
	};
	newNode.className = 'dynamic_img_box_item';
	newNode.innerHTML = '<img src="' + imgPath + '" class="dynamic_img" /><img src="../../img/delete-dynamic-img.png" class="delete_img"  />';

	dynamic_img_box.insertBefore(newNode, add_img);
	
}

