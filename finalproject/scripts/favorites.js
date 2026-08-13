const FAVORITES_KEY = "bookverse-favorites";

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch (error) {
        console.error("Error reading favorites:", error);
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function renderFavorites() {
    const list = document.querySelector("#favorites-list");
    const empty = document.querySelector("#favorites-empty");
    const favorites = getFavorites();

    list.innerHTML = "";

    if (favorites.length === 0) {
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    favorites.forEach(book => {
        const card = document.createElement("article");
        card.className = "book-card";
        card.innerHTML = `
            <img src="${book.cover}" alt="Cover of ${book.title}" loading="lazy" onerror="this.src='images/no-cover.webp'">
            <h3>${book.title}</h3>
            <p class="author">${book.authors.join(", ") || "Unknown author"}</p>
            <div class="book-meta">
                <span>Published: ${book.publishedDate}</span>
                <span>Category: ${book.categories[0] || "Unknown"}</span>
            </div>
            <div class="book-actions">
                <button class="details-btn" data-book='${encodeURIComponent(JSON.stringify(book))}'>View Details</button>
                <button class="favorite-btn is-saved" data-book='${encodeURIComponent(JSON.stringify(book))}'>Remove</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function showBookDetails(book) {
    const modal = document.querySelector("#book-modal");
    const modalBook = document.querySelector("#modal-book");

    modalBook.innerHTML = `
        <img src="${book.cover}" alt="Cover of ${book.title}" class="modal-cover" onerror="this.src='images/no-cover.webp'">
        <div class="modal-info">
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.authors.join(", ") || "Unknown author"}</p>
            <p><strong>Published:</strong> ${book.publishedDate}</p>
            <p><strong>Category:</strong> ${book.categories.join(", ") || "Unknown"}</p>
            <p>${book.description}</p>
            ${book.previewLink ? `<a href="${book.previewLink}" target="_blank" rel="noopener noreferrer">View on Google Books</a>` : ""}
        </div>
    `;

    modal.classList.add("open");
}

document.addEventListener("click", event => {
    const favoriteButton = event.target.closest(".favorite-btn");
    if (favoriteButton) {
        const book = JSON.parse(decodeURIComponent(favoriteButton.dataset.book));
        const favorites = getFavorites().filter(item => item.id !== book.id);
        saveFavorites(favorites);
        renderFavorites();
        return;
    }

    const detailsButton = event.target.closest(".details-btn");
    if (detailsButton) {
        const book = JSON.parse(decodeURIComponent(detailsButton.dataset.book));
        showBookDetails(book);
    }
});

const modal = document.querySelector("#book-modal");
const closeModal = document.querySelector("#close-modal");

closeModal.addEventListener("click", () => modal.classList.remove("open"));
modal.addEventListener("click", event => {
    if (event.target === modal) {
        modal.classList.remove("open");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        modal.classList.remove("open");
    }
});

renderFavorites();