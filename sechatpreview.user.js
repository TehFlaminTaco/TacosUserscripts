// ==UserScript==
// @name         Chat Preview
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Preivew SE chat before posting!
// @author       You
// @match        *://chat.stackexchange.com/rooms/*
// @match        *://chat.stackoverflow.com/rooms/*
// @grant        none
// ==/UserScript==

function markdownTaco(s){
    var wrap_left = "";
    var wrap_right = "";
    if(s.match(/^\^/) && (typeof taco_storedMessages!='undefined')){
        var carets = $("#input").val().match(/^\^+/)[0];
        var message = $(taco_storedMessages[taco_storedMessages.length - carets.length]);
        var user_name = message.parent().parent().find(".tiny-signature").find(".username").text();
        wrap_left = "<b>" + user_name + "</b><br><b style='color:gray'>"+message.text() + "</b><br><br>";
        s = s.replace(/^\^+/, "");
    }
    if(s.match(/(gif|png|jpg|jpeg|bmp)$/i)){
        return "<img src="+s+" />";
    }
    return wrap_left + markdownMini(s) + wrap_right;
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