// ==UserScript==
// @name         Strawpoll Onebox
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Create Strawpoll oneboxes.
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
    setInterval(function(){
    var x=$("div:contains('strawpoll.me')");
    for(var i=0; i<x.length; i++){
        var matches = x[i].textContent.match(/^(https?:\/\/)?(www\.)?strawpoll.me\/(\d+)$/gi);
        if(matches){
            console.log(matches);
            x[i].innerHTML = "<center><iframe src=\"https://www.strawpoll.me/embed_1/"+matches[0].match(/\d+/)[0]+"\" style=\"width:700px;height:320px;border:0;\">Loading poll...</iframe></center>";
        }
    }},500);
})();

