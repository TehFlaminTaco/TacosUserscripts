// ==UserScript==
// @name         French Accented Characters
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  To allow typing of french characters.
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
	var combos = {
		// L'accent aigu
		"e/" : "é",
		// L'accent grave
		"a`" : "à",
		"e`" : "è",
		"u`" : "ù",
		// L'accent circonflexe
		"a\\^" : "â",
		"e\\^" : "ê",
		"i\\^" : "î",
		"o\\^" : "ô",
		"u\\^" : "û",
		// La cédille
		"c5" : "ç",
		// Le tréma
		'e"' : "ë",
		'i"' : "ï",
		'u"' : "ü",
		// Qoutes
		"<<" : "«",
		">>" : "»"
	};

	setInterval(function(){
		var inp = $("#input");
		for(var code in combos){
			var cd = `(${code[0]})(${code.substr(1)})`;
			inp.val(inp.val().replace(
					RegExp(
							"\\\\" + cd,
							"i"
						),
					(_,a,b)=> a + String.fromCharCode(0x200D) + b
				));
		}
		for(var code in combos){
			var cd = `(${code[0]})(${code.substr(1)})`;
			inp.val(inp.val().replace(
					RegExp(
							cd,
							"i"
						),
					(_,a,b) => a==a.toUpperCase() ? combos[code].toUpperCase() : combos[code]
				));
		}
	}, 100);
})();
