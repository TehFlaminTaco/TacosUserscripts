// ==UserScript==
// @name         Team Spirit!
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Actually hate eachother for no reason.
// @author       Teh Flamin' Taco
// @include *://chat.meta.stackoverflow.com/rooms/*
// @include *://chat.meta.stackexchange.com/rooms/*
// @include *://chat.stackexchange.com/rooms/*
// @include *://chat.stackoverflow.com/rooms/*
// @include *://chat.askubuntu.com/rooms/*
// @include *://chat.serverfault.com/rooms/*
// @run-at document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function getHref(jEle){
		return jEle.attr("href") || getHref(jEle.parent());
	}

	$('head').append(`<style>
	.bluestar{
		background: url(http://a-ta.co/content/bluestar.png)
	}
	.redstar{
		background: url(http://a-ta.co/content/redstar.png)
	}
	</style>`)



	setInterval(function(){

		$(".username").each((a,b)=>{
			var jB = $(b);
			if(!jB.find(".stars").length){
				jB.prepend(`<span class='stars vote-count-container'><span class='img vote' style='background-image: url(${getHref(jB).match(/\/users\/(\d+)/)[1]%2==0 ? 'http://i.imgur.com/6RZ23Ak.png' : 'http://i.imgur.com/6jKoAti.png'}) !important'></span></span>`);
			}
		})

		$(".votesummary .collapsible").children()
		.each(
			(a,b)=>{
				var links = $(b).find('a');
				var jLink = $(links[links.length-1]);
				if(!jLink.find(".stars").length){
					jLink.prepend(`<span class='stars vote-count-container'><span class='img vote' style='background-image: url(${links[links.length-1].getAttribute("href").match(/users\/(\d+)/)[1]%2==0 ? 'http://i.imgur.com/6RZ23Ak.png' : 'http://i.imgur.com/6jKoAti.png'}) !important'></span></span>`);
				}
			}
		)

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
