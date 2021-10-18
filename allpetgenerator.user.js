// ==UserScript==
// @name         allpet generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  generate list of all pets for fishparty script
// @author       shiny
// @match        http://moderneopets.com/quickref
// @match        https://www.moderneopets.com/quickref
// @icon         https://www.google.com/s2/favicons?domain=moderneopets.com
// @grant        none
// ==/UserScript==

/*
Don't modify this script!
Simply view your userlookup with the developer console open.
The script will spit out a formatted list of your pets which you can use for Fishparty.
*/

var pets = document.querySelectorAll('.pet-display .pet-info.active');
var values = Array.prototype.map.call(pets, function(p) {
    let name = p.querySelector('.pet-name').innerText;
    let urlparts = p.querySelector('.pet-image a').getAttribute('href').split('/');
    let id = urlparts[urlparts.length-1];
    if (name.startsWith("👑 ")){
        name = name.replace("👑 ","");
    }
    return `pet('${name}', ${id})`;
})


console.log(`const allpets = [\n${values.join(",\n")}\n];`
    )
