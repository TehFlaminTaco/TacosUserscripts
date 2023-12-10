// ==UserScript==
// @name         Spoilers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include *://chat.meta.stackoverflow.com/rooms/*
// @include *://chat.meta.stackexchange.com/rooms/*
// @include *://chat.stackexchange.com/rooms/*
// @include *://chat.stackoverflow.com/rooms/*
// @include *://chat.askubuntu.com/rooms/*
// @include *://chat.serverfault.com/rooms/*
// @updateURL   https://rawgit.com/TehFlaminTaco/TacosUserscripts/blob/master/spoilers.user.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let $ = window.$;
    // Your code here...
    document.head.append($(`
<style>
    spoiler {
        border: solid 1px lightgray;
        box-shadow: inset 1px 1px 2px rgb(0 0 0 / 20%);
        border-radius: 4px;
        padding-left: 4px;
        padding-right: 4px;
        color: automatic;
        background-color: transparent;
        transition: all 0.5s;
    }
    spoiler.disguised {
        color:darkgray;
        background-color:darkgray;
    }
</style>
`)[0])
    setInterval(function(){
        let spoilers = $("a[title]").filter((c,e)=>e.textContent.toLowerCase()=='spoiler');
        spoilers.each((i,e)=>{
            let spoiler = e.href == 'https://www.github.com/TehFlaminTaco/TacosUserscripts' ? $(`<spoiler class='disguised'>${e.title}</spoiler>`) : $(`<spoiler class='disguised'>${e.title}<a href="${e.href}">🔗</a></spoiler>`)
            spoiler.click(()=>spoiler.removeClass('disguised'))
            e.replaceWith(spoiler[0])
        })
    }, 300);

})();
