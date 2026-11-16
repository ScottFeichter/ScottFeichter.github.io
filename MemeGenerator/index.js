"use strict"

function logSubmit(event) {
    log.textContent = "Meme Generated!"
    event.preventDefault();

}



// Underline Access Keys
function addKeyHint(element) {
    let textnode = Array.from(element.childNodes).find(node => node.nodeName === "#text");
    if(textnode) {
        let ak = element.getAttribute("accesskey");
        let txt = textnode.nodeValue;
        let pos = txt.indexOf(ak);

        let newspan = document.createElement("span");
        newspan.appendChild(document.createTextNode(ak));
        newspan.className = "accesskey" ;

        let newtext1 = document.createTextNode(txt.substring(0, pos));
        let newtext2 = document.createTextNode(txt.substring(pos +1));

        if (newtext1.length > 0)
            element.insertBefore(newtext1, textnode);

        element.insertBefore(newspan, textnode);

        if (newtext2.length > 0)
            element.insertBefore(newtext2, textnode);

        element.removeChild(textnode);
    }
}

function addAccessKeyHints() {
    let theform = document.getElementById("MemeGenerator");

    let elems = Array("LABEL", "A", "BUTTON");
    elems.forEach(elemtype => {
        let items = Array.from(theform.getElementsByTagName(elemtype));

        items.forEach(el => {
            if (el.hasAttribute("accesskey")) {
                addKeyHint(el);
            }
        });
    });
}

window.addEventListener("load", addAccessKeyHints);


// Form Submit
window.addEventListener('load', (event) => {

    const theForm = document.getElementById("MemeGenerator");

    // console.log("value of theForm", theForm);

    theForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const TopText = document.getElementById("TopText").value;
        const Address = document.getElementById("Address").value;
        const BottomText = document.getElementById("BottomText").value;

        // console.log("event: ", event);
        // console.log("3 fields: ", TopText, Address, BottomText);

        let GeneratedMemes = document.getElementById("GeneratedMemes");
        let memesList = GeneratedMemes.querySelector("ul");
        let newMemeItem = document.createElement("li");



        let newMemeDiv = document.createElement('div');
        newMemeDiv.className = "newMemeDiv";

        function createImage(url){
            const img = document.createElement('img');
            img.src = url;
            img.style.width = 600+'px';
            return img
        }

        let newMemeImage = createImage(Address);
        newMemeImage.className = "newMemeImage";


        function createTopText(txt) {
            let text = document.createElement('p');
            text.innerHTML = txt;
            return text;
        }

        let newMemeTopText = createTopText(TopText);
        newMemeTopText.className = "newMemeTopText";

        function createBottomText(txt) {
            let text = document.createElement('p');
            text.innerHTML = txt;
            return text;
        }

        let newMemeBottomText = createBottomText(BottomText);
        newMemeBottomText.className = "newMemeBottomText";

        newMemeDiv.appendChild(newMemeTopText);
        newMemeDiv.appendChild(newMemeImage);
        newMemeDiv.appendChild(newMemeBottomText);

        newMemeItem.appendChild(newMemeDiv);
        memesList.appendChild(newMemeItem);


        let removeButton = document.createElement("button");
        removeButton.innerHTML = "Remove";
        removeButton.type = "button";
        removeButton.id = "removeButton";

        newMemeItem.appendChild(removeButton);

        removeButton.addEventListener("click", function(event) {
            newMemeItem.remove();
            // console.log(event);
        });

        theForm.reset();
    });

});


// https://www.google.com/url?sa=i&url=https%3A%2F%2Fnymag.com%2Fintelligencer%2F2019%2F10%2Fhow-spooky-scary-skeletons-became-tiktoks-halloween-song.html&psig=AOvVaw0CiV4b4Bona3CdeYuYypyU&ust=1667335242638000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCMjp6_ipi_sCFQAAAAAdAAAAABAE

//
//
//
// //establishes button constant set to submit button
// const form = document.querySelector("form");
// // stores image url input field as imgURL
// let imgURL = document.querySelector('input[name="imgURL"]');
// // stores topText input field as topText
// let topText = document.querySelector('input[name="top-text"]');
// // stores topText input field as topText
// let bottomText = document.querySelector('input[name="bottom-text"]');
// // const for the section to append the div memes to.
// const results = document.querySelector('section');
//
// form.addEventListener("submit", function(event){
//     event.preventDefault();
//     const top = addH2(topText.value);
//     const bottom = addH2(bottomText.value);
//     const newDiv = document.createElement('div');
//     newDiv.style.width = 600+'px';
//     const img = addImage(imgURL.value);
//     top.style.top = 0+'px';
//     bottom.style.bottom = 20+'px';
//     newDiv.className = 'meme';
//     newDiv.append(img);
//     newDiv.append(top);
//     newDiv.append(bottom);
//     results.append(newDiv);
// })
//
// let memes =document.getElementsByClassName('meme');
// memes[0].addEventListener('click', function(e){
//     let div = e.target;
//     div.addEventListener();
// });
//
//
//
// function addH2(text){
//     const h2 = document.createElement('h2');
//     h2.innerText = text;
//     return h2
// }
//
// function addImage(url){
//     const img = document.createElement('img');
//     img.src=url;
//     img.style.width = 600+'px';
//     return img
// }