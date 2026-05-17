/**
 * @file Handles the interaction logic for the parking lot details side panel.
 * Uses event delegation to listen for clicks on dynamically rendered lot cards.
 */
/**
 * @func Helper function that checks if "Details" button was clicked
 * @params event
 * @returns void
 */
function checkDetailsBtnClick(event) {
    const target = event?.target;
    const hiddenSidePanel = document.querySelector(".details-side-panel");
    const mainSidePanel = document.querySelector(".sidebar");
    // Only slide the hidden panel in IF it's a "Details" button
    if (target.closest(".sp-details-btn") || target.closest(".iw-details-btn")) {
        console.log("Details button clicked!");
        hiddenSidePanel?.classList.add("active");
        mainSidePanel?.classList.add("shifted-out");

        // Fill the panel with the lot data from the clicked card
        var card = target.closest(".lot-card");
        if (card) {
            fillDetailsPanel(card);
        }
    }
}

// Fills the details side panel with data from the clicked lot card
function fillDetailsPanel(card) {
    // Get the lot name from the card heading (use .lot-header-btn h3 to avoid matching sidebar header)
    var lotName = card.querySelector(".lot-header-btn h3").textContent.trim();

    // Find the matching lot in the global parkingLotsData array
    var lot = null;
    for (var i = 0; i < parkingLotsData.length; i++) {
        if (parkingLotsData[i].name === lotName) {
            lot = parkingLotsData[i];
            break;
        }
    }
    if (!lot) return;

    // Set the lot name and address in the panel header
    document.getElementById("peek-name").textContent = lot.name;
    document.getElementById("peek-address").textContent =
        lot.address.street + ", " + lot.address.city + ", " +
        lot.address.province + " " + lot.address.postalCode;

    // Set the availability status badge
    var badge = document.getElementById("peek-status-badge");
    badge.textContent = lot.availability;
    badge.className = "status-badge " + lot.availability.toLowerCase();

    // Set the occupancy progress bar
    var capacity = lot.capacity;
    var open = lot.openSpots;
    var occupied = capacity - open;
    var pct = Math.round((occupied / capacity) * 100);
    document.getElementById("peek-progress-fill").style.width = pct + "%";
    document.getElementById("peek-spots-text").textContent =
        open + " spots open of " + capacity;

    // Set the rate schedule
    var s = lot.schedule;
    document.getElementById("peek-price-day").textContent =
        "$" + s.daytimePrice.toFixed(2) + " / " + s.daytimeRate + " " + s.rateUnit + " – Max $" + s.daytimeMaxPrice;
    document.getElementById("peek-price-evening").textContent =
        "$" + s.eveningPrice.toFixed(2) + " / " + s.eveningRate + " " + s.rateUnit + " – Max $" + s.eveningMaxPrice;
    document.getElementById("peek-price-weekend").textContent =
        "$" + s.weekendPrice.toFixed(2) + " / " + s.weekendRate + " " + s.rateUnit + " – Max $" + s.weekendMaxPrice;
}
/**
 * @func Toggles the visibility of the detailed parking lot info side panel when user click the "Detials" button on either the main side panel or marker pop-up card
 * @params None
 * @returns void
 */
function toggleDetailsHiddenSidePanel() {
    // Listen for clicks on the page
    document?.addEventListener("click", (event) => {
        checkDetailsBtnClick(event);
    });
}
toggleDetailsHiddenSidePanel();

// --- Close the details panel when X button is clicked ---
var closePeekBtn = document.getElementById("close-peek");
var hiddenSidePanel = document.querySelector(".details-side-panel");
var mainSidePanel = document.querySelector(".sidebar");

closePeekBtn.addEventListener("click", function () {
    hiddenSidePanel.classList.remove("active");
    mainSidePanel.classList.remove("shifted-out");
});

// --- Sidebar toggle open/close ---
var sidebarToggleBtn = document.querySelector(".sidebar-toggle");
var sidebar = document.querySelector(".sidebar");

sidebarToggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
});

export {};
