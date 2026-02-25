var studySpots = [
    { id: 1, name: "Quiet Study Room A101", building: "Arts Building", floor: 1, capacity: 4, status: "Available", features: ["Quiet zone", "Whiteboard", "Power outlets"] },
    { id: 2, name: "Group Study Room B205", building: "Science Building", floor: 2, capacity: 8, status: "Reserved", features: ["Whiteboard", "TV screen", "Power outlets"] },
    { id: 3, name: "Silent Study Pod C12", building: "Library", floor: 3, capacity: 2, status: "Pending", features: ["Quiet zone", "Power outlets"] },
    { id: 4, name: "Conference Room D301", building: "Arts Building", floor: 3, capacity: 12, status: "Available", features: ["Projector", "Whiteboard", "Power outlets"] },
    { id: 5, name: "Study Booth E15", building: "Library", floor: 1, capacity: 1, status: "Available", features: ["Quiet zone", "Power outlets"] },
    { id: 6, name: "Team Room F102", building: "Science Building", floor: 1, capacity: 6, status: "Reserved", features: ["Whiteboard", "Power outlets"] }
];

var reservations = [];
var selectedSpot = null;
var selectedTime = null;
var selectedDuration = null;

// Render study spot cards into the browse screen
function renderStudySpots() {
    var container = document.getElementById("spots-grid");
    container.innerHTML = "";

    for (var i = 0; i < studySpots.length; i++) {
        var spot = studySpots[i];
        var card = document.createElement("div");
        card.className = "spot-card";

        var statusClass = spot.status.toLowerCase();

        var buttonHTML = "";
        if (spot.status === "Available") {
            buttonHTML = '<button class="reserve-btn" data-id="' + spot.id + '">Reserve</button>';
        } else {
            buttonHTML = '<button class="view-btn">View</button>';
        }

        card.innerHTML =
            '<h3>' + spot.name + '</h3>' +
            '<p>' + spot.building + ' • Floor ' + spot.floor + '</p>' +
            '<p>Capacity: ' + spot.capacity + (spot.capacity === 1 ? ' person' : ' people') + '</p>' +
            '<div class="card-footer">' +
            '<span class="status ' + statusClass + '">' + spot.status + '</span>' +
            buttonHTML +
            '</div>';

        container.appendChild(card);
    }
}

renderStudySpots();

// Navigation
function showScreen(screenId) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove("active");
    }
    document.getElementById(screenId + "-screen").classList.add("active");

    var links = document.querySelectorAll(".nav-link");
    for (var i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
        if (links[i].getAttribute("data-page") === screenId) {
            links[i].classList.add("active");
        }
    }
}

var navLinks = document.querySelectorAll(".nav-link");
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function (e) {
        e.preventDefault();
        var page = this.getAttribute("data-page");
        showScreen(page);
    });
}

// Handle clicking Reserve on a spot card
document.getElementById("spots-grid").addEventListener("click", function (e) {
    if (e.target.classList.contains("reserve-btn")) {
        var spotId = parseInt(e.target.getAttribute("data-id"));
        openReserveScreen(spotId);
    }
});

function openReserveScreen(spotId) {
    selectedSpot = null;
    for (var i = 0; i < studySpots.length; i++) {
        if (studySpots[i].id === spotId) {
            selectedSpot = studySpots[i];
            break;
        }
    }
    if (!selectedSpot) return;

    document.getElementById("selected-name").textContent = selectedSpot.name;
    document.getElementById("selected-details").textContent = selectedSpot.building + " • Floor " + selectedSpot.floor;
    document.getElementById("selected-capacity").textContent = "Capacity: " + selectedSpot.capacity + (selectedSpot.capacity === 1 ? " person" : " people");

    // show features
    var featuresList = document.getElementById("selected-features");
    featuresList.innerHTML = "";
    for (var i = 0; i < selectedSpot.features.length; i++) {
        var li = document.createElement("li");
        li.textContent = selectedSpot.features[i];
        featuresList.appendChild(li);
    }

    // set default date to today
    var today = new Date().toISOString().split("T")[0];
    document.getElementById("reserve-date").value = today;

    // reset selections
    selectedTime = null;
    selectedDuration = null;
    var allSlots = document.querySelectorAll(".slot-btn");
    for (var i = 0; i < allSlots.length; i++) {
        allSlots[i].classList.remove("active");
    }

    showScreen("reserve");
}

// Time slot selection
var timeSlots = document.querySelectorAll("#time-slots .slot-btn");
for (var i = 0; i < timeSlots.length; i++) {
    timeSlots[i].addEventListener("click", function () {
        for (var j = 0; j < timeSlots.length; j++) {
            timeSlots[j].classList.remove("active");
        }
        this.classList.add("active");
        selectedTime = this.getAttribute("data-time");
    });
}

// Duration selection
var durationBtns = document.querySelectorAll("#duration-btns .slot-btn");
for (var i = 0; i < durationBtns.length; i++) {
    durationBtns[i].addEventListener("click", function () {
        for (var j = 0; j < durationBtns.length; j++) {
            durationBtns[j].classList.remove("active");
        }
        this.classList.add("active");
        selectedDuration = parseInt(this.getAttribute("data-duration"));
    });
}

// Calculate end time from start time + duration
function getEndTime(startTime, hours) {
    var parts = startTime.split(" ");
    var timeParts = parts[0].split(":");
    var hour = parseInt(timeParts[0]);
    var period = parts[1];

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    hour += hours;
    var endPeriod = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    return hour + ":00 " + endPeriod;
}

// Confirm reservation
document.getElementById("confirm-btn").addEventListener("click", function () {
    var date = document.getElementById("reserve-date").value;

    if (!selectedTime || !selectedDuration || !date) {
        alert("Please fill in all fields.");
        return;
    }

    var endTime = getEndTime(selectedTime, selectedDuration);

    var reservation = {
        id: reservations.length + 1,
        spotId: selectedSpot.id,
        name: selectedSpot.name,
        building: selectedSpot.building,
        floor: selectedSpot.floor,
        date: date,
        startTime: selectedTime,
        endTime: endTime,
        status: "Confirmed"
    };

    reservations.push(reservation);
    showScreen("reservations");
});

// Cancel goes back to browse
document.getElementById("cancel-btn").addEventListener("click", function () {
    showScreen("browse");
});
