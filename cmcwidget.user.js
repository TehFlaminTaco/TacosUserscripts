// ==UserScript==
// @name         CMC Widget
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Adds a list of recent CMCs!
// @author       The Flamin' Taco
// @include *://chat.meta.stackoverflow.com/rooms/*
// @include *://chat.meta.stackexchange.com/rooms/*
// @include *://chat.stackexchange.com/rooms/*
// @include *://chat.stackoverflow.com/rooms/*
// @include *://chat.askubuntu.com/rooms/*
// @include *://chat.serverfault.com/rooms/*
// @run-at document-end
// @grant        none
// ==/UserScript==

/* global $ */
(function() {
	'use strict';

	// Only TNB
	if(CHAT.CURRENT_ROOM_ID != 240)
		return;

	// This horrifying one liner adds the cmcs widget.
	$($("#widgets").find("div.sidebar-widget")[1]).after($(`<div class="sidebar-widget" style="display:block;"><div class="fr msg-small">Recent CMCs <a id="displayCMCsButton" onclick="toggle_CMCs()" class="fake_link">show</a></div><br class="cboth"><ul id="CMCs" class="collapsible" style="display:none;"></ul></div>`));
	$("body").append(`<style>.fake_link:hover{
	cursor: pointer;
}

.CMC{
  font-size:10px;
}
</style>`);

	var CMCs = $("#CMCs");
	var socket;
	var CMCs_data = [];

	var updateCMCs = function(){
		CMCs.html(""); // Clear the current CMCs.

		CMCs_data.forEach((CMC,i)=>{
			var entry = document.createElement('li');
			entry.setAttribute("id",`CMC-${i}`);
			entry.setAttribute('class', 'CMC');
			entry.setAttribute('style','display:block;');

			var replyButton = document.createElement('a');
			replyButton.innerHTML = '&#x21A9;';
			replyButton.onclick = function(){$("#input").val(`:${CMC[3]} `); $("#input").focus(); $("#input")[0].selectionStart = $("#input").val().length; $("#input")[0].selectionEnd = $("#input").val().length;}
			replyButton.setAttribute('class', 'fake_link');

			entry.append(replyButton);
			entry.append(" ");

			var text = document.createElement('span');
			text.innerHTML = CMC[4].replace(/\s+/g, " "); // Newlines are icky.

			entry.append(text)
			entry.append(' - ');

			var permalink = document.createElement("a");
			permalink.setAttribute('class', 'permalink');
			permalink.setAttribute('rel', 'noreferrer noopener')
			permalink.setAttribute('href', `/transcript/message/${CMC[3]}#${CMC[3]}`);
			permalink.textContent = `${timeSpanString(Math.floor(new Date()/1000)-CMC[0])} ago`;

			entry.append(permalink);
			entry.append(' by ');

			var user = document.createElement('a');
			user.setAttribute('href', `/users/${CMC[1]}`);
			user.textContent = CMC[2];

			entry.append(user)


			CMCs.append(entry);
		});

	}

	var CMCsOn = false;
	window.toggle_CMCs = function(){
		if(CMCsOn){
			CMCs.css({display: "none"});
			$("#displayCMCsButton").text("show");
		}else{
			CMCs.css({display: "block"});
			$("#displayCMCsButton").text("hide");
		}
		CMCsOn = !CMCsOn;
		return false;
	}
    setTimeout(toggle_CMCs,3000);

	function fromTimestamp(text){
        text = text.toLowerCase();
		let n = new Date()/1000;
		let hoursminutespm = text.match(/(\d?\d):(\d\d)(?: ([ap]m))?/);
		let hours = +hoursminutespm[1];
		let minutes = +hoursminutespm[2];
		let pm = hoursminutespm[3];
		if(hours == 12){
			hours = 0;
		}
		if(pm === "pm"){
			hours += 12;
		}
		if(text.match(/^yst/)){
			// Yesterday's date
			let yesterday = new Date(1000*(n - (60 * 60 * 24)))
			let day = yesterday.getDate();
			let month = yesterday.getMonth();
			let year = yesterday.getFullYear();
			return new Date(year,month,day,hours,minutes,0,0)/1000;
		}
		if(text.match(/^(mon|tue|wed|thu|fri|sat|sun)/i)){
			let dayoftheweek = "sunmontuewedthufrisat".indexOf(text.match(/^(mon|tue|wed|thu|fri|sat|sun)/i)[1].toLowerCase())/3;
			let distance = (new Date().getDay() - dayoftheweek + 7)%7;
			let pastday = new Date(1000*(n - (distance * 60 * 60 * 24)))
			let day = pastday.getDate();
			let month = pastday.getMonth();
			let year = pastday.getFullYear();
			return new Date(year,month,day,hours,minutes,0,0)/1000;
		}
		if(text.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d?\d)(?:,\s*(\d{4}))?/)){
			let monthday = text.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d?\d)(?:,\s*(\d{4}))?/i);
			let month = "janfebmaraprmayjunjulaugsepoctnovdec".indexOf(monthday[1].toLowerCase())/3;
			let date = monthday[2]
			let year = monthday[3]||new Date().getFullYear();
			return new Date(year,month,day,hours,minutes,0,0)/1000;
		}
		return new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),hours,minutes,0,0)/1000;
	}

	function TryUpdate(){
        $.get("https://chat.stackexchange.com/search?q=CMC&room=240").then(body=>{
            let CMCs = $(body).find(".message:has(.content b:contains(\"CMC\"))");
            CMCs_data = [...CMCs.filter((i,e)=>$(e).find(".content")[0].innerHTML.trimStart().match(/^(@\S+\s*)?(<b>)?CMC:?(<\/b>)?/))]
                .slice(0,3)
                .map(e=>[
                fromTimestamp($(e).parent().find(".timestamp")[0].textContent),						// 0: Time
                $(e).parent().parent().find(".username a").attr("href").match(/\/users\/(\d+)/)[1],	// 1: User ID
                $(e).parent().parent().find(".username")[0].textContent.trim(),						// 2: Username
                $(e).find("a").attr("name"),		      											// 3: Message ID
                $(e).find(".content")[0].innerHTML.trim(), 											// 4: CMC Concent
            ]);
            CMCs_data=CMCs_data.concat([...$(".message").filter((i,e)=>$(e).find(".content")[0].innerHTML.trimStart().match(/^(@\S+\s*)?(<b>)?CMC:?(<\/b>)?/))]
                .slice(0,3)
                .map(e=>[
                new Date()/1000,						// 0: Time
                $($(e).parent().parent().find(".username")[0]).parent().parent().attr("href").match(/\/users\/(\d+)/)[1],	// 1: User ID
                $(e).parent().parent().find(".username")[0].textContent.trim(),						// 2: Username
                e.id.substr("message-".length),		      											// 3: Message ID
                $(e).find(".content")[0].innerHTML.trim(), 											// 4: CMC Concent
            ]).filter(c=>!CMCs_data.some(j=>j[3]==c[3]))).sort((a,b)=>b[3]-a[3]);
            updateCMCs();
        });
	}

	let last = $("#chat").text();
	setInterval(function(){
		let cur = $("#chat").text()
		if(last !== cur){
			TryUpdate();
		}
	}, 5 * 1000);
    TryUpdate();
})();
