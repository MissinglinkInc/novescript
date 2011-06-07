novescript.cmd.read = {};
novescript.cmd.load = {};
novescript.conf = {};
novescript.conf.imgMargin = 50;

novescript.cmd.load.branch = function(){
}

var diagAryIdxRead = 0;
var diagAryIdxLoad = 0;

novescript.cmd.read.branch = function(text){
	$dialogWrapper.hide();
	$illusts.hide();
	$choices.empty();
	$choices.show();
	for (var choice in text) {
		for (var choiceName in text[choice]) {
			$choices.append("<p><a href='#' class='choice' data-loaduri='"+text[choice][choiceName]+"' onclick='novescript.decideChoice(\""+text[choice][choiceName]+"\");'>"+choiceName+'</a></p>');
		}
	}
}

novescript.cmd.load.include = function(){
}

novescript.cmd.read.include = function(text){
	novescript.loadDiagfile(text);
	novescript.nextDialogue();
}

novescript.cmd.load.css = function(text){
}

novescript.cmd.read.css = function(text){
	for (var elem in text) {
		for (var property in text[elem]) {
			$("#"+elem)
					.css(property,text[elem][property])
		}
	}
}

novescript.cmd.load.video = function(text){
	$("#video").empty();
	var size = '';
	size = "width='"+$body.width()+"px'";
	$("#video").append("<video src='"+text+"' "+size+" preload></video>");
}

novescript.cmd.read.video = function(text) {
	var $video = $("video[src='"+text+"']");
	$dialogWrapper.hide();
	$illusts.hide();
	$choices.hide();
	$("audio.bgm").get(0).pause();
	$("audio.se").get(0).pause();
	$video.get(0).play();
	$video.parent().show();
	$video
		.css("top",($body.height()-$video.height())/2);
}

novescript.cmd.load.image = function(text){
	for (var type in text) {
		diagAryIdxLoad++;
		if (type == "background") {
			var selector = "ns-"+type+"-"+diagAryIdxLoad;
			$body.append("<div id=\""+selector+"\"></div>");
			$("#"+selector)
				.addClass(type)
				.css("background-image",'url("'+text[type]+'")')
				.hide();
		}
		else if (type == "clear") {
		}
		else {
			var selector = "ns-illusts-"+diagAryIdxLoad;
			$illusts.append("<div id='"+selector+"' class='illust'></div>");
			for (var atype in text[type]) {
				$("#"+selector).append("<img src="+text[type][atype]+" class='"+selector+"' id='ns-illusts-"+diagAryIdxLoad+"-"+atype+"' />");
			}
			$("#"+selector)
				.hide()
				.css("margin","0 auto");
		}
	}
}

novescript.cmd.read.image = function(text){
	for (var type in text) {
		diagAryIdxRead++;
		if (type == "background") {
			var toShow = "#ns-"+type+"-"+diagAryIdxRead;
			$(toShow).show();
			$(novescript.lastShowedBackground).remove();
			novescript.lastShowedBackground = toShow;
		}
		else if (type == "clear") {
			$("."+text[type]).remove();
		}
		else {
			for (var atype in text[type]) {
				$(".illust").hide();
				var toShow = "#ns-illusts-"+diagAryIdxRead;
				novescript.lastShowedIllust = toShow;
				var imgWidth = 0;
				var imgMaxHeight = 0;
				$(toShow).find("img").each(function(){
					imgWidth += $(this).get(0).naturalWidth + 1 + novescript.conf.imgMargin*2;
					if (imgMaxHeight < $(this).get(0).naturalHeight) {
						imgMaxHeight = $(this).get(0).naturalHeight;
					}
					$(this)
						.css("z-index","1")
						.css("vertical-align","bottom")
						.css("margin","0 "+novescript.conf.imgMargin+"px");
				})
				$(toShow)
					.css("width",imgWidth)
					.css("margin","0 auto")
					$(toShow).show();
			}
		}
	}
}


novescript.cmd.load.audio = function(attr){
	for (var param in attr) {
		if (param == "bgmloop") {
			$("div#audio").append("<audio src="+attr[param]+" preload loop id=\"bgm"+novescript.diagAryIdxnow+"\" class=\"preload bgm\"></audio>");
		}
		else if (param == "bgmonce") {
			$("div#audio").append("<audio src="+attr[param]+" preload id=\"bgm"+novescript.diagAryIdxnow+"\" class=\"preload bgm\"></audio>");
		}
		else if (param == "se") {
			$("div#audio").append("<audio src="+attr[param]+" preload id=\"se"+novescript.diagAryIdxnow+"\" class=\"preload se\"></audio>");
		}
	}
	if (attr == "bgmstop") {
	
	}
}

novescript.cmd.read.audio = function(attr) {
	for (var param in attr) {
		if (param == "bgmloop") {
			//$("audio.bgm").get(0).pause();
			$("audio.bgm").each(function(){
				$(this).get(0).pause();
			})
			$("audio[src='"+attr[param]+"']").get(0).play();
		}
		else if (param == "bgmonce") {
			$("audio.bgm").each(function(){
				$(this).get(0).pause();
			})
			//$("audio.bgm").get(0).pause();
			$("audio[src='"+attr[param]+"']").get(0).play();
		}
		else if (param == "se") {
			$("audio.se").each(function(){
				$(this).get(0).pause();
			})
			$("audio[src='"+attr[param]+"']").get(0).play();
		}
	}
	if (attr == "bgmstop") {
		$("audio.bgm").get(0).pause();
		$("audio.bgm").each(function(){
			$(this).get(0).pause();
		})
	}
}
