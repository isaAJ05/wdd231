const API_KEY = "AIzaSyAmorHY_jrPsDO5BpxtLnBVvl7oO-k7C4k";
const FAVORITES_KEY = "bookverse-favorites";


// =========================
// SEARCH BOOKS
// =========================

async function searchBooks(query) {

    const url =
        `https://www.googleapis.com/books/v1/volumes` +
        `?q=${encodeURIComponent(query)}` +
        `&maxResults=12` +
        `&orderBy=relevance` +
        `&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        displaySearchResults(data.items || []);

    } catch (error) {

        console.error("Error searching books:", error);

        const container =
            document.querySelector("#search-results");

        container.innerHTML = `
            <p>
                Something went wrong while searching.
                Please try again.
            </p>
        `;
    }
}

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

function createFavoriteSnapshot(book) {
    const info = book.volumeInfo;

    return {
        id: book.id,
        title: info.title || "Untitled",
        authors: info.authors || [],
        cover: info.imageLinks?.thumbnail || "images/no-cover.webp",
        publishedDate: info.publishedDate || "Unknown",
        categories: info.categories || [],
        description: info.description || "No description available.",
        previewLink: info.previewLink || ""
    };
}

function isFavorite(bookId) {
    return getFavorites().some(item => item.id === bookId);
}


// =========================
// DISPLAY RESULTS
// =========================

function displaySearchResults(books) {

    const container =
        document.querySelector("#search-results");

    const title =
        document.querySelector("#search-title");


    // No results

    if (books.length === 0) {

        title.textContent = "No Results";

        container.innerHTML = `
            <p>
                No books were found.
            </p>
        `;

        return;
    }


    // Results found

    container.innerHTML = "";


    books.forEach(book => {

        const card = createBookCard(book);

        container.appendChild(card);

    });
}


// =========================
// CREATE BOOK CARD
// =========================

function createBookCard(book) {

    const info = book.volumeInfo;

    const card = document.createElement("article");

    card.classList.add("book-card");


    // Book cover

    const cover =
        info.imageLinks?.thumbnail ||
        "images/no-cover.png";


    // Author

    const author =
        info.authors?.join(", ") ||
        "Unknown author";

    const publishedDate = info.publishedDate || "Unknown";
    const category = info.categories?.[0] || "Unknown";
    const favoriteSnapshot = encodeURIComponent(JSON.stringify(createFavoriteSnapshot(book)));


    card.innerHTML = `

        <img
            src="${cover}"
            alt="Cover of ${info.title}"
            loading="lazy"
            onerror="this.src='images/no-cover.png'"
        >

        <h3>
            ${info.title}
        </h3>

        <p class="author">
            ${author}
        </p>

        <div class="book-meta">
            <span>Published: ${publishedDate}</span>
            <span>Category: ${category}</span>
        </div>

        <div class="book-actions">
            <button
                class="details-btn"
                data-id="${book.id}"
            >
                View Details
            </button>

            <button
                class="favorite-btn ${isFavorite(book.id) ? "is-saved" : ""}"
                data-book="${favoriteSnapshot}"
            >
                ${isFavorite(book.id) ? "Saved" : "Save"}
            </button>
        </div>

    `;


    return card;
}


// =========================
// VIEW BOOK DETAILS
// =========================

document.addEventListener("click", async (event) => {

    const favoriteButton = event.target.closest(".favorite-btn");

    if (favoriteButton) {
        const book = JSON.parse(decodeURIComponent(favoriteButton.dataset.book));
        const favorites = getFavorites();
        const existingIndex = favorites.findIndex(item => item.id === book.id);

        if (existingIndex === -1) {
            favorites.push(book);
            favoriteButton.textContent = "Saved";
            favoriteButton.classList.add("is-saved");
        } else {
            favorites.splice(existingIndex, 1);
            favoriteButton.textContent = "Save";
            favoriteButton.classList.remove("is-saved");
        }

        saveFavorites(favorites);
        return;
    }

    if (!event.target.classList.contains("details-btn")) {
        return;
    }


    const bookId =
        event.target.dataset.id;


    const url =
        `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`;


    try {

        const response = await fetch(url);


        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }


        const book = await response.json();


        showBookDetails(book);


    } catch (error) {

        console.error(
            "Error loading book details:",
            error
        );

    }

});


// =========================
// SHOW BOOK MODAL
// =========================

function showBookDetails(book) {

    const info = book.volumeInfo;


    const modal =
        document.querySelector("#book-modal");


    const modalBook =
        document.querySelector("#modal-book");


    // Cover

    const cover =
        info.imageLinks?.thumbnail ||
        "images/no-cover.png";


    // Author

    const author =
        info.authors?.join(", ") ||
        "Unknown author";


    // Description

    const description =
        info.description ||
        "No description available.";


    // Categories

    const categories =
        info.categories?.join(", ") ||
        "Unknown";


    modalBook.innerHTML = `

        <img
            src="${cover}"
            alt="Cover of ${info.title}"
            class="modal-cover"
            onerror="this.src='images/no-cover.png'"
        >


        <div class="modal-info">

            <h2>
                ${info.title}
            </h2>


            <p>
                <strong>Author:</strong>
                ${author}
            </p>


            <p>
                <strong>Published:</strong>
                ${info.publishedDate || "Unknown"}
            </p>


            <p>
                <strong>Category:</strong>
                ${categories}
            </p>


            <p>
                ${description}
            </p>


            ${
                info.previewLink
                    ? `
                        <a
                            href="${info.previewLink}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on Google Books
                        </a>
                    `
                    : ""
            }

        </div>

    `;


    modal.classList.add("open");
}


// =========================
// SEARCH FORM
// =========================

const searchForm =
    document.querySelector("#search-form");


const searchInput =
    document.querySelector("#book-search");


const searchResults =
    document.querySelector("#search-results");


const searchResultsSection =
    document.querySelector("#search-results-section");


const searchTitle =
    document.querySelector("#search-title");

const modal = document.querySelector("#book-modal");
const closeModal = document.querySelector("#close-modal");

closeModal.addEventListener("click", () => {
    modal.classList.remove("open");
});

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.remove("open");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        modal.classList.remove("open");
    }
});

searchForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const searchTerm =
        searchInput.value.trim();


    // Empty search

    if (!searchTerm) {
        return;
    }


    // Show results section

    searchResultsSection.style.display = "block";


    // Change title

    searchTitle.textContent =
        `Results for "${searchTerm}"`;


    // Loading message

    searchResults.innerHTML = `
        <p>
            Searching for books...
        </p>
    `;


    // Search API

    searchBooks(searchTerm);

});


// =========================
// CLOSE MODAL
// =========================

const modal =
    document.querySelector("#book-modal");


const closeModal =
    document.querySelector("#close-modal");


closeModal.addEventListener("click", () => {

    modal.classList.remove("open");

});


// Close clicking outside

modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        modal.classList.remove("open");

    }

});


// Close with ESC

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        modal.classList.remove("open");

    }

});