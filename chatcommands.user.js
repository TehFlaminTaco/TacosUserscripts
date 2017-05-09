// ==UserScript==
// @name         Chat Commands
// @namespace    http://tampermonkey.net/
// @version      0.2.6
// @description  Add some simple ascii art commands.
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
        ["\\$$(.+?)\\$"]: function(_, s) {
            return "https://a-ta.co/mathjax/$$!" + btoa(s) + ".svg";
        },
        ["\\$(.+?)\\$"]: function(_, s) {
            return "https://a-ta.co/mathjax/$!" + btoa(s) + ".svg";
        }
    };
    setInterval(function() {
        for (var code in codes) {
            var x = document.getElementById("input");
            x.value = x.value.replace(new RegExp("/" + code), codes[code]);
        }
    }, 300);
})();
