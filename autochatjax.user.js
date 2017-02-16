// ==UserScript==
// @name         Auto ChatJax
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically launch Chatjax for Stack Exchange chats.
// @author       Teh Flamin' Taco
// @match        http://chat.stackexchange.com/*
// @match        http://chat.stackoverflow.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
    // Your code here...
    if(window.MathJax===undefined){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML";
        var config = 'MathJax.Hub.Config({' + 'extensions: ["tex2jax.js"],' + 'tex2jax: { inlineMath: [["$","$"],["\\\\\\\\\\\\(","\\\\\\\\\\\\)"]], displayMath: [["$$","$$"],["\\\\[","\\\\]"]], processEscapes: true },' + 'jax: ["input/TeX","output/HTML-CSS"]' + '});' + 'MathJax.Hub.Startup.onload();';
        if (window.opera) {script.innerHTML = config;}
        else {script.text = config;}
        document.getElementsByTagName("head")[0].appendChild(script);
        window.setInterval(function(){MathJax.Hub.Queue(["Typeset",MathJax.Hub]);},1000);
    }else{
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }},1000);
})();

