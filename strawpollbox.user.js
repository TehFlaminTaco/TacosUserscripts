// ==UserScript==
// @name         Strawpoll Onebox
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Create Strawpoll oneboxes.
// @author       Teh Flamin' Taco
// @match        *://*chat.stackexchange.com/*
// @match        *://*chat.stackoverflow.com/*
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
            x[i].innerHTML = "<iframe src=\"https://www.strawpoll.me/embed_1/"+matches[0].match(/\d+/)[0]+"\" style=\"width:100%;height:280px;border:0;\">Loading poll...</iframe>";
        }
    }},500);
})();

