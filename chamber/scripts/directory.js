const gridbutton = document.querySelector("#grid");
const listbutton = document.querySelector("#list");
const display = document.querySelector("#members");


gridbutton.addEventListener("click", () => {
	// example using arrow function
	display.classList.add("grid");
	display.classList.remove("list");
});

listbutton.addEventListener("click", showList); // example using defined function

function showList() {
	display.classList.add("list");
	display.classList.remove("grid");
}

const url = "data/members.json";
const membersContainer = document.querySelector("#members");

async function getMembersData() {
    const response = await fetch(url); // request
    const data = await response.json();
    console.table(data);
    displayMembers(data);
}
getMembersData();
const membershipLevels = {
    1: "Member",
    2: "Silver",
    3: "Gold"
};
const displayMembers = (members) => {
    members.forEach((member) => {

        let card = document.createElement("section");
        card.classList.add("member-card");
        let name = document.createElement("h2");
        let address = document.createElement("p");
        let phoneNumber = document.createElement("p");
        let website = document.createElement("a");
        let membership = document.createElement("p");
        let image = document.createElement("img");

        name.textContent = member.name;
        address.textContent = `Address: ${member.address}`;
        phoneNumber.textContent = `Phone: ${member.phonenumber}`;
        membership.classList.add(membershipLevels[member.membership].toLowerCase());
        membership.textContent = `Membership: ${membershipLevels[member.membership]}`;
        website.href = member.website;
        website.textContent = "Visit Website";
        website.target = "_blank";

        image.src = member.image;
        image.alt = `${member.name} image`;
        image.width = 300;
        image.height = 220;

        
        card.appendChild(name);
        card.appendChild(membership);
        card.appendChild(image);
        card.appendChild(address);
        card.appendChild(phoneNumber);
        card.appendChild(website);

        membersContainer.appendChild(card);
    });
};
