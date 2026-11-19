
// ==========================================
// TRAVEL EASE - TRIP PLANNER
// ==========================================

// Get HTML elements
const destinationSelect = document.getElementById("destinationSelect");
const addDestinationBtn = document.getElementById("addDestinationBtn");
const selectedList = document.getElementById("selectedList");

const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const travelersInput = document.getElementById("travelers");

const destinationCount = document.getElementById("destinationCount");
const travelerCount = document.getElementById("travelerCount");
const tripDuration = document.getElementById("tripDuration");
const totalCost = document.getElementById("totalCost");

const saveTripBtn = document.getElementById("saveTripBtn");
const saveMessage = document.getElementById("saveMessage");

// Shared destination data from data.js
// The destinations array must be declared in data.js first.
let availableDestinations = [];

if (typeof destinations !== "undefined") {
    availableDestinations = destinations;
} else {
    console.error("Destination data was not found. Check data.js.");
}

// Store selected destinations
let selectedDestinations = [];

// Local Storage keys
const SAVED_TRIPS_KEY = "travelEaseTrips";
const CURRENT_TRIP_KEY = "travelEaseCurrentTrip";


// ==========================================
// 1. LOAD DESTINATIONS INTO DROPDOWN
// ==========================================

function loadDestinations() {

    destinationSelect.innerHTML =
        '<option value="">Select a destination</option>';

    // Group the dropdown by category (Beaches, Mountains, ...)
    const groups = {};

    availableDestinations.forEach(destination => {
        if (!groups[destination.category]) {
            groups[destination.category] = document.createElement("optgroup");
            groups[destination.category].label = destination.category;
        }

        const option = document.createElement("option");

        option.value = destination.id;
        option.textContent =
            `${destination.name}, ${destination.country} (\u20AC${destination.price})`;

        groups[destination.category].appendChild(option);
    });

    Object.values(groups).forEach(group => destinationSelect.appendChild(group));

}


// ==========================================
// 2. ADD DESTINATION
// ==========================================

function addDestination() {

    const destinationId = Number(destinationSelect.value);

    if (!destinationId) {
        alert("Please select a destination first.");
        return;
    }

    const destination = availableDestinations.find(
        item => Number(item.id) === destinationId
    );

    if (!destination) {
        alert("Destination not found.");
        return;
    }

    // Prevent adding the same destination twice
    const alreadyAdded = selectedDestinations.some(
        item => Number(item.id) === destinationId
    );

    if (alreadyAdded) {
        alert("This destination is already in your itinerary.");
        return;
    }

    selectedDestinations.push(destination);

    renderSelectedDestinations();
    updateSummary();
    saveCurrentTrip();

    destinationSelect.value = "";

}


// ==========================================
// 3. DISPLAY SELECTED DESTINATIONS
// ==========================================

function renderSelectedDestinations() {

    selectedList.innerHTML = "";

    if (selectedDestinations.length === 0) {

        selectedList.innerHTML = `
            <div class="empty-message">
                <h3>No destinations added yet</h3>
                <p>Your selected destination cards will appear here.</p>
            </div>
        `;

        return;
    }

    selectedDestinations.forEach(destination => {

        const card = document.createElement("div");
        card.className = "destination-card";

        // Create destination image
        const image = document.createElement("img");
        image.src = destination.image || "";
        image.alt = destination.name;

        image.onerror = function () {
            this.style.display = "none";
        };

        // Create destination information
        const info = document.createElement("div");
        info.className = "destination-info";

        const name = document.createElement("h3");
        name.textContent = destination.name;

        const country = document.createElement("p");
        country.textContent = `Country: ${destination.country}`;

        const category = document.createElement("p");
        category.textContent = `Category: ${destination.category}`;

        const price = document.createElement("p");
        price.textContent = `Price: €${destination.price}`;

        info.append(name, country, category, price);

        // Create remove button
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "Remove";

        removeBtn.addEventListener("click", function () {
            removeDestination(destination.id);
        });

        card.append(image, info, removeBtn);

        selectedList.appendChild(card);

    });

}


