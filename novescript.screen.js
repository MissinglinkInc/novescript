var novescript = {};
var novescriptVar = {};
novescript.key = {};
novescript.cmd = {};
novescript.strage = {};
novescript.diagAryIdxnow = 0;
novescript.dispAryIdx = 0;

// constants of jQuery objects
var $body = $("body");
var $choices = $("div#choices");
var $dialog = $("div#dialogue");
var $speaker = $("span#speaker");
var $dialogWrapper = $("div#dialogue_wrapper");
var $illusts = $("div#illusts");

// Regular expression of commands
var cmdregexp = new RegExp( "^%(\\w+)%$","" );
var varDeclareRegexp = new RegExp( "^\\$([\\w\\d_-]+)\\$$","" );
var varLoadRegexp = new RegExp( "#([\\w\\d_-]+?)#", "g" );

// toggle dialog window
novescript.toggleDialogue = function(){
	$dialogWrapper.toggle();
};

novescript.loadVar = function(target) {
	var replaced = target.replace(varLoadRegexp,function(whole,p1){
		if (!novescriptVar[p1]) {
			return '';
		}
		else {
			return novescriptVar[p1];
		}
	});
		return replaced;
};

// go next dialog
novescript.nextDialogue = function(){
novescript.dispAryIdx = 0;
		for (var speaker in novescript.diagAry[novescript.diagAryIdxnow]) {
			console.log(novescript.diagAryIdxnow+" / "+speaker);
			var text = novescript.diagAry[novescript.diagAryIdxnow][speaker];
			var command = cmdregexp.exec(speaker);
			var variable = varDeclareRegexp.exec(speaker);
			// call function
			if (cmdregexp.test(speaker)) {
				try {
					novescript.cmd.read[command[1]](text);
				}
				catch (e) {
					console.log(e);
				}
				novescript.diagAryIdxnow++;
				if (command[1] != "video") {
					novescript.nextDialogue();
				}
			}
			else if (varDeclareRegexp.test(speaker)) {
				novescriptVar[variable[1]] = text;
				console.log("var / "+variable[1]);
				novescript.diagAryIdxnow++;
				novescript.nextDialogue();
			}

			// read & show dialog from dialog-array
			else {
				novescript.diagAryIdxnow++;
				try {
					$("#video").hide().find("video").get(0).pause();
				}
				catch (e) {
					console.log(e.description);
				}
				novescript.showDialog(speaker,novescript.loadVar(text));
			}
		}
};

novescript.showDialog = function(speaker,text) {
	$dialog.html("");
	$dialogWrapper.show();
	$illusts.show();
	$choices.hide();
	$speaker.html(speaker);
	$dialog.html(text);
};

novescript.resetAllObj = function(){
	$dialogWrapper.show();
	$(".illust").each(function(){
		$(this).remove();
	});
	$(".background").each(function(){
		$(this).remove();
	});
	$("audio").each(function(){
		$(this).get(0).pause();
		$(this).remove();
	});
	$("video").each(function(){
		$(this).get(0).pause();
		$(this).remove();
	});
};

// called after decided a choice
novescript.decideChoice = function(dialogsUri){
	novescript.loadDiagfile(dialogsUri);
	novescript.nextDialogue();
	return false;
};

// load dialog file
novescript.loadDiagfile = function(dialogsUri){
	novescript.diagFilenow = dialogsUri;
	var diagAryIdx;
	novescript.diagAry = [];
	novescript.diagAryIdxnow = 0;
	$.ajax({
		type: "get",
		url: dialogsUri,
		async: false,
		dataType: "json",
		success:
			function(diagAry) {
				for (diagAryIdx in diagAry) {
					novescript.diagAry[diagAryIdx] = [];
					for (var key in diagAry[diagAryIdx]) {
						var command = cmdregexp.exec(key);
						if (cmdregexp.test(key)) {
							try {
								novescript.cmd.load[command[1]](diagAry[diagAryIdx][key]);
							}
							catch (e) {
								console.log(e);
							}
						}
						novescript.diagAry[diagAryIdx][key] = diagAry[diagAryIdx][key];
					}
				}
			},
		error:
			function(xhr,textStatus,errorThrown) {
				alert(textStatus,errorThrown);
			}
	});
};

function disableSelection(target){
	if (typeof target.onselectstart!="undefined") {//IE route
	    target.onselectstart=function(){return false};
	}
	else if (typeof target.style.MozUserSelect!="undefined") {//Firefox route
	    target.style.MozUserSelect="none";
	}
	else {//All other route (ie: Opera)
	    target.onmousedown=function(){return false};
	}
	target.style.cursor = "default";
};

