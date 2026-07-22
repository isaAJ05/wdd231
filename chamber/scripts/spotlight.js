const url5 = "data/members.json";
const spotlightContainer = document.querySelector("#spotlights");

async function getSpotlights() {
    const response = await fetch(url5);
    const members = await response.json();

    displaySpotlights(members);
}

getSpotlights();


function displaySpotlights(members){

    const premium =
    members.filter(member =>
        member.membership === 2 || member.membership === 3
    );

    premium.sort(() => Math.random() - 0.5);

    const selected = premium.slice(0, 2);

    selected.forEach(member => {

        const card = document.createElement("section");
        card.classList.add("spotlight-card");

        const membership = document.createElement("p");
        const membershipLevels = {
        2: "Silver",
        3: "Gold"
    };

        membership.classList.add(membershipLevels[member.membership].toLowerCase());
        membership.textContent = `${membershipLevels[member.membership]} Member`;


        const name = document.createElement("h3");
        name.textContent = member.name;
        const image = document.createElement("img");
        image.src = member.image;
        image.alt = `${member.name} image`;
        image.loading = "lazy";
        image.width = 300;
        image.height = 220;

        const address = document.createElement("p");
        address.textContent = member.address;

        const phone = document.createElement("p");
        phone.textContent = member.phonenumber;

        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visit Website";
        website.target = "_blank";

        card.append(
            name,
            membership,
            image,
            address,
            phone,
            website,
            
        );

        spotlightContainer.appendChild(card);

    });

}