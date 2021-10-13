// ==UserScript==
// @name         Shop-Declutter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Cleans shops to no longer show items you are not interested in
// @author       shiny
// @match        http://moderneopets.com/shop/*
// @match        https://www.moderneopets.com/shop/*
// @icon         https://www.google.com/s2/favicons?domain=moderneopets.com
// @grant        none
// ==/UserScript==

const searchStrings =[
    "Magical",
    "Morphing",
    "Pteri"
]

    var itemList = document.querySelectorAll('.item-image');

    const deletedItems = Array.from(itemList).map(function(x){
        const id = x.getAttribute('data-id');
        const name = x.getAttribute('data-name');
        let found = false;
        searchStrings.forEach( e => name.indexOf(e) > -1 ? found = true : '');

        if (!found){
            document.querySelector(`[data-id='${id}']`).parentNode.style.display = 'none';
            return name;
        }
        return false;
    })

    console.log("Hid " + deletedItems.join(", "));
