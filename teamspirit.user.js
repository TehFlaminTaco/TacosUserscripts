// ==UserScript==
// @name         Team Spirit!
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Actually hate eachother for no reason.
// @author       Teh Flamin' Taco
// @match        *://*chat.stackexchange.com/*
// @match        *://*chat.stackoverflow.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	setInterval(function(){
	var x=$(".user-container");
	x.each((i,a)=>{
		try{
			var names = $(a).find(".username");
			if(names.length > 0){
				names.css({color : a.getAttribute("class").match(/\d+/)[0]%2==0 ? "#F00" : "#00F"})
			}
		}catch(e){}
	})
	$(".votesummary .collapsible").children()
	.each(
		(a,b)=>{
			var links = $(b).find('a');
			$(links[links.length-1]).css({["color"] : links[links.length-1].getAttribute("href").match(/users\/(\d+)/)[1]%2==0 ? "#F00" : "#00F"});
		}
	)},100);

	setInterval(function(){
		var x = $(".user-container");
		var cRed = 0;
		var cBlue = 0;
		for(var i=0; i < x.length; i++){
			try{
		    	if(x[i].getAttribute("class").match(/\d+/)[0]%2==0){cRed++}else{cBlue++}
			}catch(e){}
		}

		$(".votesummary .collapsible").children()
		.each(
			(a,b)=>{
				var votes = $(b).find(".vote-count-container .times").text()
				var links = $(b).find('a');
				if(votes==""){votes = 1}
				if (links[links.length-1].getAttribute("href").match(/users\/(\d+)/)[1]%2==0){cRed+=votes*10}else{cBlue+=votes*10}
			}
		)
		var total = cRed + cBlue;

		var redPercent = Math.ceil((cRed / total)*100);
		var bluPercent = Math.floor((cBlue / total)*100);
		$("#redscore").css({width:`${redPercent}%`});
		$("#bluescore").css({width:`${bluPercent}%`});
	},2000);

	$(".chat-input").append(`<div id="scoreholder"><div id="redscore" class="scoreholder"></div><div id="bluescore" class="scoreholder"></div></div>`)

	$("head").append(`<style>
#scoreholder{
	height:3px;
	padding:1px;
	background-color:#000;
}

#redscore{
	background-color:#F00;
	width:50%;
}

.scoreholder{
	height:3px;
	float:left;
	transition:all linear 1s;
}

#bluescore{
	background-color:#00F;
	width:50%;
}
</style>`)

})();
