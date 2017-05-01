// ==UserScript==
// @name         Team Spirit!
// @namespace    http://tampermonkey.net/
// @version      1.5.7
// @description  Actually hate each other for no reason.
// @author       Teh Flamin' Taco
// @contributor  Mego
// @include *://chat.stackexchange.com/rooms/240/the-nineteenth-byte*
// @run-at document-end
// @grant        none
// @updateURL   https://rawgit.com/TehFlaminTaco/TacosUserscripts/blob/master/teamspirit.user.js
// ==/UserScript==

/* global $ */
(function() {
    'use strict';

    function getHref(jEle) {
        return jEle.attr("href") || getHref(jEle.parent());
    }

    setInterval(function() {

        $(".username").each((a, b) => {
            var jB = $(b);
            if($(b).parent(".user-popup").length) {
                var href = $(b).parent(".user-popup").children("a");
                if (!$(b).find(".stars").length) {
                    jB.prepend(`<span class='stars vote-count-container'><span class='img vote' style='background-image: url(${($(href).attr("href").match(/\/users\/(\d+)/)||["","0"])[1]%2===0 ? 'http://i.imgur.com/6RZ23Ak.png' : 'http://i.imgur.com/6jKoAti.png'}) !important; background-position:0px 0px; background-size:10px 10px !important;'></span></span>`);
                }
            } else {
                if (!jB.find(".stars").length) {
                    jB.prepend(`<span class='stars vote-count-container'><span class='img vote' style='background-image: url(${(getHref(jB).match(/\/users\/(\d+)/)||["","0"])[1]%2===0 ? 'http://i.imgur.com/6RZ23Ak.png' : 'http://i.imgur.com/6jKoAti.png'}) !important; background-position:0px 0px; background-size:10px 10px !important;'></span></span>`);
                }
            }
        });

        $(".votesummary .collapsible").children()
            .each(
            (a,b)=>{
                var links = $(b).find('a');
                var jLink = $(links[links.length-1]);
                if(!jLink.find(".stars").length){
                    jLink.prepend(`<span class='stars vote-count-container'><span class='img vote' style='background-image: url(${links[links.length-1].getAttribute("href").match(/users\/(\d+)/)[1]%2===0 ? 'http://i.imgur.com/6RZ23Ak.png' : 'http://i.imgur.com/6jKoAti.png'}) !important; background-position:0px 0px; background-size:10px 10px !important;'></span></span>`);
                }
            });

        var x = $(".user-container");
        var cRed = 0;
        var cBlue = 0;

        $(".votesummary .collapsible").children()
            .each(
            (a, b) => {
                var votes = $(b).find(".vote-count-container .times").text();
                var links = $(b).find('a');
                if (votes === "")
                    votes = 1;
                if (links[links.length - 1].getAttribute("href").match(/users\/(\d+)/)[1] % 2 === 0)
                    cRed += Number(votes);
                else
                    cBlue += Number(votes);
            }
        );

        var total = cRed + cBlue;

        var redPercent = Math.ceil((cRed / total) * 100);
        var bluPercent = Math.floor((cBlue / total) * 100);
        $("#scoreholder").attr("title", "Red: " + cRed + ", Blue: " + cBlue);
        $("#redscore").css({
            width: `${redPercent}%`
        });
        $("#bluescore").css({
            width: `${bluPercent}%`
        });
    }, 2000);

    $(".chat-input").append('<div id="scoreholder"><div id="redscore" class="scoreholder"></div><div id="bluescore" class="scoreholder"></div></div>');

    $("head").append(`<style>
#scoreholder{
height:3px;
padding:1px;
background-color:#000;
}

#redscore{
background-color:#F00;
width:50%;
}

.scoreholder{
height:3px;
float:left;
transition:all linear 1s;
}

#bluescore{
background-color:#00F;
width:50%;
}
</style>`);

})();
