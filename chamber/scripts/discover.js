import { attractions } from "../data/discover.mjs";

const attractionsContainer = document.querySelector("#attractions");
const visitMessage = document.querySelector("#visit-message");
displayAttractions(attractions);

function displayAttractions(attractions) {

    attractions.forEach((attraction, index) => {

        const card = document.createElement("section");
        card.classList.add("discover-card");

        // Add card1, card2, card3... card8
        card.classList.add(`card${index + 1}`);

        const name = document.createElement("h2");
        name.textContent = attraction.name;

        const figure = document.createElement("figure");

        const image = document.createElement("img");
        image.src = attraction.image;
        image.alt = `View of ${attraction.name}`;
        image.loading = "lazy";
        image.width = 300;
        image.height = 200;

        const address = document.createElement("address");
        address.textContent = attraction.address;

        const description = document.createElement("p");
        description.textContent = attraction.description;

        const button = document.createElement("button");
        button.textContent = "Learn More";

        figure.appendChild(image);

        card.append(
            name,
            figure,
            address,
            description,
            button
        );

        attractionsContainer.appendChild(card);
    });
}

const currentVisit = Date.now();
const lastVisit = localStorage.getItem("lastVisit");

if (!lastVisit) {
    visitMessage.textContent =
        "Welcome! Let us know if you have any questions.";
} else {
    const timeDifference = currentVisit - Number(lastVisit);
    const daysDifference = Math.floor(
        timeDifference / (1000 * 60 * 60 * 24)
    );

    if (daysDifference < 1) {
        visitMessage.textContent =
            "Back so soon! Awesome!";
    } else if (daysDifference === 1) {
        visitMessage.textContent =
            "You last visited 1 day ago.";
    } else {
        visitMessage.textContent =
            `You last visited ${daysDifference} days ago.`;
    }
}
// Save the current visit
localStorage.setItem("lastVisit", currentVisit);