// ==UserScript==
// @name         Math Quill
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Use MathQuill on Chat.SE
// @author       The Flamin'Taco
// @include *://chat.meta.stackoverflow.com/rooms/*
// @include *://chat.meta.stackexchange.com/rooms/*
// @include *://chat.stackexchange.com/rooms/*
// @include *://chat.stackoverflow.com/rooms/*
// @include *://chat.askubuntu.com/rooms/*
// @include *://chat.serverfault.com/rooms/*
// @updateURL   https://github.com/TehFlaminTaco/TacosUserscripts/raw/master/mathquill.user.js
// @grant        none

// ==/UserScript==

(function() {
    'use strict';

    $("head")[0].append($(`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css">`)[0]);
	var scrp;
	scrp = document.createElement("script");
	scrp.onload = function(){
		var MQ = MathQuill.getInterface(2);
		var buttons = $("#bubble")[0];
		var mathf = $("<span id='mathf'></span>")[0];
		buttons.append(mathf);
		var answerSpan = mathf;
		var answerMathField = MQ.MathField(answerSpan, {
		    handlers: {
		      edit: function() {
		        
		      }
		    }
		});
		var current = 0;
		var setField = function(a){
			current = a;
			if(a){
				$("#input").css({display: "none"});
				$("#mathf").css({display: "block"});
				answerMathField.select();answerMathField.focus();
			}else{
				$("#input").css({display: "block"});
				$("#mathf").css({display: "none"});
				$("#input").select();$("#input").focus();
			}
		}
		console.log(answerMathField);
		mathf.onkeyup = function(e){
			if(e.key == "Escape"){
				setField(0);
				e.preventDefault();
				answerMathField.latex("");
				return;
			}
			if(e.key == "Enter"){
				var out = "https://a-ta.co/mathjax/$%24!"+btoa(answerMathField.latex())+".svg";
				$("#input").val(out);
				$("#sayit-button").click();
				answerMathField.latex("");
				$("#input").select();$("#input").focus();
			}
		}
		$("#input").on("keyup", function(e){
			if($("#input").val()=="/$"){
				$("#input").val("");
				setField(1);
				e.preventDefault();
			}
		});
	}
	$("head")[0].append(scrp);
	$("head")[0].append($(`<style>
		#mathf {
			width:546px;
			height:64px;
			top:0;
			left:0;
			position:relative;
			margin:0px;
			font-size:18px;
			border:1px solid #bdbdbd;
			background-color:#f8ffe3;
			color:#444;
			-moz-box-shadow:0 2px 2px rgba(0,0,0,0.1) inset;
			-webkit-box-shadow:0 2px 2px rgba(0,0,0,0.1) inset;
			box-shadow:0 2px 2px rgba(0,0,0,0.1) inset;
			padding:2px;
			box-sizing:border-box;
			text-align:left;
			display: none;
			overflow-x:auto;
			overflow-y:auto;
		}
	</style>`)[0])
	scrp.setAttribute("src", 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js');
})();
