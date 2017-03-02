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
               o_o: "ಠ_ಠ"};
    setInterval(function(){
        for (var code in codes){
            var x = document.getElementById("input");
            if(x.value === ("/"+code)){
                x.value = codes[code];
            }
        }
    },300);
})();