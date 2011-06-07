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
	$(document).click(function(e){
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
});
