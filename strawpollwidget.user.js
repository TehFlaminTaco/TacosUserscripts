// ==UserScript==
// @name         Strawpoll Box
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Adds a list of recent polls that can be previewed and voted on!
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
	// This horrifying one liner adds the polls widget.
	$($("#widgets").find("div.sidebar-widget")[1]).after($(`<div class="sidebar-widget" style="display:block;"><div class="fr msg-small">Recent polls <a id="displayPollsButton" onclick="toggle_polls()" class="fake_link">show</a></div><br class="cboth"><ul id="polls" class="collapsible" style="display:none;"></ul></div>`));
	$("body").append(`<style>.fake_link :hover{
	cursor: pointer;
}

.scores{
  font-size: 10px;
  position: relative;
  left: 32px;
}

.poll{
  font-size:10px;
}

.scores tr{
  border-bottom:solid 1px black;
  border-bottom:solid 1px rgba(0,0,0,0.3);
}

.poll_option{
  font-weight:bold;
}

.poll_score{
  padding-left:12px;
}</style>`);

	var polls = $("#polls");
	var socket;
	var room = CHAT.CURRENT_ROOM_ID;
	var polls_data = [];

	var updatePolls = function(){
		polls.html(""); // Clear the current polls.

		polls_data.forEach((poll,i)=>{
			var entry = document.createElement('li');
			entry.setAttribute("id",`poll-${i}`);
			entry.setAttribute('class', 'poll');
			entry.setAttribute('style','display:block;');

			var replyButton = document.createElement('a');
			a.innerHTML = '&#x21A9;';


			var pollLink = document.createElement('a');
			pollLink.setAttribute('href',`http://www.strawpoll.me/${poll.poll_id}`);
			pollLink.innerHTML = `${poll.title || poll.poll_id}`

			entry.append(pollLink);
			entry.append(' - ');

			var permalink = document.createElement("a");
			permalink.setAttribute('class', 'permalink');
			permalink.setAttribute('rel', 'noreferrer noopener')
			permalink.setAttribute('href', `/transcript/message/${poll.msg_id}#${poll.msg_id}`);
			permalink.textContent = `${timeSpanString(Math.floor(new Date()/1000)-poll.time)} ago`;

			entry.append(permalink);
			entry.append(' by ');

			var user = document.createElement('a');
			user.setAttribute('href', `/users/${poll.user}`);
			user.textContent = poll.user_name;

			entry.append(user);

			var scores = document.createElement("table");

			scores.setAttribute("class", "scores");

			for(var i=0; i<poll.options.length; i++){
				var score = document.createElement('tr');

				var optionName = document.createElement('td');
				optionName.setAttribute("class", "poll_option");
				optionName.innerHTML = poll.options[i];
				score.append(optionName);
				
				var vote = document.createElement("td");
				vote.setAttribute("class", "poll_score");
				vote.append(poll.votes[i]);
				score.append(vote);

				scores.append(score);
			}

			entry.append(scores);

			polls.append(entry);
		});

	}

	var onmessage = function(msg){
		try{
			polls_data = JSON.parse(msg.data);
			updatePolls();
		}catch(e){
			console.error(e);
			console.log(msg);
		}
		return;
	}

	var connect = function(){
		socket = new WebSocket("wss://a-ta.co", "pollbox");
		socket.onmessage = onmessage;
		socket.onclose = connect;
	}

	connect();

	var pollsOn = false;
	window.toggle_polls = function(){
		if(pollsOn){
			polls.css({display: "none"});
			$("#displayPollsButton").text("show");
		}else{
			polls.css({display: "block"});
			$("#displayPollsButton").text("hide");
		}
		pollsOn = !pollsOn;
		return false;
	}

	setInterval(function(){
		socket.send(JSON.stringify({action: "update", data: room}))
	}, 5 * 1000);
})();