// ==========================================
// 4. REMOVE DESTINATION
// ==========================================

function removeDestination(destinationId) {

    selectedDestinations = selectedDestinations.filter(
        destination => Number(destination.id) !== Number(destinationId)
    );

    renderSelectedDestinations();
    updateSummary();
    saveCurrentTrip();

}


// ==========================================
// 5. UPDATE TRIP SUMMARY
// ==========================================

function updateSummary() {

    // Number of selected destinations
    destinationCount.textContent = selectedDestinations.length;

    // Number of travelers
    const travelers = Math.max(1, Number(travelersInput.value) || 1);

    travelerCount.textContent = travelers;

    // Calculate total estimated cost
    let cost = 0;

    selectedDestinations.forEach(destination => {
        cost += Number(destination.price) || 0;
    });

    cost *= travelers;

    totalCost.textContent = `€${cost.toFixed(2)}`;

    // Calculate duration from departure and return dates
    if (startDate.value && endDate.value) {

        const departure = new Date(startDate.value + "T00:00:00");
        const returning = new Date(endDate.value + "T00:00:00");

        const difference = returning - departure;

        const days = difference / (1000 * 60 * 60 * 24);

        tripDuration.textContent =
            days >= 0 ? `${days} days` : "Invalid dates";

    } else {

        tripDuration.textContent = "0 days";

    }

}


// ==========================================
// 6. VALIDATE TRAVEL DATES
// ==========================================

function validateDates() {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!startDate.value || !endDate.value) {
        alert("Please enter both departure and return dates.");
        return false;
    }

    const departure = new Date(startDate.value + "T00:00:00");
    const returning = new Date(endDate.value + "T00:00:00");

    if (departure < today) {
        alert("Departure date cannot be in the past.");
        return false;
    }

    if (returning <= departure) {
        alert("Return date must be after the departure date.");
        return false;
    }

    return true;

}


// ==========================================
// 7. GET CURRENT TRIP INFORMATION
// ==========================================

function getTripData() {

    const travelers = Math.max(1, Number(travelersInput.value) || 1);

    const cost = selectedDestinations.reduce(
        (sum, destination) => {
            return sum + (Number(destination.price) || 0);
        },
        0
    ) * travelers;

    let days = 0;

    if (startDate.value && endDate.value) {

        const departure = new Date(startDate.value + "T00:00:00");
        const returning = new Date(endDate.value + "T00:00:00");

        days = (returning - departure) / (1000 * 60 * 60 * 24);

    }

    return {
        departureDate: startDate.value,
        returnDate: endDate.value,
        travelers: travelers,
        destinations: selectedDestinations.map(destination => ({
            id: destination.id,
            name: destination.name,
            country: destination.country,
            category: destination.category,
            price: destination.price,
            duration: destination.duration,
            image: destination.image
        })),
        numberOfDestinations: selectedDestinations.length,
        tripDuration: days,
        totalCost: cost
    };

}


// ==========================================
// 8. SAVE CURRENT TRIP AUTOMATICALLY
// ==========================================

function saveCurrentTrip() {

    const trip = getTripData();

    localStorage.setItem(
        CURRENT_TRIP_KEY,
        JSON.stringify(trip)
    );

}


// ==========================================
// 9. SAVE TRIP
// ==========================================

function saveTrip() {

    if (selectedDestinations.length === 0) {
        alert("Please add at least one destination.");
        return;
    }

    if (!validateDates()) {
        return;
    }

    if (!travelersInput.value || Number(travelersInput.value) < 1) {
        alert("Please enter at least one traveler.");
        return;
    }

    const trip = getTripData();

    // Retrieve previously saved trips
    let savedTrips = JSON.parse(
        localStorage.getItem(SAVED_TRIPS_KEY) || "[]"
    );

    // Add the new trip
    trip.id = Date.now();

    savedTrips.push(trip);

    // Save trips in Local Storage
    localStorage.setItem(
        SAVED_TRIPS_KEY,
        JSON.stringify(savedTrips)
    );

    saveCurrentTrip();

    saveMessage.textContent = "Your trip has been saved successfully!";

    renderSavedTrips();

}


