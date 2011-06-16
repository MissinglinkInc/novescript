$(function(){
	novescript.automode = 0;
	var $autobtn = $("a#auto");
	var $skipbtn = $("a#skip");
	var $qsavebtn = $("a#qsave");
	var $qloadbtn = $("a#qload");
	var $savebtn = $("a#save");
	var $loadbtn = $("a#load");
	$(document).keypress(function(e){
	});
	$(document).keydown(function(e){
		// ctrl
		if (e.which == 17) {
			novescript.key.skip = setInterval(function(){
				novescript.nextDialogue();
			},100);
		}
	});
	$(document).keyup(function(e){
		if (e.which == 17) {
			clearInterval(novescript.key.skip);
		}
		if (e.which == 13) {
			novescript.nextDialogue();
		}
		if (e.which == 32) {
			novescript.toggleDialogue();
		}
	});
	var wheelangle = 0;
	$(document).mousewheel(function(e,d){
					console.log(d);
		wheelangle += d;
		if (wheelangle < -0.75) {
			novescript.nextDialogue();
			wheelangle = 0;
		}
		else if (wheelangle > 0.75) {
			wheelangle = 0;
			novescript.dispAryIdx--;
			console.log(novescript.diagAryIdxnow +"/"+novescript.dispAryIdx);
			$dialog.html("");
			for (var speaker in novescript.diagAry[novescript.diagAryIdxnow - novescript.dispAryIdx]) {
				console.log(speaker);
				var cmdregexp = new RegExp( "^%(\\w+)%$","" );
				var command = cmdregexp.exec(speaker);
				if (cmdregexp.test(speaker)) {
				}
				else {
					var idx = novescript.diagAryIdxnow - novescript.dispAryIdx;
					console.log(idx+"/"+speaker+"/"+text);
					var text = novescript.diagAry[idx][speaker];
					novescript.showDialog(speaker,text);
				}
			}
		}
	});
	disableSelection(document.body) //Disable text selection on entire body  
	$("body").click(function(e){
		console.log("body clicked");
		novescript.nextDialogue();
	});
	$autobtn.click(function(e){
		if (novescript.automode == 0) {
			novescript.autotimer = setInterval(function(){
				novescript.nextDialogue();
			},3000);
			novescript.automode = 1;
		}
		else {
			clearInterval(novescript.autotimer);
			novescript.automode = 0;
		}
		return false;
	});
	$qsavebtn.click(function(e){
		novescript.strage.save('qsave');
		return false;
	});
	$qloadbtn.click(function(e){
		novescript.strage.load('qsave');
		return false;
	});
	$savebtn.click(function(e){
		return false;
	});
	$loadbtn.click(function(e){
		return false;
	});
});
