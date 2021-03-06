// ==UserScript==
// @name         I Am Typing
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Show other stack exchange users you're typing!
// @author       The Flamin'Taco
// @include *://chat.meta.stackoverflow.com/rooms/*
// @include *://chat.meta.stackexchange.com/rooms/*
// @include *://chat.stackexchange.com/rooms/*
// @include *://chat.stackoverflow.com/rooms/*
// @include *://chat.askubuntu.com/rooms/*
// @include *://chat.serverfault.com/rooms/*
// @updateURL   https://github.com/TehFlaminTaco/TacosUserscripts/raw/master/iamtyping.user.js
// @grant        none

// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	var websocket;

	var typers = [];
	var typerNames = [];

	function send(data, otherData){
		if(typeof data == "string"){
			websocket.send(JSON.stringify({action: data, data: otherData}));
		}else{
			websocket.send(JSON.stringify(data));
		}
	}

	function userID(){
		return CHAT.CURRENT_USER_ID;
	}

	function userName(){
		return CHAT.RoomUsers.getIfAvailable(CHAT.CURRENT_USER_ID).name;
	}

	function room(){
		return CHAT.CURRENT_ROOM_ID;
	}

	function isTyping(){
		return $("#input")[0].value!=="";
	}

	// affirmTyping exists to avoid occasional bugs.
	function affirmTyping(){
		var thinksTyping = !!typers.find(x=>x[0]==userID());
		var isTyp = isTyping();
		if(thinksTyping && !isTyp)
			send("stopTyping");
	}

	function updateTyping(){
		if(isTyping())
			send("startTyping");
		else
			send("stopTyping");
	}

	function onmessage(msg){
		// We trust all the data from this socket to be formatted correctly.
		var data = JSON.parse(msg.data);

		if(data.action == "getDetails"){
			send("setUserID", userID());
			send("setUserName", userName());
			send("setRoom", room());
		}

		if(data.action == "updateTyping"){
			typers = data.data;
			typerNames = [];
			for(var i=0; i < typers.length; i++){
				if(typers[i][0] == userID())
					continue;
				typerNames.push(typers[i][1]);
			}
			typerSpan.innerHTML = getTyperText();
			affirmTyping();
		}
	}

	function connect(){
		websocket = new WebSocket("wss://a-ta.co", "typing");
		websocket.onmessage = onmessage;
		websocket.onclose = connect;
	}

	connect();

	$("#input").keyup(updateTyping);


	function getTyperText(){
		if(typerNames.length === 0){
			return "";
		}
		if(typerNames.length == 1){
			return "<b>" + typerNames[0] + "</b> is typing.";
		}
		if(typerNames.length > 5){
			return "<b>Multiple people</b> are typing.";
		}
		return "<b>" + typerNames.slice(0,typerNames.length - 1).join("</b>, <b>") + "</b> and <b>" + typerNames.slice(-1) + "</b> are typing.";
	}

	var style = document.createElement("style");
	style.innerHTML = `#typers{
	  position:absolute;
	  left:8em;
	  top:-1.5em;
	}`;
	document.body.append(style);

	var typerSpan = document.createElement("span");
	typerSpan.setAttribute("id", "typers");
	$("#input-area").prepend(typerSpan);
})();