// ==UserScript==
// @name         Funky Syntax Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds Funky's syntax highlighting to TIO.
// @author       Teh Flamin' Taco
// @match        https://tio.run/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var repeater;
    repeater = setInterval(function(){
    	if(window.languageId == undefined){
    		return;
    	}
    	clearInterval(repeater);
    	repeater = undefined;
    	if(window.languageId=='funky'){
	        window.module = {};
			var s_tokens = document.createElement('script');
			s_tokens.setAttribute('src', 'https://a-ta.co/funky/funky/tokens.js');
			document.body.append(s_tokens);

			var style_tokens = document.createElement('link');
			style_tokens.setAttribute('href', 'https://a-ta.co/funky/style/tokens.css');
			style_tokens.setAttribute('rel', 'stylesheet');
			document.body.append(style_tokens);

			var style_custom = document.createElement('style');
			style_custom.innerHTML = `#syntax{
			  width:100%;
			  font-family: 'DejaVu Sans Mono';
			  height:0;
				font-size: 16px;
				padding-top: 5px;
			  padding-left: 6px;
			  float:left;
				width: 100%;
			  margin: 0;
			  margin-bottom: -5px;
			  overflow:visible;
			  white-space: pre-wrap;       /* Since CSS 2.1 */
	    	  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
	    	  white-space: -pre-wrap;      /* Opera 4-6 */
	    	  white-space: -o-pre-wrap;    /* Opera 7 */
	    	  word-wrap: break-word;       /* Internet Explorer 5.5+ */
			}

			#code_holder{
			  border: none;
				background: #202020;
				box-sizing: border-box;
				color: #C0C0C0;
				font-size: 16px;
				outline: none;
				overflow: hidden;
				resize: none;
				width: 100%;
			}

			.faded{
			  opacity:0.3;
			}

	        tok_operator.colorized, tok_paranexp.colorized{
	          color:#FFF;
	        }

	        tok_comment.colorized{
	          color:#888;
	        }

			.colorized{
			  font-weight: normal;
			  color: #FFF;
			  overflow:visible;
			  white-space: pre-wrap;       /* Since CSS 2.1 */
	    	  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
	    	  white-space: -pre-wrap;      /* Opera 4-6 */
	    	  white-space: -o-pre-wrap;    /* Opera 7 */
	    	  word-wrap: break-word;       /* Internet Explorer 5.5+ */
			}`;

			document.body.append(style_custom);

			var pre_syntax = document.createElement('pre');
			pre_syntax.setAttribute('id', 'syntax');

			var code_holder = document.createElement('div');
			code_holder.setAttribute('id','code_holder');
			var code = document.getElementById('code');
			document.getElementById('interpreter').insertBefore(code_holder, code);
			code_holder.append(pre_syntax);
			code_holder.append(document.getElementById('code'));


			function doShow(){
				return code.value.length < 300 || document.activeElement == code
			}

			s_tokens.onload = function(){
				var t_tokens = window.module.exports;
				var fake_files = {};

				fake_files.fs = ()=>{return {writeFile: ()=>{}};};
				fake_files["./tokens.js"] = ()=>t_tokens;

				window.require = function(file_name){
					return fake_files[file_name]();
				};

				var s_tokenizer = document.createElement('script');
				s_tokenizer.setAttribute('src', 'https://a-ta.co/funky/funky/tokenizer.js');
				document.body.append(s_tokenizer);

				s_tokenizer.onload = function(){
					var tokenizer = window.module.exports;
					var lamb = document.createElement("lamb");
					var escapeHTML = function(text){
						lamb.textContent = text;
						return lamb.innerHTML;
					};

					function colorToken(token){
						var txt = token.text;
						var outp = ['<tok_'+token.name+' class="colorized">'];
						for (var i=0; i < token.data.length; i++){
							for(var c=0; c < token.data[i].items.length; c++){
								var t = token.data[i].items[c];
								if(typeof(t)=="string"){
									var starts = txt.indexOf(t);
									outp.push('<tok_comment class="colorized">'+escapeHTML(txt.substring(0,starts))+'</tok_comment>');
									outp.push(escapeHTML(t));
									txt = txt.substring(starts + t.length);
									continue;
								}
								var startp = txt.indexOf(t.text);
								var endp = startp + t.text.length;
								var res = colorToken(t);
								outp.push('<tok_comment class="colorized">'+escapeHTML(txt.substring(0,startp))+'</tok_comment>');
								outp.push(res);
								txt = txt.substring(endp,txt.length);
							}
						}
						outp.push('<tok_comment class="colorized">'+escapeHTML(txt)+'</tok_comment>');
						outp.push('</tok_'+token.name+'>');
						return outp.join("");
					}
					var oldCode = '';
					var visible = false;
					setInterval(function(){
						if(!visible && doShow()){
							visible = true;
							pre_syntax.setAttribute('class', '');
							code.setAttribute('class', 'faded');
						}
						if(visible && !doShow()){
							visible = false;
							code.setAttribute('class', '');
							pre_syntax.setAttribute('class', 'hidden');
						}

						if(visible){
							if(code.value != oldCode){
								var tokens = tokenizer.compile(code.value);
								pre_syntax.innerHTML = colorToken(tokens);
								oldCode = code.value;
							}
						}

					}, 100);



				};
			};
    	}else{
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
		font-family: 'DejaVu Sans Mono';
		font-size: 16px;
		padding: 0 !important;
		float:left;
		width: calc(100% - 12px);
		height:0;
		margin: 0;
		border:0 !important;
		pointer-events: none;
		position:relative;
		display:block;
		top:5px;
		left:6px;
		overflow:visible;
	  	white-space: pre-wrap;       /* Since CSS 2.1 */
	  	white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
	  	white-space: -pre-wrap;      /* Opera 4-6 */
	  	white-space: -o-pre-wrap;    /* Opera 7 */
	  	word-wrap: break-word;       /* Internet Explorer 5.5+ */
		}

		.syntax span{
		  font-weight:normal;
		}`;
		    var css_pretty = document.createElement('link');
		    css_pretty.setAttribute('href', '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/railscasts.min.css');
		    css_pretty.setAttribute('rel', 'stylesheet');
		    document.body.append(css_pretty);
		    document.body.append(c_style);
    	}
	}, 100);
})();
