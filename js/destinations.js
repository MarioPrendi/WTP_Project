// Destinations page: search, category + price filter, sort, favorites

const container = document.getElementById("featured-container");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const sortSelect = document.getElementById("sortSelect");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");

// favorites use the same "favorites" key as favorites.js
function getFavorites() {
    try { return (JSON.parse(localStorage.getItem("favorites")) || []).map(Number); }
    catch (e) { return []; }
}

function updateFavCount() {
    const badge = document.getElementById("favCount");
    const count = getFavorites().length;
    badge.textContent = count;
    badge.hidden = count === 0;
}

function toggleFavorite(id) {
    let favs = getFavorites();
    favs = favs.includes(id) ? favs.filter(f => f !== id) : favs.concat(id);
    localStorage.setItem("favorites", JSON.stringify(favs));
    updateFavCount();
    displayDestination();
}

function displayDestination() {
    const text = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const maxPrice = priceFilter.value;
    const favs = getFavorites();

    // keep destinations that match search, category and price
    let list = destinations.filter(d =>
        (d.name.toLowerCase().includes(text) || d.country.toLowerCase().includes(text)) &&
        (category === "all" || d.category.toLowerCase() === category) &&
        (maxPrice === "all" || d.price <= Number(maxPrice))
    );

    // sort by price (copy first so data.js order is not changed)
    if (sortSelect.value === "low") list = list.slice().sort((a, b) => a.price - b.price);
    if (sortSelect.value === "high") list = list.slice().sort((a, b) => b.price - a.price);

    container.innerHTML = "";
    noResults.hidden = list.length > 0;
    resultCount.textContent = list.length + (list.length === 1 ? " destination" : " destinations");

    list.forEach(d => {
        const isFav = favs.includes(d.id);
        const card = document.createElement("article");
        card.className = "home-card";
        card.innerHTML = `
            <div class="card-img">
                <img src="${d.image}" alt="${d.name}" loading="lazy">
                <button class="fav-btn" type="button" aria-pressed="${isFav}"
                    aria-label="${isFav ? "Remove" : "Save"} ${d.name} ${isFav ? "from" : "to"} favorites">${isFav ? "\u2665" : "\u2661"}</button>
            </div>
            <div class="card-body">
                <h3>${d.name}</h3>
                <p class="card-meta">${d.country}, ${d.category}</p>
                <p class="desc">${d.description}</p>
                <div class="card-foot">
                    <span class="price">From \u20AC${d.price}</span>
                    <a href="planner.html">Plan this trip</a>
                </div>
            </div>`;
        card.querySelector(".fav-btn").addEventListener("click", () => toggleFavorite(d.id));
        container.appendChild(card);
    });
}

searchInput.addEventListener("input", displayDestination);
categoryFilter.addEventListener("change", displayDestination);
priceFilter.addEventListener("change", displayDestination);
sortSelect.addEventListener("change", displayDestination);

updateFavCount();
displayDestination();
