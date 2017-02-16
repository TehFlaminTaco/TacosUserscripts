// ==UserScript==
// @name         Prettify Chat
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Use Google Prettifier on Stack Exchange's chat's codeblocks.
// @author       Teh Flamin' Taco
// @match        http://chat.stackexchange.com/*
// @match        http://chat.stackoverflow.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Load Google Prettify
    var prettyScript = document.createElement("script");
    prettyScript.setAttribute("src", "https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js");
    document.head.appendChild(prettyScript);

    var extensions = ["/google/code-prettify/blob/master/src/lang-apollo.js",
                    "/google/code-prettify/blob/master/src/lang-basic.js",
                    "/google/code-prettify/blob/master/src/lang-clj.js",
                    "/google/code-prettify/blob/master/src/lang-css.js",
                    "/google/code-prettify/blob/master/src/lang-dart.js",
                    "/google/code-prettify/blob/master/src/lang-erlang.js",
                    "/google/code-prettify/blob/master/src/lang-go.js",
                    "/google/code-prettify/blob/master/src/lang-hs.js",
                    "/google/code-prettify/blob/master/src/lang-lasso.js",
                    "/google/code-prettify/blob/master/src/lang-lisp.js",
                    "/google/code-prettify/blob/master/src/lang-llvm.js",
                    "/google/code-prettify/blob/master/src/lang-logtalk.js",
                    "/google/code-prettify/blob/master/src/lang-lua.js",
                    "/google/code-prettify/blob/master/src/lang-matlab.js",
                    "/google/code-prettify/blob/master/src/lang-ml.js",
                    "/google/code-prettify/blob/master/src/lang-mumps.js",
                    "/google/code-prettify/blob/master/src/lang-n.js",
                    "/google/code-prettify/blob/master/src/lang-pascal.js",
                    "/google/code-prettify/blob/master/src/lang-proto.js",
                    "/google/code-prettify/blob/master/src/lang-r.js",
                    "/google/code-prettify/blob/master/src/lang-rd.js",
                    "/google/code-prettify/blob/master/src/lang-rust.js",
                    "/google/code-prettify/blob/master/src/lang-scala.js",
                    "/google/code-prettify/blob/master/src/lang-sql.js",
                    "/google/code-prettify/blob/master/src/lang-swift.js",
                    "/google/code-prettify/blob/master/src/lang-tcl.js",
                    "/google/code-prettify/blob/master/src/lang-tex.js",
                    "/google/code-prettify/blob/master/src/lang-vb.js",
                    "/google/code-prettify/blob/master/src/lang-vhdl.js",
                    "/google/code-prettify/blob/master/src/lang-wiki.js",
                    "/google/code-prettify/blob/master/src/lang-xq.js",
                    "/google/code-prettify/blob/master/src/lang-yaml.js"];
    
    for (var ext = 0; ext < extensions.length; ext++){
        var prettyScript = document.createElement("script");
        prettyScript.setAttribute("src", extensions[ext]);
        document.head.appendChild(prettyScript);
    }

    // Update all them blocks.
    function updatePretty(){
    	var codeBlocks = $("pre, code");
    	var rePretty = false;
    	for (var block = 0; block < codeBlocks.length; block++){
    		var codeBlock = codeBlocks[block];
    		var curClass = codeBlock.getAttribute('class')||"";
    		if (!curClass.includes("prettyprint")){
    			rePretty = true;
    			var found = $(codeBlock).text().toLowerCase().match("^(lang-.*?):");
    			curClass = curClass + " prettyprint";
    			if(found){
    				curClass = curClass+" "+found[1];
    				codeBlock.innerHTML = codeBlock.innerHTML.replace(/^lang-.*?:/i,"");
    			}

    			codeBlock.setAttribute("class", curClass);
    		}
    	}

    	var expanders = $(".more-data");

    	for (var exp = 0; exp < expanders.length; exp++){
    		var expander = expanders[exp];
    		if (!expander.isBound){
    			expander.isBound = true;
    			$(expander).click(function(){
    				var tied = $(this.parentNode).find("pre")[0];
    				setTimeout(function(){
    					var olClass = tied.getAttribute("class");
    					tied.setAttribute("class",olClass.replace("prettyprinted",""));
    					PR.prettyPrint();
    				},1000);
    			});
    		}
    	}

    	if(rePretty){
    		PR.prettyPrint();
    	}
    }

    setInterval(updatePretty,1000);
})();
