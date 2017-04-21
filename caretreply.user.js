// ==UserScript==
// @name         Caret Reply
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Automatically reply to messages by using ^Message
// @author       You
// @match        *://*chat.stackexchange.com/*
// @match        *://*chat.stackoverflow.com/*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    // Your code here...
    window.taco = window.taco || {installedScripts: []};
    window.taco.installedScripts[window.taco.installedScripts.length] = "caretReply"
    window.taco.caretReply = {};
    var caretReply = window.taco.caretReply;
    caretReply.storedMessages = false;
    caretReply.caretRegex = /^(\^\*(\d+)|\^\?(.*?\?+)|(\^+))(.*)/;

    caretReply.indexers = []; // getMessage, which returns a text, uses indexers to find the reply. If match 2 is valid, indexer 0 is used. If 3 is valid, than 1. And so on.

    caretReply.indexers[0] = function(txt){
        return caretReply.storedMessages.length - Number(txt);
    }

    caretReply.indexers[1] = function(txt){
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

        for(var i=caretReply.storedMessages.length-1; i >= 0; i--){
            if(caretReply.storedMessages[i].textContent.toLowerCase().match(newRegex) || $(caretReply.storedMessages[i]).parent().parent().find(".tiny-signature").find(".username").text().toLowerCase().match(newRegex)){
                c_count--;
                if(c_count<=0){
                    return i;
                }
            }
        }
        return 0;
    }

    caretReply.indexers[2] = function(txt){
        return caretReply.storedMessages.length - txt.length;
    }

    caretReply.getMessageText = function(inp){
        var matches = inp.match(caretReply.caretRegex);
        if(matches){
            return matches[matches.length-1];
        }
        return inp;
    }

    caretReply.getMessage = function(inp){
        var matches = inp.match(caretReply.caretRegex);
        if(matches){
            for(var c=2; c<matches.length-1; c++){
                if(matches[c]){
                    return caretReply.storedMessages[caretReply.indexers[c-2](matches[c])];
                }
            }
        }
        return false;
    }

    $.fn.extend({
        bindAs: function (nth, type, data, fn) {
            if (type.indexOf(' ') > -1) {
                var s = type.split(' ');

                for (var i = 0; i < s.length; ++i) {
                    this.bindAs(nth, s[i], data, fn);
                }

                return this;
            }

            if ($.isFunction(data) || data === false) {
                fn = data;
                data = undefined;
            }

            if (nth < 0) {
                nth = 0;
            }

            for (var i = 0; i < this.length; ++i) {
                var elem = this[i];

                $.event.add(elem, type, fn, data);

                var events = $(elem).data(elem.nodeType ? 'events' : '__events__');

                if (events && typeof events === 'function') {
                    events = events.events;
                }

                if (events) {
                    var handlers = events[type],
                        offset = 0;
                        
                    if (handlers.delegateCount) {
                        offset = handlers.delegateCount;
                    }

                    if (handlers && handlers.length > offset + nth + 1) {
                        handlers.splice(offset + nth, 0, handlers.splice(handlers.length - 1, 1)[0]);
                    }
                }
            }

            return this;
        }
    });

    var input = $("#input");

    input.keyup(function(event){
        if(input.val().match(/^$/)){
            caretReply.storedMessages = false;
        }else if(!caretReply.storedMessages){
            caretReply.storedMessages = $("[id^=message]");
        }
    });

    input.bindAs(0,'keydown',function(event){
        if(event.which==13){
            var text = input.val();
            var msg = caretReply.getMessage(text);
            if(!msg){
                return;
            }

            input.val(msg.getAttribute("id").replace(/message-/, ":") + caretReply.getMessageText(text));
            /*
            var text = input.val().replace(/^\^\*(\d+)/, function(a,b){return ("^").repeat(Number(b));});
            var carets = text.match(/^\^+/);
            if(!carets){
                return;
            }
            var carets = carets[0];

            input.val(text.replace(/^\^+/,":"+taco_storedMessages[taco_storedMessages.length - carets.length].getAttribute("id").replace(/message-/,"")+" "));
            */
        }
    });
})();