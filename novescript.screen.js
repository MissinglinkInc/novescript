var novescript = {};
novescript.key = {};
novescript.cmd = {};
novescript.diagAryIdxnow = 0;

// constants of jQuery objects
var $body = $("body");
var $choices = $("div#choices");
var $dialog = $("div#dialogue");
var $speaker = $("span#speaker");
var $dialogWrapper = $("div#dialogue_wrapper");
var $illusts = $("div#illusts");

// Regular expression of commands
var cmdregexp = new RegExp( "^%(\\w+)%$","" );

// toggle dialog window
novescript.toggleDialogue = function(){
	$dialogWrapper.toggle();
}

// go next dialog
novescript.nextDialogue = function(){
	$dialog.html("");
		for (var speaker in novescript.diagAry[novescript.diagAryIdxnow]) {
			var text = novescript.diagAry[novescript.diagAryIdxnow][speaker];
			var command = cmdregexp.exec(speaker);
			// call function
			if (cmdregexp.test(speaker)) {
				try {
					novescript.cmd.read[command[1]](text);
					console.log(command[1]);
				}
				catch (e) {
					console.log(e);
				}
				novescript.diagAryIdxnow++;
				if (command[1] != "video") {
					novescript.nextDialogue();
				}
			}

			// read & show dialog from dialog-array
			else {
				$("#video").hide().find("video").get(0).pause();
				$dialogWrapper.show();
				$illusts.show();
				$choices.hide();
				$speaker.html(speaker);
				$dialog.html(text);
				novescript.diagAryIdxnow++;
			}
		}
		console.log(novescript.diagAryIdxnow);
}

// called after decided a choice
novescript.decideChoice = function(dialogsUri){
	novescript.loadDiagfile(dialogsUri);
	novescript.nextDialogue();
	return false;
}

// load dialog file
novescript.loadDiagfile = function(dialogsUri){
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
}
