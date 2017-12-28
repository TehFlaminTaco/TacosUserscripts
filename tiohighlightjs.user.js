// ==UserScript==
// @name         TIO Highlight.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds Highlight.js to TIO.
// @author       Teh Flamin' Taco
// @match        https://tio.run/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var s_pretty = document.createElement("script");
    s_pretty.setAttribute("src","//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js");
    document.body.append(s_pretty);

    var editors = ["header","code","footer"].map(z=>document.getElementById(z));
    var holder = document.getElementById('interpreter');


    for(var i=0; i < editors.length; i++){
        (function(i){
            var e = editors[i];
            var div = document.createElement('div');
            div.setAttribute('class', 'text_area_holder');


            holder.insertBefore(div, e);

            var syntax = document.createElement('pre');
            syntax.setAttribute('class', 'syntax');


            div.append(syntax);
            div.append(e);

            var oldCode = '';

            var update = function(){
                if(e.value != oldCode){
                    syntax.textContent = e.value;
                    syntax.setAttribute('class', 'syntax '+window.languageId);
                    oldCode = e.value;
                    window.hljs.highlightBlock(syntax);
                }
            }

            e.addEventListener("input", update);
            s_pretty.addEventListener("load", update);
        })(i);
    }


    var c_style = document.createElement('style');
    c_style.innerHTML = `#header, #footer, #code{
font-weight:0;
color:rgba(255,255,255,0.3);
}

.syntax{
width:100%;
font-family: 'DejaVu Sans Mono';
height:0;
font-size: 16px;
padding: 0 !important;
float:left;
width: 100%;
margin: 0;
border:0 !important;
pointer-events: none;
z-index: 1000;
position:relative;
display:block;
top:5px;
left:6px;
overflow:unset!important;
}

.syntax span{
  font-weight:normal;
}`;
    var css_pretty = document.createElement('link');
    css_pretty.setAttribute('href', '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/railscasts.min.css');
    css_pretty.setAttribute('rel', 'stylesheet');
    document.body.append(css_pretty);
    document.body.append(c_style);

})();
