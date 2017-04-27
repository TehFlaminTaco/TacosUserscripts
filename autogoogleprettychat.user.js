// ==UserScript==
// @name         Prettify Chat
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Use Google Prettifier on Stack Exchange's chat's codeblocks.
// @author       Teh Flamin' Taco
// @include *://chat.meta.stackoverflow.com/rooms/*
// @include *://chat.meta.stackexchange.com/rooms/*
// @include *://chat.stackexchange.com/rooms/*
// @include *://chat.stackoverflow.com/rooms/*
// @include *://chat.askubuntu.com/rooms/*
// @include *://chat.serverfault.com/rooms/*
// @run-at document-end
// @grant        none
// ==/UserScript==

/* global $, PR */
(function() {
    'use strict';
    // Load Google Prettify
    var script = document.createElement("script");
    script.setAttribute("src", "https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js");
    document.head.appendChild(script);

    var langs = [
        "apollo", "basic", "clj", "css", "dart", "erlang", "go", "hs", "lasso",
        "lisp", "llvm", "logtalk", "lua", "matlab", "ml", "mumps", "n",
        "pascal", "proto", "r", "rd", "rust", "scala", "sql", "swift", "tcl",
        "tex", "vb", "vhdl", "wiki", "xq", "yaml"
    ];

    for (var i = 0; i < langs.length; i++) {
        script = document.createElement("script");
        script.setAttribute(
            "src",
            "/google/code-prettify/blob/master/src/lang-" + langs[i] + ".js"
        );
        document.head.appendChild(script);
    }

    // Update all them blocks.
    function updatePretty() {
        var codeBlocks = $("pre, code");
        var rePretty = false;
        for (var i = 0; i < codeBlocks.length; i++) {
            var codeBlock = codeBlocks[i];
            var curClass = codeBlock.getAttribute('class') || "";
            if (!curClass.includes("prettyprint")) {
                rePretty = true;
                var found = $(codeBlock).text().toLowerCase().match("^(lang-.*?):");
                curClass = curClass + " prettyprint";
                if (found) {
                    curClass = curClass + " " + found[1];
                    codeBlock.innerHTML = codeBlock.innerHTML.replace(/^lang-.*?:/i, "");
                }

                codeBlock.setAttribute("class", curClass);
            }
        }

        var expanders = $(".more-data");

        for (var i = 0; i < expanders.length; i++) {
            var expander = expanders[i];
            if (!expander.isBound) {
                expander.isBound = true;
                $(expander).click(function() {
                    var tied = $(this.parentNode).find("pre")[0];
                    setTimeout(function() {
                        var olClass = tied.getAttribute("class");
                        tied.setAttribute("class", olClass.replace("prettyprinted", ""));
                        PR.prettyPrint();
                    }, 1000);
                });
            }
        }

        if (rePretty)
            PR.prettyPrint();
    }

    setInterval(updatePretty, 1000);
})();
