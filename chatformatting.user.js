// ==UserScript==
// @name         Chat Formatting
// @namespace    http://tampermonkey.net/
// @version      0.1
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
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function toggle_formatting(str){
        var inp = document.getElementById('input');
        var start = inp.selectionStart;
        var end = inp.selectionEnd;
        if(start == end){
            inp.value = input.value.substring(0, start) + str + input.value.substring(start);
            inp.selectionStart = start + str.length;
            inp.selectionEnd = start + str.length;
            return;
        }
        var first_chunk = input.value.substring(0,start);
        var middle = input.value.substring(start,end);
        var end_chunk = input.value.substring(end);

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

    function add_bracket(left, right){
        var inp = document.getElementById('input');
        var start = inp.selectionStart;
        var end = inp.selectionEnd;
        if(start == end){
            inp.value = input.value.substring(0, start) + left + input.value.substring(start);
            inp.selectionStart = start + left.length;
            inp.selectionEnd = start + left.length;
            return;
        }

        var first_chunk = input.value.substring(0,start);
        var middle = input.value.substring(start,end);
        var end_chunk = input.value.substring(end);

        middle = left + middle + right;

        inp.value = first_chunk + middle + end_chunk;
        inp.selectionStart = first_chunk.length;
        inp.selectionEnd = first_chunk.length + middle.length;
    }

    $("#input").keydown(function(event){
        if(event.ctrlKey){
            switch(event.key){
                case 'b':
                    event.preventDefault();
                    toggle_formatting('**');
                    break;
                case 'i':
                    event.preventDefault();
                    toggle_formatting('_');
                    break;
                case '`':
                    event.preventDefault();
                    toggle_formatting('`');
                    break;
                case 'l':
                    event.preventDefault();
                    toggle_formatting('$');
                    break;
                case 'L':
                    event.preventDefault();
                    toggle_formatting('$$');
                    break;
                default:
                    break;
            }
        }else{
            switch(event.key){
                case '(':
                    event.preventDefault();
                    add_bracket('(', ')');
                    break;
                case '{':
                    event.preventDefault();
                    add_bracket('{', '}');
                    break;
                case '[':
                    event.preventDefault();
                    add_bracket('[', ']');
                    break;
                case '<':
                    event.preventDefault();
                    add_bracket('<', '>');
                    break;
                case '\'':
                    event.preventDefault();
                    add_bracket('\'', '\'');
                    break;
                case '"':
                    event.preventDefault();
                    add_bracket('"', '"');
                    break;
                default:
                    break;
            }
        }
    });
})();