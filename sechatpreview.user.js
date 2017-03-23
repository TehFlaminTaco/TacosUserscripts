// ==UserScript==
// @name         Chat Preview
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://chat.stackexchange.com/rooms/*
// @match        *://chat.stackoverflow.com/rooms/*
// @grant        none
// ==/UserScript==

function markdownTaco(s){
    if(s.match(/(gif|png|jpg|jpeg|bmp)$/i)){
        return "<img src="+s+" />";
    }
    return markdownMini(s);
}


(function() {
    'use strict';

    // Your code here...

    $("#main").append(`<div id="chat-preview" style="position:fixed;bottom:80px;margin-bottom:12px;border:solid;border-radius:4px;background:white;padding:4px;"></div>`);
    var stored="";
    var timer = -1;
    setInterval(function(){
        var S = document.getElementById("input").value;
        var chat_prev = document.getElementById("chat-preview");
        if(S!==null && stored!=S){
            if(timer!=-1){
                clearTimeout(timer);
            }
            document.getElementById("chat-preview").innerHTML = "<b style='color:gray'>...</b>";
            stored = S;
            timer=setTimeout(function(){
                timer=-1;
                chat_prev.innerHTML = markdownTaco(S);
            },500);
        }
    },30);
})();