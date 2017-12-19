// ==UserScript==
// @name         TIO CMC Answer Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a CMC Answer button to TIO's quick links page.
// @author       Teh Flamin' Taco
// @match        https://tio.run/*
// @grant        none
// ==/UserScript==


(function(){
	addEventListener("load",function() {
		'use strict';

		// Just build our new stuff...
		var header = document.createElement("h3");
		header.innerHTML = "CMC Answer";

		var copyEntry = document.createElement("div");
		copyEntry.setAttribute("class", "copy-entry");
		copyEntry.innerHTML = `<div class="copy-content">
		<textarea data-base-height="48" spellcheck="false" autocapitalize="none" autocorrect="off" style="height: 48px;" data-format="[{{lang}}]({{link}}), {{bytes}} [{{codeOrTio}}]({{permalink}})"></textarea>
		</div><label for="toggle-permalink"><span id="cmc-copy" class="copy-button" data-hotkey="C"></span></label>`;


		$("#permalink-drawer .main-body").append(header);
		$("#permalink-drawer .main-body").append(copyEntry);

	    // Hooks over the boot function and calls it manually.
	    var oldBoot = boot;
	    boot = function(){
	    	oldBoot();
			$("#permalink").onclick = function() {
				var code = $("#code").value;
				var language = languages[languageId];
				saveState(true);
				var data = {
					"bytes": pluralization(countBytes(code, language.encoding), "byte"),
					"markdownCode": codeToMarkdown(code),
					"prettifyHint": language.prettify ? "<!-- language-all: lang-" + language.prettify + " -->\n\n" : "",
					"lang": language.name,
					"link": language.link,
					"n": "\n",
					"nn": "\n\n",
					"permalink": location.href,
					"timestamp": Date.now().toString(36),
					"codeOrTio": code.match(/\n/)||code.length==0?"Try It Online!":'`'+code.replace(/(`|\\$)/g, s=>`\\${s}`)+'`'
				};
				var textAreas = $$("#permalink-drawer textarea");
				for (var i = 0; i < textAreas.length; i++) {
					var textArea = textAreas[i];
					textArea.style.height = textArea.dataset.baseHeight + "px";
					textArea.value = textArea.dataset.format.replace(/\{\{(\w*)\}\}/g, function(_, match) {
						return data[match];
					});
				}
			};
		};
	});
})();