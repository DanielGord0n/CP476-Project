// Mock data for study spots
var studySpots = [
    { id: 1, name: "Quiet Study Room A101", building: "Arts Building", floor: 1, capacity: 4, status: "Available" },
    { id: 2, name: "Group Study Room B205", building: "Science Building", floor: 2, capacity: 8, status: "Reserved" },
    { id: 3, name: "Silent Study Pod C12", building: "Library", floor: 3, capacity: 2, status: "Pending" },
    { id: 4, name: "Conference Room D301", building: "Arts Building", floor: 3, capacity: 12, status: "Available" },
    { id: 5, name: "Study Booth E15", building: "Library", floor: 1, capacity: 1, status: "Available" },
    { id: 6, name: "Team Room F102", building: "Science Building", floor: 1, capacity: 6, status: "Reserved" }
];

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

// Run on page load
renderStudySpots();

// Navigation between screens
function showScreen(screenId) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove("active");
    }
    document.getElementById(screenId + "-screen").classList.add("active");

    // update active nav link
    var links = document.querySelectorAll(".nav-link");
    for (var i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
        if (links[i].getAttribute("data-page") === screenId) {
            links[i].classList.add("active");
        }
    }
}

// attach click handlers to nav links
var navLinks = document.querySelectorAll(".nav-link");
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function (e) {
        e.preventDefault();
        var page = this.getAttribute("data-page");
        showScreen(page);
    });
}
