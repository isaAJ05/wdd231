const campo = document.querySelector("#organizationTitle");
const regex = /^[-A-Za-z ]{7,}$/;

campo.addEventListener("input", () => {
    if (campo.value === "") {
        campo.setCustomValidity(""); // no error if empty
    } else if (regex.test(campo.value)) {
        campo.setCustomValidity(""); // clears errors
    } else {
        campo.setCustomValidity("Must contain at least 7 characters, only letters, spaces, and hyphens");
    }
    });



const timestamp = document.querySelector("#timestamp");
const now = new Date();
timestamp.value = now
  .toISOString()
  .replace("T", " ")
  .replace("Z", "")
  .split(".")[0];

const links = document.querySelectorAll("[data-modal]");

links.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        const modal = document.getElementById(link.dataset.modal);
        modal.showModal();
    });
});

const closeButtons = document.querySelectorAll(".closeModal");

closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        button.closest("dialog").close();
    });
});

