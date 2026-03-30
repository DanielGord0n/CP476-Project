// API base URL - change this if backend is hosted somewhere else
var API_URL = "http://localhost:3000/api";

// simple fetch helpers
function apiGet(endpoint) {
    return fetch(API_URL + endpoint).then(function (res) {
        return res.json();
    });
}

function apiPost(endpoint, body) {
    return fetch(API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }).then(function (res) {
        return res.json();
    });
}

function apiPut(endpoint, body) {
    return fetch(API_URL + endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }).then(function (res) {
        return res.json();
    });
}

function apiDelete(endpoint) {
    return fetch(API_URL + endpoint, {
        method: "DELETE"
    }).then(function (res) {
        return res.json();
    });
}

// fallback data in case backend isn't available
var fallbackSpots = [
    { id: 1, name: "Quiet Study Room A101", building: "Arts Building", floor: 1, capacity: 4, status: "Available", features: ["Quiet zone", "Whiteboard", "Power outlets"] },
    { id: 2, name: "Group Study Room B205", building: "Science Building", floor: 2, capacity: 8, status: "Reserved", features: ["Whiteboard", "TV screen", "Power outlets"] },
    { id: 3, name: "Silent Study Pod C12", building: "Library", floor: 3, capacity: 2, status: "Pending", features: ["Quiet zone", "Power outlets"] },
    { id: 4, name: "Conference Room D301", building: "Arts Building", floor: 3, capacity: 12, status: "Available", features: ["Projector", "Whiteboard", "Power outlets"] },
    { id: 5, name: "Study Booth E15", building: "Library", floor: 1, capacity: 1, status: "Available", features: ["Quiet zone", "Power outlets"] },
    { id: 6, name: "Team Room F102", building: "Science Building", floor: 1, capacity: 6, status: "Reserved", features: ["Whiteboard", "Power outlets"] }
];

var studySpots = [];
var reservations = [];
var selectedSpot = null;
var selectedTime = null;
var selectedDuration = null;

// load spots from backend, fall back to hardcoded if it fails
function loadStudySpots() {
    apiGet("/spots").then(function (res) {
        if (res.data && res.data.length > 0) {
            studySpots = res.data;
        } else {
            studySpots = fallbackSpots;
        }
        renderStudySpots(studySpots);
    }).catch(function () {
        studySpots = fallbackSpots;
        renderStudySpots(studySpots);
    });
}

// render spot cards into the browse grid
function renderStudySpots(spots) {
    var container = document.getElementById("spots-grid");
    container.innerHTML = "";

    for (var i = 0; i < spots.length; i++) {
        var spot = spots[i];
        var card = document.createElement("div");
        card.className = "spot-card";

        var statusClass = (spot.status || "available").toLowerCase();

        var buttonHTML = "";
        if (statusClass === "available") {
            buttonHTML = '<button class="reserve-btn" data-id="' + spot.id + '">Reserve</button>';
        } else {
            buttonHTML = '<button class="view-btn">View</button>';
        }

        card.innerHTML =
            '<h3>' + spot.name + '</h3>' +
            '<p>' + (spot.building || "") + ' • Floor ' + spot.floor + '</p>' +
            '<p>Capacity: ' + spot.capacity + (spot.capacity === 1 ? ' person' : ' people') + '</p>' +
            '<div class="card-footer">' +
            '<span class="status ' + statusClass + '">' + (spot.status || "Available") + '</span>' +
            buttonHTML +
            '</div>';

        container.appendChild(card);
    }
}

