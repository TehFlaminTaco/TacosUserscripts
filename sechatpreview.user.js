// ==UserScript==
// @name         Chat Preview
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  Preivew SE chat before posting!
// @author       You
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

    window.taco = window.taco || {installedScripts: []};
    window.taco.installedScripts[window.taco.installedScripts.length] = "chatPreview"
    window.taco.chatPreview = {};
    var chatPreview = window.taco.chatPreview;

    chatPreview.markdownTaco = function(s){
        var wrap_left = "";
        var wrap_right = "";

        if(window.taco.installedScripts.find(x=>x=="caretReply")){
            var replyTo = window.taco.caretReply.getMessage(s);
            if(replyTo){
                replyTo = $(replyTo);
                var usr_name = replyTo.parent().parent().find(".tiny-signature").find(".username").text();
                wrap_left = `<b>${usr_name}</b><br><b style='color:gray;'>${replyTo.text()}</b><br><br>`;
                s = taco.caretReply.getMessageText(s);
                if(s=="*"){
                    s="";
                    wrap_right="<span class='stars vote-count-container'><span class='img vote'></span><span class='times'>+1</span></span>";
                }
            }
        }
        if(s.match(/(gif|png|jpg|jpeg|bmp|svg)$/i)){
            return "<img src="+s+" />";
        }
        return wrap_left + markdownMini(s) + wrap_right;
    }

    $("#main").append(`<div id="chat-preview" style="position:fixed;bottom:80px;margin-bottom:12px;border:solid;border-radius:4px;background:white;padding:4px;display:none"></div>`);
    var stored="";
    var timer = -1;
    setInterval(function(){
        var S = document.getElementById("input").value;
        var chat_prev = document.getElementById("chat-preview");
        if(S!==null && stored!=S){
            if(S.length===0){
                $(chat_prev).css({display: 'none'});
            }else{
                $(chat_prev).css({display: ''});
            }
            if(timer!=-1){
                clearTimeout(timer);
            }
            document.getElementById("chat-preview").innerHTML = "<b style='color:gray'>...</b>";
            stored = S;
            timer=setTimeout(function(){
                timer=-1;
                chat_prev.innerHTML = chatPreview.markdownTaco(S);
            },500);
        }
    },30);
})();