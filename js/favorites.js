
const favoritesContainer = document.getElementById("favorites-container");

function displayFavorites() {
    favoritesContainer.innerHTML = "";

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p class='empty-message'>You have no favorite destinations yet.</p>";
        return;
    }

    for (let i = 0; i < favorites.length; i++) {
        let selectedDestination = null;

        for (let j = 0; j < destinations.length; j++) {
            if (destinations[j].id === Number(favorites[i])) {
                selectedDestination = destinations[j];
            }
        }

        if (selectedDestination !== null) {
            let card = document.createElement("div");

            card.className = "favorite-card";

            card.innerHTML = `
                <img src="${selectedDestination.image}" alt="${selectedDestination.name}">
                <h3>${selectedDestination.name}</h3>
                <p>${selectedDestination.country}</p>
                <p>${selectedDestination.category}</p>
                <p>${selectedDestination.description}</p>
                <p><strong>Estimated price: €${selectedDestination.price}</strong></p>
                <button onclick="removeFavorite(${selectedDestination.id})">Remove from Favorites</button>
            `;

            favoritesContainer.appendChild(card);
        }
    }
}

function removeFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    let updatedFavorites = [];

    for (let i = 0; i < favorites.length; i++) {
        if (Number(favorites[i]) !== Number(id)) {
            updatedFavorites.push(favorites[i]);
        }
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    displayFavorites();
}

displayFavorites();
