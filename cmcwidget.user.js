// ==UserScript==
// @name         CMC Widget
// @namespace    http://tampermonkey.net/
// @version      0.1
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
	$("body").append(`<style>.fake_link :hover{
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
			//text.setAttribute('href', `/transcript/message/${CMC[3]}#${CMC[3]}`)
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

			/*var CMCLink = document.createElement('a');
			CMCLink.setAttribute('href',`http://www.strawCMC.me/${CMC.CMC_id}`);
			CMCLink.innerHTML = `${CMC.title || CMC.CMC_id}`

			entry.append(CMCLink);
			entry.append(' - ');

			var permalink = document.createElement("a");
			permalink.setAttribute('class', 'permalink');
			permalink.setAttribute('rel', 'noreferrer noopener')
			permalink.setAttribute('href', `/transcript/message/${CMC.msg_id}#${CMC.msg_id}`);
			permalink.textContent = `${timeSpanString(Math.floor(new Date()/1000)-CMC.time)} ago`;

			entry.append(permalink);
			entry.append(' by ');

			var user = document.createElement('a');
			user.setAttribute('href', `/users/${CMC.user}`);
			user.textContent = CMC.user_name;

			entry.append(user);*/


			CMCs.append(entry);
		});

	}

	var onmessage = function(msg){
		try{
			CMCs_data = JSON.parse(msg.data);
			updateCMCs();
		}catch(e){
			console.error(e);
			console.log(msg);
		}
		return;
	}

	var connect = function(){
		socket = new WebSocket("wss://a-ta.co", "cmcs");
		socket.onmessage = onmessage;
		socket.onclose = connect;
	}

	connect();

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

	setInterval(function(){
		socket.send(JSON.stringify({action: "update"}))
	}, 5 * 1000);
})();