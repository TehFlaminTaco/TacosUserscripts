// ==UserScript==
// @name         Chat Commands
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  Add some simple ascii art commands.
// @author       Teh Flamin' Taco
// @include *://chat.meta.stackoverflow.com/rooms/*
// @include *://chat.meta.stackexchange.com/rooms/*
// @include *://chat.stackexchange.com/rooms/*
// @include *://chat.stackoverflow.com/rooms/*
// @include *://chat.askubuntu.com/rooms/*
// @include *://chat.serverfault.com/rooms/*
// @updateURL   https://rawgit.com/TehFlaminTaco/TacosUserscripts/blob/master/chatcommands.user.js
// @run-at document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var codes = {
        shrug: "¯\\\\_(ツ)_/¯",
        tableflip: "(ノ°Д°）ノ︵ ┻━┻",
        o_o: "ಠ_ಠ",
        disapprove: "ಠ_ಠ",
        like: "(•◡•)/",
        unflip: "┬─┬ ノ( ゜-゜ノ)",
        donger: "༼ つ ◕_◕ ༽つ",
        why: "ლ(ಠ益ಠლ)",
        cool: "(▀̿Ĺ̯▀̿ ̿)",
        lenny: "( ͡° ͜ʖ ͡°)",
        ["\\$(\\$?)(.+?)\\$"]: function(_, a, s) {
            return "https://a-ta.co/mathjax/"+ encodeURIComponent(a) + "!" + btoa(s) + ".svg";
        }
    };
    setInterval(function() {
        for (var code in codes) {
            var x = document.getElementById("input");
            x.value = x.value.replace(new RegExp("/" + code), codes[code]);
        }
    }, 300);
})();
