// ==UserScript==
// @name         Caret Reply
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automatically reply to messages by using ^Message
// @author       You
// @match        *://*chat.stackexchange.com/*
// @match        *://*chat.stackoverflow.com/*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    // Your code here...
    window.taco_storedMessages = false;
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
			taco_storedMessages = false;
		}else if(!taco_storedMessages){
			taco_storedMessages = $("[id^=message]");
		}
		if(input.val().match(/^\^/)){
			var carets = input.val().match(/^\^+/)[0];
		}
	});

	input.bindAs(0,'keydown',function(event){
		if(event.which==13){
			var text = input.val().replace(/^\^\*(\d+)/, function(a,b){return ("^").repeat(Number(b))});
			var carets = text.match(/^\^+/);
			if(!carets){
				return;
			}
			var carets = carets[0];

			input.val(text.replace(/^\^+/,":"+taco_storedMessages[taco_storedMessages.length - carets.length].getAttribute("id").replace(/message-/,"")+" "));
		}
	});
})();