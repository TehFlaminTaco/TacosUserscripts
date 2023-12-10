// ==UserScript==
// @name         Chat Commands
// @namespace    http://tampermonkey.net/
// @version      0.4.0
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
        "o(_+)o": "ಠ$1ಠ",
        disapprove: "ಠ_ಠ",
        like: "(•◡•)/",
        unflip: "┬─┬ ノ( ゜-゜ノ)",
        donger: "༼ つ ◕_◕ ༽つ",
        why: "ლ(ಠ益ಠლ)",
        cool: "(▀̿Ĺ̯▀̿ ̿)",
        lenny: "( ͡° ͜ʖ ͡°)",
        borkalert: "BORK ALERT 🚨 BORK ALERT 🚨 BORK ALERT",
        ["\\$(\\$?)(.+?)\\$\\1"]: function(_, a, s) {
            return "https://a-ta.co/mathjax/"+ encodeURIComponent(a) + "!" + btoa(s) + ".svg";
        },
        [":(.*?):"]: (_, a)=>{
            if(window.emoji){
                for(var category in window.emoji){
                    for(var i=0; i < window.emoji[category].length; i++){
                        if(window.emoji[category][i].description == a || window.emoji[category][i].aliases.find((x)=>x==a)){
                            return window.emoji[category][i].emoji;
                        }
                    }
                }
                return _;
            }else{
                return _;
            }
        },
        ["\\|([^\"]+?)\\|"]: function(_, a, s){
            return `[spoiler](https://www.github.com/TehFlaminTaco/TacosUserscripts "${a}")`
        }
    };

    setInterval(function() {
        for (let code in codes) {
            let x = document.getElementById("input");
            x.value = x.value.replace(new RegExp("(?:\\s|^)/" + code), function(m){
                var s = m.match(/^(\s*)\/(.*)/)
                return s[1]+s[2].replace(new RegExp(code),codes[code])
            });
        }
    }, 300);
})();
