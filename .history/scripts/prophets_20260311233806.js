const { createElement } = require("react");

const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

async function getProphetData() {
    const response = await fetch(url); // request
    const data = await response.json(); // parse the JSON data
    console.table(data.prophets); // temp output test of data response 
    displayProphets(data.prophets); 
}
getProphetData();

const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
      const card = createElement('section');
      const fullName = createElement('h2');
      const portrait = createElement('img');

      fullName.textContent = `${prophet.name} ${prophet.lastname}`;
      portrait.setAttribute('src', prophet.imageurl);
      portrait.setAttribute('alt', `Portrait of ${fullName.textContent}`);
      portrait.setAttribute('loading', 'lazy');
  });
}