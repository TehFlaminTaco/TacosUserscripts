// ==UserScript==
// @name         Chat Commands
// @namespace    http://tampermonkey.net/
// @version      0.2.9
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
        "o_+o": function(m) {
            return "ಠ"+"_".repeat(m.length-3)+"ಠ";
        },
        disapprove: "ಠ_ಠ",
        like: "(•◡•)/",
        unflip: "┬─┬ ノ( ゜-゜ノ)",
        donger: "༼ つ ◕_◕ ༽つ",
        why: "ლ(ಠ益ಠლ)",
        cool: "(▀̿Ĺ̯▀̿ ̿)",
        lenny: "( ͡° ͜ʖ ͡°)",
        borkalert: "BORK ALERT 🚨 BORK ALERT 🚨 BORK ALERT",
        ["\\$(\\$?)(.+?)\\$"]: function(_, a, s) {
            return "https://a-ta.co/mathjax/"+ encodeURIComponent(a) + "!" + btoa(s) + ".svg";
        },
        [":(.*?):"]: (_, a)=>{
            if(window.emoji){
                for(var category in emoji){
                    for(var i=0; i < emoji[category].length; i++){
                        if(emoji[category][i].description == a || emoji[category][i].aliases.find((x)=>x==a)){
                            return emoji[category][i].emoji;
                        }
                    }
                }
                return _;
            }else{
                return _;
            }
        }
    };

    setInterval(function() {
        for (var code in codes) {
            var x = document.getElementById("input");
            x.value = x.value.replace(new RegExp("/" + code), codes[code]);
        }
    }, 300);
})();
