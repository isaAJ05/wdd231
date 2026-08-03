import { attractions } from "../data/discover.mjs";

const attractionsContainer = document.querySelector("#attractions");
displayAttractions(attractions);


function displayAttractions(attractions){

    attractions.forEach(attraction => {

        const card = document.createElement("section");
        card.classList.add("discover-card");

        const name = document.createElement("h2");
        name.textContent = attraction.name;

        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = attraction.image;
        image.alt = `View of ${attraction.name}`;
        image.loading = "lazy";
        image.width = 300;

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
            button,
            
        );

        attractionsContainer.appendChild(card);

    });

}