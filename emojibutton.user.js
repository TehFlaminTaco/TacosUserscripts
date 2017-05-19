// ==UserScript==
// @name         Emoji Button
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  Add a button to push to do the Emoji Thing!
// @author       Teh Flamin' Taco
// @include *://chat.meta.stackoverflow.com/rooms/*
// @include *://chat.meta.stackexchange.com/rooms/*
// @include *://chat.stackexchange.com/rooms/*
// @include *://chat.stackoverflow.com/rooms/*
// @include *://chat.askubuntu.com/rooms/*
// @include *://chat.serverfault.com/rooms/*
// @updateURL   https://rawgit.com/TehFlaminTaco/TacosUserscripts/blob/master/emojibutton.user.js
// @run-at document-end
// @grant        none
// ==/UserScript==

(function(){
	'use strict';
	window.emoji = {};
	$.getJSON("https://a-ta.co/emoji.jsd?jsoncallback=?").then((x)=>window.emoji=x);

	document.head.innerHTML +=
`<style>#emoji-panel{
  width:13em;
  margin-top:-20em;
  background-color:#FFF;
  border:solid black 1px;
  border-radius: 4px;
  position:absolute;

}

#emoji-button{
  font-size:2em;
  float:left;
  cursor:pointer;
}

#emoji-holder{
  overflow-wrap:break-word;
  overflow-y:scroll;
  height:13em;
  font-size:12pt;
}

.emoji{
  cursor:pointer;
  float:left;
  -webkit-touch-callout: none;
    -webkit-user-select: none;
     -khtml-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
}

.emoji-category{
  float:left;
  width:100%;
}

#emoji-search{
  border-radius:8px;
  border-color:#09F;
  height:1.3em;
  width:calc(100% - 8px);
}</style>`;


	var ePanel = document.createElement("div");
	var jPanel;
	ePanel.setAttribute("id", "emoji-panel");

	var search = document.createElement("input");
	search.setAttribute("type","text");
	search.setAttribute("id", "emoji-search");
	search.setAttribute("placeholder", "⌕ search");

	var innerPanel = document.createElement("div");
	innerPanel.setAttribute("id", "emoji-holder");
	ePanel.append(search);
	ePanel.append(innerPanel);

	var gen = emoj=>()=>document.getElementById("input").value += emoj;

	window.updateEmoji = function(){
		innerPanel.innerHTML = "";
		var pattern = new RegExp(search.value, "i");
		for(var category in emoji){
			var cat = document.createElement("div");
			cat.setAttribute("class","emoji-category");
			cat.append(category);
			cat.append(document.createElement("br"));
			var found_emoj = false;
			for(var i=0; i < emoji[category].length; i++){
				var target = emoji[category][i];
				if(pattern.test(target.aliases.concat(target.tags).concat(target.description).join(" "))){
					var emoj = document.createElement("span");
					emoj.setAttribute("class", "emoji");
					emoj.setAttribute("title", target.description);
					emoj.innerHTML = target.emoji;
					cat.append(emoj);
					found_emoj = true;
				}
			}
			if(found_emoj){
				innerPanel.append(cat);
			}
		}
		$(".emoji").click((tar)=>document.getElementById("input").value += tar.target.innerHTML);
	};

	document.getElementById("chat-buttons").prepend(ePanel);
	jPanel = $(ePanel);
	jPanel.css({display: "none"});

	var toggle_button = document.createElement("span");
	toggle_button.setAttribute("id", "emoji-button");
	toggle_button.innerHTML = "😀";
	toggle_button.onclick = ()=>{
		jPanel.css({display:"block"});
		search.focus();
		search.select();
	};
	$(window).click((tar)=>{
		if (!((tar.target.getAttribute("class")||"").match("^emoji") || (tar.target.getAttribute("id")||"").match("^emoji"))){
			jPanel.css({display: "none"});
		}
	});

	document.getElementById("chat-buttons").prepend(toggle_button);
	updateEmoji();
    $("#input").keydown((event)=>{
        if(event.ctrlKey && event.key=="e"){
            event.preventDefault();
            toggle_button.onclick();
        }
    });
    search.onkeyup = (evnt)=>{
        if(evnt.key == "Enter"){
            if(search.value===""){
                jPanel.css({display: "none"});
                $("#input").focus();
                return;
            }
            var emoj = $(".emoji")[0];
            if(emoj){
                emoj.click();
                search.value = "";
                jPanel.css({display: "none"});
                $("#input").focus();
            }
        }else{
            updateEmoji();
        }
    };
})();