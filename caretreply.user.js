// ==UserScript==
// @name         Caret Reply
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Automatically reply to messages by using ^Message
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

/* global $ */
(function() {
    'use strict';
    var taco = window.taco = window.taco || {
        installedScripts: []
    };
    taco.installedScripts.push("caretReply");
    var caretReply = taco.caretReply = {};
    caretReply.storedMessages = false;
    caretReply.caretRegex = /^(\^\*(\d+)|\^\?(.*?\?+)|(\^+))(.*)/;

    caretReply.indexers = []; // getMessage, which returns a text, uses indexers to find the reply. If match 2 is valid, indexer 0 is used. If 3 is valid, than 1. And so on.

    caretReply.indexers[0] = function(txt) {
        return caretReply.storedMessages.length - Number(txt);
    };

    caretReply.indexers[1] = function(txt) {
        // I stole this from Stack Overflow.
        // Thanks Bobince.
        // http://stackoverflow.com/a/3561711/7170955
        txt = txt.match(/(.*?)(\?+)/);
        var newRegex = txt[1].toLowerCase()
            .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            .split(/\\\*/)
            .join(".*");

        var c_count = txt[2].length;
        var i = 0;

        for (var i = caretReply.storedMessages.length - 1; i >= 0; i--) {
            if (caretReply.storedMessages[i].textContent.toLowerCase().match(newRegex) || $(caretReply.storedMessages[i]).parent().parent().find(".tiny-signature").find(".username").text().toLowerCase().match(newRegex)) {
                c_count--;
                if (c_count <= 0)
                    return i;
            }
        }
        return 0;
    };

    caretReply.indexers[2] = function(txt) {
        return caretReply.storedMessages.length - txt.length;
    };

    caretReply.getMessageText = function(inp) {
        var matches = inp.match(caretReply.caretRegex);
        if (matches) {
            return matches[matches.length - 1];
        }
        return inp;
    };

    caretReply.getMessage = function(inp) {
        var matches = inp.match(caretReply.caretRegex);
        if (matches)
            for (var c = 2; c < matches.length - 1; c++)
                if (matches[c])
                    return caretReply.storedMessages[caretReply.indexers[c - 2](matches[c])];
        return false;
    };

    // You cannot even believe how difficult it was for me to find out how this works.
    var nullFnc = ()=>{};
    caretReply.setMessageText = function(id, text){
        $.ajax({'type' : 'POST',
        'url' : `/messages/${id}`,
        'data' : fkey({'text' : text}),
        'success': nullFnc,
        'dataType' : 'json',
        'error' : nullFnc})
    }

    caretReply.sedMatch = function(text){
        text = text.split("");
        if(text[0]!="s")
            return false;
        text.splice(0,1);
        var key = text.splice(0,1)[0];
        if(!key || !key.match(/[^a-zA-Z0-9 \\]/))
            return false;
        var matchID = -1;
        for (matchID = 0; matchID < text.length; matchID++){
            var s = text[matchID];
            if(s == "\\"){ // If escape, skip the next character. 
                matchID++;
                continue;
            }
            if(s == key){ // We have found it! The legendary MatchEnd!
                break;
            }
        }
        var match = text.splice(0, matchID).join("");
        if(!match || matchID == text.length)
            return;
        text.splice(0,1);
        var replaceID = -1;
        for (replaceID = 0; replaceID < text.length; replaceID++){
            var s = text[replaceID];
            if(s == "\\"){ // If escape, skip the next character. 
                replaceID++;
                continue;
            }
            if(s == key){ // Having a replacement is actually optional here.
                break;
            }
        }
        var hasFlags = replaceID < text.length;
        var replace = text.splice(0, replaceID).join("");
        if(!replace)
            return false;
        if(hasFlags){
            text.splice(0,1);
            return [match, replace, text.join("")]
        }
        return [match, replace, "gmi"];
    }

    $.fn.extend({
        bindAs: function(nth, type, data, fn) {
            if (type.indexOf(' ') > -1) {
                var s = type.split(' ');

                for (var i = 0; i < s.length; ++i)
                    this.bindAs(nth, s[i], data, fn);

                return this;
            }

            if ($.isFunction(data) || data === false) {
                fn = data;
                data = undefined;
            }

            if (nth < 0)
                nth = 0;

            for (var i = 0; i < this.length; ++i) {
                var elem = this[i];

                $.event.add(elem, type, fn, data);

                var events = $(elem).data(elem.nodeType ? 'events' : '__events__');

                if (events && typeof events === 'function')
                    events = events.events;

                if (events) {
                    var handlers = events[type],
                        offset = 0;

                    if (handlers.delegateCount)
                        offset = handlers.delegateCount;

                    if (handlers && handlers.length > offset + nth + 1)
                        handlers.splice(offset + nth, 0, handlers.splice(handlers.length - 1, 1)[0]);
                }
            }

            return this;
        }
    });

    var input = $("#input");

    input.keyup(function(event) {
        if (input.val().match(/^$/))
            caretReply.storedMessages = false;
        else if (!caretReply.storedMessages)
            caretReply.storedMessages = $("[id^=message]");
    });

    //input.bindAs(0, 'keydown', function(event) {
    var onKey = function(event){
        if (event.which == 13) {
            var text = input.val();
            var olMessage = caretReply.getMessage(text);
            if(!olMessage)
                return;
            var msgId = olMessage.getAttribute("id").replace(/message-/, "");
            var msg = $("#message-"+msgId)[0];
            if (!msg)
                return;
            if (caretReply.getMessageText(text) == "*") {
                $(msg).find(".meta").find(".stars").find(".img.vote").click();
                input.val("");
                return;
            }
            var txt = caretReply.getMessageText(text);
            // Custom function because JS Regex is evil and can't escape to save itself.
            var notSed = caretReply.sedMatch(txt);
            if (notSed){
                $.get("/message/" + msgId + "?plain=true", function(e) {
                    caretReply.setMessageText(msgId, e.replace(new RegExp(notSed[0], notSed[2]), notSed[1]));
                });
                input.val("");
                return;
            }
            input.val(":" + msgId + " " + txt);
        }
    };

    input.bind("keydown", onKey);
    var inpEvents = $._data(input[0],'events').keydown
    //var evnt = inpEvents.splice(-1,1)[0]
    //$._data(input[0],'events').keydown = [evnt].concat(inpEvents);
    inpEvents.unshift(inpEvents.pop());
})();
