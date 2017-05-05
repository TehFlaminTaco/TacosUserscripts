// ==UserScript==
// @name         Chat Formatting
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Had hotkeys like Ctrl-b, Ctrl-i, and things to chat.
// @author       The Flamin' Taco
// @include *://chat.meta.stackoverflow.com/rooms/*
// @include *://chat.meta.stackexchange.com/rooms/*
// @include *://chat.stackexchange.com/rooms/*
// @include *://chat.stackoverflow.com/rooms/*
// @include *://chat.askubuntu.com/rooms/*
// @include *://chat.serverfault.com/rooms/*
// @run-at document-end
// @grant        none
// @updateURL    https://github.com/TehFlaminTaco/TacosUserscripts/raw/master/chatformatting.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function toggle_formatting(event, tar, str){
        if(event.key!=tar)
            return;
        event.preventDefault();

        var inp = document.getElementById('input');
        var start = inp.selectionStart;
        var end = inp.selectionEnd;
        if(start == end){
            if(inp.value.substr(start, str.length) == str){
                inp.selectionStart = start + str.length;
                inp.selectionEnd = end + str.length;
                return;
            }

            inp.value = inp.value.substring(0, start) + str + inp.value.substring(start) + (inp.value.substr(-str.length)!=str ? str : "");
            inp.selectionStart = start + str.length;
            inp.selectionEnd = end + str.length;
            return;
        }
        var first_chunk = inp.value.substring(0,start);
        var middle = inp.value.substring(start,end);
        var end_chunk = inp.value.substring(end);

        var mid_left = middle.substr(0,str.length);
        var mid_right = middle.substr(-str.length);

        if(mid_left == str && mid_right == str){
            middle = middle.substr(str.length, middle.length - (str.length * 2));
            inp.value = first_chunk + middle + end_chunk;
            inp.selectionStart = first_chunk.length;
            inp.selectionEnd = first_chunk.length + middle.length;
            return;
        }

        middle = str + middle + str;

        inp.value = first_chunk + middle + end_chunk;
        inp.selectionStart = first_chunk.length;
        inp.selectionEnd = first_chunk.length + middle.length;
    }

    function add_bracket(event, left, right){
        var inp = document.getElementById('input');
        var start = inp.selectionStart;
        var end = inp.selectionEnd;

        if(event.key==right && start==end){
            if(inp.value.substr(start, right.length) == right){
                event.preventDefault();

                inp.selectionStart = start + right.length;
                inp.selectionEnd = end + right.length;
            }
            if(right != left)
                return;
        }
        if(event.key!=left)
            return;

        if(start == end){
            event.preventDefault();
            if(inp.value.substr(start, left.length) == left){
                inp.selectionStart = start + left.length;
                inp.selectionEnd = end + left.length;
            }else{
                inp.value = inp.value.substring(0, start) + left  + (start==inp.value.length || inp.value.substr(-right.length)!=right ? right : "") + inp.value.substring(start);
                inp.selectionStart = start + left.length;
                inp.selectionEnd = start + left.length;
            }
            return;
        }

        event.preventDefault();

        var first_chunk = inp.value.substring(0,start);
        var middle = inp.value.substring(start,end);
        var end_chunk = inp.value.substring(end);

        middle = left + middle + right;

        inp.value = first_chunk + middle + end_chunk;
        inp.selectionStart = first_chunk.length;
        inp.selectionEnd = first_chunk.length + middle.length;
    }

    $("#input").keydown(function(event){
        if(event.ctrlKey){
            toggle_formatting(event, 'b', '**');
            toggle_formatting(event, 'i', '_');
            toggle_formatting(event, '`', '`');
            toggle_formatting(event, 'l', '$');
            toggle_formatting(event, 'L', '$$');
        }else{
            add_bracket(event, '(', ')');
            add_bracket(event, '{', '}');
            add_bracket(event, '[', ']');
            add_bracket(event, '<', '>');
            add_bracket(event, '"', '"');
        }
    });
})();