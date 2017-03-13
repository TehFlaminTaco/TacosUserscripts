// ==UserScript==
// @name         Chat Commands
// @namespace    http://tampermonkey.net/
// @version      0.1
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
               ["\\$(.*?)\\$"]: function(_,s){return "https://latex.codecogs.com/gif.latex?"+encodeURI(s).replace("%7B","{").replace("%7D","}")+"%.gif";}};
    setInterval(function(){
        for (var code in codes){
            var x = document.getElementById("input");
            if(x.value.match("^/"+code+"$")){
                if(typeof codes[code] == "function"){
                    x.value = codes[code].apply(null,x.value.match("^/"+code+"$"));
                }else{
                    x.value = codes[code];
                }
            }
        }
    },300);
})();
