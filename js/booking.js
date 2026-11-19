
const destinationSelect = document.getElementById("destination");
const travelersInput = document.getElementById("travelers");
const totalPrice = document.getElementById("totalPrice");
const bookingForm = document.getElementById("bookingForm");

for (let i = 0; i < destinations.length; i++) {
    let option = document.createElement("option");

    option.value = destinations[i].id;
    option.textContent = destinations[i].name;

    destinationSelect.appendChild(option);
}

function calculatePrice() {
    let destinationId = Number(destinationSelect.value);
    let travelers = Number(travelersInput.value);
    let selectedDestination = null;

    for (let i = 0; i < destinations.length; i++) {
        if (destinations[i].id === destinationId) {
            selectedDestination = destinations[i];
        }
    }

    if (selectedDestination && travelers > 0) {
        totalPrice.textContent = "€" + (selectedDestination.price * travelers);
    } else {
        totalPrice.textContent = "€0";
    }
}

destinationSelect.addEventListener("change", calculatePrice);
travelersInput.addEventListener("input", calculatePrice);

bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let fullName = document.getElementById("fullName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let destinationId = Number(destinationSelect.value);
    let travelers = Number(travelersInput.value);
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;

    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("destinationError").textContent = "";
    document.getElementById("travelersError").textContent = "";
    document.getElementById("startDateError").textContent = "";
    document.getElementById("endDateError").textContent = "";
    document.getElementById("bookingMessage").textContent = "";

    let valid = true;

    if (fullName.length < 3) {
        document.getElementById("nameError").textContent = "Name must have at least 3 characters.";
        valid = false;
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email.";
        valid = false;
    }

    if (phone.length < 6) {
        document.getElementById("phoneError").textContent = "Enter a valid phone number.";
        valid = false;
    }

    if (destinationId === 0) {
        document.getElementById("destinationError").textContent = "Select a destination.";
        valid = false;
    }

    if (!Number.isInteger(travelers) || travelers < 1) {
        document.getElementById("travelersError").textContent = "Enter at least 1 traveler.";
        valid = false;
    }

    if (startDate === "") {
        document.getElementById("startDateError").textContent = "Select a start date.";
        valid = false;
    }

    if (endDate === "") {
        document.getElementById("endDateError").textContent = "Select an end date.";
        valid = false;
    }

    if (startDate !== "" && endDate !== "") {
        if (new Date(startDate) < new Date(new Date().toDateString())) {
            document.getElementById("startDateError").textContent = "Start date cannot be in the past.";
            valid = false;
        }

        if (new Date(endDate) <= new Date(startDate)) {
            document.getElementById("endDateError").textContent = "End date must be after start date.";
            valid = false;
        }
    }

    if (!valid) {
        return;
    }

    let selectedDestination = null;

    for (let i = 0; i < destinations.length; i++) {
        if (destinations[i].id === destinationId) {
            selectedDestination = destinations[i];
        }
    }

    let booking = {
        id: Date.now(),
        fullName: fullName,
        email: email,
        phone: phone,
        destination: selectedDestination.name,
        destinationId: destinationId,
        travelers: travelers,
        startDate: startDate,
        endDate: endDate,
        totalPrice: selectedDestination.price * travelers
    };

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    bookings.push(booking);

    localStorage.setItem("bookings", JSON.stringify(bookings));

    document.getElementById("bookingMessage").textContent =
        "Booking confirmed! Reference TE-" + String(booking.id).slice(-6) +
        " for " + booking.destination + ". You can see it under My bookings below.";

    bookingForm.reset();
    renderBookings();
    totalPrice.textContent = "€0";
});


// ==========================================
// MY BOOKINGS (list of saved bookings)
// ==========================================

const bookingsList = document.getElementById("bookingsList");

function renderBookings() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookingsList.innerHTML = "";

    if (bookings.length === 0) {
        let empty = document.createElement("p");
        empty.className = "empty-message";
        empty.textContent = "No bookings yet. Confirm a booking above and it will appear here.";
        bookingsList.appendChild(empty);
        return;
    }

    bookings.slice().reverse().forEach(function(b) {
        let item = document.createElement("div");
        item.className = "saved-item";

        let text = document.createElement("div");

        let title = document.createElement("h3");
        title.textContent = b.destination + " (TE-" + String(b.id).slice(-6) + ")";

        let details = document.createElement("p");
        details.textContent = b.fullName + " \u2022 " + b.startDate + " to " + b.endDate +
            " \u2022 " + b.travelers + " traveler(s) \u2022 \u20AC" + b.totalPrice;

        text.append(title, details);

        let cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "mini-btn danger";
        cancel.textContent = "Cancel booking";
        cancel.addEventListener("click", function() {
            let remaining = (JSON.parse(localStorage.getItem("bookings")) || [])
                .filter(function(x) { return x.id !== b.id; });
            localStorage.setItem("bookings", JSON.stringify(remaining));
            renderBookings();
        });

        item.append(text, cancel);
        bookingsList.appendChild(item);
    });
}

renderBookings();
