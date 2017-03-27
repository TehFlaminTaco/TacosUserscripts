// ==UserScript==
// @name         Chat Commands
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add some simple ascii art commands.
// @author       Teh Flamin' Taco
// @match        *://*chat.stackexchange.com/*
// @match        *://*chat.stackoverflow.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    
    var codes={shrug: "¯\\\\_(ツ)_/¯",
               tableflip: "(ノ°Д°）ノ︵ ┻━┻",
               o_o: "ಠ_ಠ",
               disapprove: "ಠ_ಠ",
               like: "(•◡•)/",
               unflip: "┬─┬﻿ ノ( ゜-゜ノ)",
               donger: "༼ つ ◕_◕ ༽つ",
               why: "ლ(ಠ益ಠლ)",
               cool: "(▀̿Ĺ̯▀̿ ̿)",
               lenny: "( ͡° ͜ʖ ͡°)",
               ["\\$(.*?)\\$"]: function(_,s){return "https://latex.codecogs.com/gif.latex?"+encodeURI(s).replace("%7B","{").replace("%7D","}")+"%.gif";}};
    setInterval(function(){
        for (var code in codes){
            var x = document.getElementById("input");
            x.value = x.value.replace("/"+code,codes[code]);
        }
    },300);
})();