// ==========================================
// 10. RESTORE PREVIOUSLY SAVED TRIP
// ==========================================

function loadCurrentTrip() {

    const savedTrip = localStorage.getItem(CURRENT_TRIP_KEY);

    if (!savedTrip) {
        return;
    }

    try {

        const trip = JSON.parse(savedTrip);

        startDate.value = trip.departureDate || "";
        endDate.value = trip.returnDate || "";
        travelersInput.value = trip.travelers || 1;

        selectedDestinations = (trip.destinations || [])
            .map(savedDestination =>
                availableDestinations.find(
                    destination =>
                        Number(destination.id) === Number(savedDestination.id)
                )
            )
            .filter(destination => destination !== undefined);

        renderSelectedDestinations();
        updateSummary();

    } catch (error) {

        console.error("Could not restore the saved trip:", error);

    }

}


// ==========================================
// 11. GET ALL SAVED TRIPS
// ==========================================

function getSavedTrips() {

    return JSON.parse(
        localStorage.getItem(SAVED_TRIPS_KEY) || "[]"
    );

}


// ==========================================
// 12. EVENT LISTENERS
// ==========================================

// Add destination button
addDestinationBtn.addEventListener("click", addDestination);

// Update summary when travelers change
travelersInput.addEventListener("input", function () {
    updateSummary();
    saveCurrentTrip();
});

// Update summary when dates change
startDate.addEventListener("change", function () {
    updateSummary();
    saveCurrentTrip();
});

endDate.addEventListener("change", function () {
    updateSummary();
    saveCurrentTrip();
});

// Save trip button
saveTripBtn.addEventListener("click", saveTrip);


// ==========================================
// 13. INITIALIZE TRIP PLANNER
// ==========================================

loadDestinations();
loadCurrentTrip();
updateSummary();


// ==========================================
// 14. MY SAVED TRIPS (shown at the bottom of the page)
// ==========================================

const savedTripsBox = document.getElementById("savedTrips");

function renderSavedTrips() {

    const trips = getSavedTrips();
    savedTripsBox.innerHTML = "";

    if (trips.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-message";
        empty.textContent = "No saved trips yet. Build a trip above and press Save My Trip.";
        savedTripsBox.appendChild(empty);
        return;
    }

    trips.slice().reverse().forEach(trip => {

        const item = document.createElement("div");
        item.className = "saved-item";

        const text = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = trip.destinations.map(d => d.name).join(", ");

        const details = document.createElement("p");
        details.textContent =
            `${trip.departureDate} to ${trip.returnDate} \u2022 ` +
            `${trip.travelers} traveler(s) \u2022 ${trip.tripDuration} days \u2022 ` +
            `\u20AC${Number(trip.totalCost).toFixed(2)}`;

        text.append(title, details);

        const actions = document.createElement("div");
        actions.className = "saved-actions";

        const openBtn = document.createElement("button");
        openBtn.type = "button";
        openBtn.className = "mini-btn primary";
        openBtn.textContent = "Open";
        openBtn.addEventListener("click", () => openSavedTrip(trip.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "mini-btn danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteSavedTrip(trip.id));

        actions.append(openBtn, deleteBtn);
        item.append(text, actions);
        savedTripsBox.appendChild(item);

    });

}

function openSavedTrip(tripId) {

    const trip = getSavedTrips().find(t => t.id === tripId);

    if (!trip) {
        return;
    }

    localStorage.setItem(CURRENT_TRIP_KEY, JSON.stringify(trip));
    loadCurrentTrip();
    saveMessage.textContent = "Trip loaded. Edit it and press Save My Trip to save it again.";
    window.scrollTo({ top: 0, behavior: "smooth" });

}

function deleteSavedTrip(tripId) {

    const trips = getSavedTrips().filter(t => t.id !== tripId);
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips));
    renderSavedTrips();

}

renderSavedTrips();