loadStudySpots();

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

    // re-render reservations when switching to that screen
    if (screenId === "reservations") {
        renderReservations();
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

// convert date + "11:00 AM" string into ISO format like "2026-03-30T11:00:00"
function toISODateTime(date, timeStr) {
    var parts = timeStr.split(" ");
    var timeParts = parts[0].split(":");
    var hour = parseInt(timeParts[0]);
    var period = parts[1];

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    var hourStr = hour < 10 ? "0" + hour : "" + hour;
    return date + "T" + hourStr + ":00:00";
}

// Confirm reservation - posts to backend
document.getElementById("confirm-btn").addEventListener("click", function () {
    var date = document.getElementById("reserve-date").value;

    if (!selectedTime || !selectedDuration || !date) {
        alert("Please select a date, time slot, and duration.");
        return;
    }

    var endTime = getEndTime(selectedTime, selectedDuration);
    var startISO = toISODateTime(date, selectedTime);
    var endISO = toISODateTime(date, endTime);

    var body = {
        user_id: 1,
        spot_id: selectedSpot.id,
        start_time: startISO,
        end_time: endISO,
        status: "confirmed"
    };

    apiPost("/reservations", body).then(function (res) {
        // build a local copy for immediate display
        var newRes = {
            id: res.body ? res.body.reservation_id : reservations.length + 1,
            spotId: selectedSpot.id,
            name: selectedSpot.name,
            building: selectedSpot.building,
            floor: selectedSpot.floor,
            date: date,
            startTime: selectedTime,
            endTime: endTime,
            status: "Confirmed"
        };
        reservations.push(newRes);
        showScreen("reservations");
    }).catch(function () {
        alert("Could not save reservation. Please try again.");
    });
});

// Cancel goes back to browse
document.getElementById("cancel-btn").addEventListener("click", function () {
    showScreen("browse");
});

// Format date string for display
function formatDate(dateStr) {
    var parts = dateStr.split("-");
    var date = new Date(parts[0], parts[1] - 1, parts[2]);
    var months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

// Render reservations list
function renderReservations() {
    var container = document.getElementById("reservations-list");
    container.innerHTML = "";

    for (var i = 0; i < reservations.length; i++) {
        var res = reservations[i];
        var card = document.createElement("div");
        card.className = "reservation-card";

        var statusClass = res.status === "Cancelled" ? "reservation-status status-cancelled" : "reservation-status";

        card.innerHTML =
            '<div class="reservation-info">' +
            '<h3>' + res.name + '</h3>' +
            '<p>' + res.building + ' • Floor ' + res.floor + '</p>' +
            '<p>' + formatDate(res.date) + ' • ' + res.startTime + ' - ' + res.endTime + '</p>' +
            '</div>' +
            '<div class="reservation-right">' +
            '<span class="' + statusClass + '">' + res.status + '</span>' +
            '<button class="action-btn" onclick="console.log(\'Viewing reservation ' + res.id + '\')">View</button>' +
            '<button class="action-btn" onclick="console.log(\'Editing reservation ' + res.id + '\')">Edit</button>' +
            '<button class="action-btn" onclick="cancelReservation(' + res.id + ')">Cancel</button>' +
            '</div>';

        container.appendChild(card);
    }
}

function cancelReservation(id) {
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].id === id) {
            reservations[i].status = "Cancelled";
            break;
        }
    }
    renderReservations();
}

// Busy Times heatmap data
// Each row is a day, each value is usage level for a 2-hour block (8AM-10PM)
var usageData = {
    "Mon": ["low", "medium", "medium", "high", "medium", "medium", "low", "low"],
    "Tue": ["low", "high", "high", "high", "medium", "low", "medium", "low"],
    "Wed": ["low", "medium", "high", "high", "high", "medium", "low", "low"],
    "Thu": ["low", "high", "high", "high", "high", "medium", "medium", "low"],
    "Fri": ["low", "medium", "high", "high", "medium", "medium", "low", "low"]
};

var timeHeaders = ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"];

function renderHeatmap() {
    var grid = document.getElementById("heatmap-grid");
    grid.innerHTML = "";

    // empty top-left corner
    var corner = document.createElement("div");
    grid.appendChild(corner);

    // time headers
    for (var i = 0; i < timeHeaders.length; i++) {
        var header = document.createElement("div");
        header.className = "heatmap-header";
        header.textContent = timeHeaders[i];
        grid.appendChild(header);
    }

    // rows for each day
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    for (var d = 0; d < days.length; d++) {
        var dayLabel = document.createElement("div");
        dayLabel.className = "heatmap-day";
        dayLabel.textContent = days[d];
        grid.appendChild(dayLabel);

        var levels = usageData[days[d]];
        for (var t = 0; t < levels.length; t++) {
            var cell = document.createElement("div");
            cell.className = "heatmap-cell " + levels[t];
            grid.appendChild(cell);
        }
    }
}

renderHeatmap();
