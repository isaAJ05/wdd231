const API_KEY = "AIzaSyAmorHY_jrPsDO5BpxtLnBVvl7oO-k7C4k";
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

function createFavoriteSnapshot(book) {
    if (!book.volumeInfo) {
        return book;
    }

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

function toggleFavorite(book, button) {
    const favorites = getFavorites();
    const favoriteBook = createFavoriteSnapshot(book);
    const existingIndex = favorites.findIndex(item => item.id === favoriteBook.id);
    const saved = existingIndex === -1;

    if (saved) {
        favorites.push(favoriteBook);
    } else {
        favorites.splice(existingIndex, 1);
    }

    saveFavorites(favorites);

    if (button) {
        button.textContent = saved ? "Saved" : "Save";
        button.classList.toggle("is-saved", saved);
    }
}

async function getBooks(query, containerId) {

    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=8&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        displayBooks(data.items || [], containerId);

    } catch (error) {

        console.error("Error loading books:", error);

    }
}
async function getCategoryBooks(category) {

    const container = document.querySelector("#category-books");
    const title = document.querySelector("#category-title");
    const description = document.querySelector("#category-description");

    const categoryName =
    category.charAt(0).toUpperCase() + category.slice(1);

    title.textContent = `${categoryName} Books`;

    description.textContent =
    `Discover the latest books in ${categoryName}.`;
    container.innerHTML = "<p>Loading books...</p>";

    const query = `subject:${encodeURIComponent(category)}`;

    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=8&orderBy=newest&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        displayBooks(data.items || [], "#category-books");

    } catch (error) {

        console.error("Error loading category books:", error);

        container.innerHTML = `
            <p>Unable to load books. Please try again.</p>
        `;
    }
}
document.addEventListener("click", (event) => {

    const favoriteButton = event.target.closest(".favorite-btn");

    if (favoriteButton) {
        const favoriteBook = JSON.parse(
            decodeURIComponent(favoriteButton.dataset.book)
        );

        toggleFavorite(favoriteBook, favoriteButton);
        return;
    }

    if (event.target.classList.contains("category-btn")) {

        const category = event.target.dataset.category;

        document.querySelectorAll(".category-btn").forEach(button => {
            button.classList.remove("active");
        });

        event.target.classList.add("active");

        getCategoryBooks(category);
    }

});


function createBookCard(book) {

    const info = book.volumeInfo;

    const card = document.createElement("article");

    card.classList.add("book-card");

    const cover =
        info.imageLinks?.thumbnail ||
        "images/no-cover.webp";

    const author =
        info.authors
            ? info.authors.join(", ")
            : "Unknown author";

    const publishedDate = info.publishedDate || "Unknown";
    const category = info.categories?.[0] || "Unknown";
    const favoriteSnapshot = encodeURIComponent(JSON.stringify(createFavoriteSnapshot(book)));

    card.innerHTML = `
        <img 
            src="${cover}" 
            alt="Cover of ${info.title}"
            loading="lazy"
            onerror="this.src='images/no-cover.webp'"
        >

        <h3>${info.title}</h3>

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
                data-id="${book.id}">
                View Details
            </button>

            <button
                class="favorite-btn ${isFavorite(book.id) ? "is-saved" : ""}"
                data-book="${favoriteSnapshot}">
                ${isFavorite(book.id) ? "Saved" : "Save"}
            </button>
        </div>
    `;

    return card;
}


function displayBooks(books, containerId) {

    const container = document.querySelector(containerId);

    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }

    container.innerHTML = "";

    books.forEach(book => {

        const card = createBookCard(book);

        container.appendChild(card);

    });
}


// ========================================
// SHOW BOOK DETAILS IN MODAL
// ========================================

function showBookDetails(book) {

    const info = book.volumeInfo;

    const modal = document.querySelector("#book-modal");
    const modalBook = document.querySelector("#modal-book");

    if (!modal || !modalBook) {
        console.error("Modal elements were not found.");
        return;
    }

    const cover =
        info.imageLinks?.thumbnail ||
        "images/no-cover.webp";

    const author =
        info.authors
            ? info.authors.join(", ")
            : "Unknown author";

    const description =
        info.description ||
        "No description available.";

    modalBook.innerHTML = `

        <img 
            src="${cover}" 
            alt="Cover of ${info.title}"
            class="modal-cover"
            onerror="this.src='images/no-cover.webp'"
        >

        <div class="modal-info">

            <h2>${info.title}</h2>

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
                ${
                    info.categories
                        ? info.categories.join(", ")
                        : "Unknown"
                }
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
                            rel="noopener noreferrer">
                            View on Google Books
                        </a>
                    `
                    : ""
            }

        </div>
    `;

    modal.classList.add("open");
}

document.addEventListener("click", async (event) => {

    const button = event.target.closest(".details-btn");

    if (!button) {
        return;
    }

    const bookId = button.dataset.id;

    console.log("Book selected:", bookId);

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

const modal = document.querySelector("#book-modal");
const closeModal = document.querySelector("#close-modal");

if (closeModal && modal) {

    closeModal.addEventListener("click", () => {

        modal.classList.remove("open");

    });


    // Close when clicking outside the modal

    modal.addEventListener("click", (event) => {

        if (event.target === modal) {

            modal.classList.remove("open");

        }

    });

}

async function loadCategory(category) {

    const container = document.querySelector("#featured-books");

    container.innerHTML = "<p>Loading books...</p>";

    const query = `subject:${encodeURIComponent(category)}`;

    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=8&orderBy=newest&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        displayBooks(data.items || [], "#featured-books");

    } catch (error) {

        console.error("Error loading category:", error);

        container.innerHTML = `
            <p>Unable to load books. Please try again.</p>
        `;
    }
}

document.addEventListener("click", (event) => {

    if (event.target.classList.contains("category-btn")) {

        const category = event.target.dataset.category;

        document.querySelectorAll(".category-btn")
            .forEach(button => {
                button.classList.remove("active");
            });

        event.target.classList.add("active");

        loadCategory(category);
    }

});


// Featured Books
getBooks(
    "subject:romance&orderBy=newest",
    "#featured-books"
);

// Trending Books
getBooks(
    "subject:mystery&orderBy=newest",
    "#trending-books"
);

// Personalized Recommendations
getBooks(
    "subject:fantasy&orderBy=newest",
    "#recommended-books"
);