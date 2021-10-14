// ==UserScript==
// @name         TE chooser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Max out gains :) stops playing when it is no longer productive.
// @author       shiny
// @match        http://moderneopets.com/games/tyranuevavu
// @icon         https://www.google.com/s2/favicons?domain=moderneopets.com
// @grant        none
// ==/UserScript==

setTimeout(() => { pickOption() }, Math.random() * 1000 + 150);

function pickOption(){
    var cards = document.querySelectorAll('.cards img');
    if (cards.length > 0){
        const val = cards[0].getAttribute('alt').replace(/\D/g,'');
        let pick = "Tyranu"
        if (val > 6){
            pick = "Evavu";
        }
        const option = document.querySelectorAll(`.option input[name="submit"][value="${pick}"`);
        if (option.length > 0){
            option[0].click();
        } else {
            document.querySelectorAll('button[name="button"]')[0].click();
        }
    } else {
        const els = document.querySelectorAll('.text-center b');
        const np = els[els.length-1].textContent.replace(/\D/g,'');
        if (np > 0) document.querySelectorAll('.play-button input[name="submit"]')[0].click();
    }
}

