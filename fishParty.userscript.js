// ==UserScript==
// @name         fishParty
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get all your pets fishing together in one go!
// @author       shiny
// @match        http://moderneopets.com/water/fishing
// @match        htts://www.moderneopets.com/water/fishing
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

/* Add a comma-seperated list of your fishing pets in the format pet('your pet name', id#)
It's a bit tedious, but this method will ensure your active pet only fishes once.
ex:
const allpets = [
    pet('PetOne', 1),
    pet ('PetTwo',32)
    ];

    Alternatively, you can use my 'allpet generator' script to do this for you.
*/

const allpets = [
];

/* DO NOT MODIFY ANYTHING BELOW THIS LINE! ========================= */

const active = document.querySelectorAll('a.active_pet')[0].innerText;
var activeid = 0;
const pets = allpets.filter(el => {
    if (el.name !== active) return true;
    activeid = el.id;
    return false;
});

const isMain = document.querySelectorAll('img[alt="Underwater Cavern Fishing"').length > 0 ? true : false;

if (isMain){
    const forms = document.querySelectorAll('form');
    let el = document.createElement('button');
    let res = document.createElement('p');
    el.classList.add('p-2','m-auto','block');
    el.setAttribute('id','party');
    res.setAttribute('id', 'results');
    el.setAttribute('type','button');
    el.innerText = "Fish for me!" ;
    var form = forms[forms.length-1];
    form.prepend(el);
    form.prepend(res);

    document.addEventListener('click', async function(e){
         if (e.target && e.target.id === "party" && !e.target.disabled){
             e.target.disabled = true;
             e.target.textContent = "Fishing...";
             let res = await dofish();
             e.target.textContent = "Done!";
         }
     });
}

// functions ================================================================
var dofish = async function(){
    const submit = form.querySelectorAll('input[name="submit"]')[0].value;
    const token = form.querySelectorAll('input[name="_token"]')[0].value;
    const res = form.querySelector('#results');

    let init = await fish(token, submit); // for active pet
    res.innerText += `${active} : ${init}\n`;

    if (init){
        for (pet of pets) { // all other pets
            let changeSuccess = await changePet(pet.id);
            if (changeSuccess){
                let fishResult = await fish(token, submit);
                res.innerText += `${pet.name}: ${fishResult}\n`;

            }
        }
        if (allpets.length >1 && activeid){
            await changePet(activeid); // reset to main pet after
        }
    }
}

function pet(name,id){
    return {name: name, id: id};
}

function rnr(){
    return Math.random() * 1000 + 750;
}

function sleep(time) {
  return new Promise(r => setTimeout(r, time));
}

var fish = async function(token, submit){
    let fishresult = "";
    await sleep(rnr());
    let data = {_token: token, submit: submit}
    var resp = await fetch("/water/fishing", {
        method: "POST",
        headers: {"X-CSRF-Token": document.querySelector('input[name=_token]').value,
                  "Content-Type": "application/x-www-form-urlencoded"
                 },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(html => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(html, "text/html");
        const patiencetext = "Maybe you should be more patient.";
        const leveluptext = "fishing skill increases";
        const resultcontainer = htmlDoc.querySelector(".content .container .text-center");

        let item = resultcontainer.querySelectorAll(".tombola img");
        if (item.length) {
            fishresult += `Fished up ${item[0].getAttribute("alt")}! `;
        }
        if (resultcontainer.innerText.search(patiencetext) >-1){
            fishresult += "Needs to be patient. ";
        }
        if (resultcontainer.innerText.search(leveluptext) >-1){
            fishresult += "Fishing skill increased. ";
        }
  })

    return fishresult;
}

var changePet = async function (id) {
    console.log('change pet');
    await sleep(rnr());
	var resp = await fetch(`/setactive/${id}`);
    return await resp.ok;
};
