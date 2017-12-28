// ==UserScript==
// @name         Funky Syntax Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds Funky's syntax highlighting to TIO.
// @author       Teh Flamin' Taco
// @match        https://tio.run/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', function(){
        if(languageId=='funky'){
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
			  opacity:0;
			}

            tok_operator.colorized, tok_paranexp.colorized{
              color:#FFF;
            }

			.colorized{
			  font-weight: normal;
			  color: #FFF;
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
						if(!visible && document.activeElement != code){
							visible = true;
							pre_syntax.setAttribute('class', '');
							code.setAttribute('class', 'faded');
						}
						if(visible && document.activeElement == code){
							visible = false;
							code.setAttribute('class', '');
							pre_syntax.setAttribute('class', 'hidden');
						}

						if(visible){
							if(code.value != oldCode){
								pre_syntax.innerHTML = colorToken(tokenizer.compile(code.value));
								oldCode = code.value;
							}
						}

					}, 100);



				};
			};
        }
    });
})();