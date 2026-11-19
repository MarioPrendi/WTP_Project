// Homepage logic. This file is also loaded by destinations.html, so it only runs on the homepage.
if (document.body.classList.contains("home")) {

    const container = document.getElementById("featured-container");
    const searchBox = document.getElementById("homeSearch");
    const chipsBox = document.getElementById("chips");
    const noResults = document.getElementById("noResults");
    const FEATURED_COUNT = 6;
    let activeCategory = "all";

    // favorites use the same "favorites" key as favorites.js
    function getFavorites() {
        try { return (JSON.parse(localStorage.getItem("favorites")) || []).map(Number); }
        catch (e) { return []; }
    }
    function saveFavorites(list) {
        localStorage.setItem("favorites", JSON.stringify(list));
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
        saveFavorites(favs);
        updateFavCount();
        displayFeatured();
    }

    function displayFeatured() {
        const text = searchBox.value.trim().toLowerCase();
        const favs = getFavorites();
        const filtering = text !== "" || activeCategory !== "all";

        let list = destinations.filter(d =>
            (activeCategory === "all" || d.category === activeCategory) &&
            (d.name.toLowerCase().includes(text) || d.country.toLowerCase().includes(text))
        );
        if (!filtering) list = list.slice(0, FEATURED_COUNT);

        container.innerHTML = "";
        noResults.hidden = list.length > 0;

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

    function buildChips() {
        const categories = ["all"].concat([...new Set(destinations.map(d => d.category))]);
        categories.forEach(cat => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chip" + (cat === activeCategory ? " active" : "");
            chip.textContent = cat === "all" ? "All" : cat;
            chip.addEventListener("click", () => {
                activeCategory = cat;
                chipsBox.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === chip));
                displayFeatured();
            });
            chipsBox.appendChild(chip);
        });
    }

    function buildStats() {
        const prices = destinations.map(d => d.price);
        const cats = new Set(destinations.map(d => d.category)).size;
        const items = [
            [destinations.length, "destinations"],
            [cats, "categories"],
            ["\u20AC" + Math.min(...prices), "cheapest trip from"]
        ];
        document.getElementById("stats").innerHTML = items
            .map(i => `<div class="stat"><strong>${i[0]}</strong><span>${i[1]}</span></div>`).join("");
    }

    // hero photo comes from the first beach destination in data.js
    const heroDest = destinations.find(d => d.category === "Beaches") || destinations[0];
    document.getElementById("hero").style.backgroundImage =
        `linear-gradient(to top, rgba(6,40,46,.78), rgba(6,40,46,.15)), url("${heroDest.image}")`;

    buildStats();
    buildChips();
    searchBox.addEventListener("input", displayFeatured);
    updateFavCount();
    displayFeatured();
}
