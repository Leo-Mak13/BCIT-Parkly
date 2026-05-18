/**
 * @file Handles the interaction logic for the parking lot details side panel.
 * Uses event delegation to listen for clicks on dynamically rendered lot cards.
 */

declare const parkingLotsData: any[];

/**
 * @func Populates the details side panel with the clicked lot's data
 * @params lot - the parking lot object from parkingLotsData
 * @returns void
 */
function populateDetailsPanel(lot: any): void {
  // Set the street view Google Maps image in the panel header
  const apiKey = (window as any).GOOGLE_MAPS_API_KEY_CONFIG?.key;

  if (apiKey && lot) {
    const lotImg = document.getElementById("peek-img") as HTMLImageElement;

    if (lotImg) {
      lotImg.src = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lot.latitude},${lot.longitude}&radius=200&source=outdoor&key=${apiKey}`;
      console.log("Image URL set to:", lotImg.src);
    }
  } else {
    console.error(
      "Google Maps API Key configuration object was not found on window scope.",
    );
  }

  // Set the lot name and address in the panel header
  (document.getElementById("peek-name") as HTMLElement).textContent = lot.name;
  (document.getElementById("peek-address") as HTMLElement).textContent =
    lot.address.street +
    ", " +
    lot.address.city +
    ", " +
    lot.address.province +
    " " +
    lot.address.postalCode;

  // Set the availability status badge
  const statusBadge = document.getElementById(
    "peek-status-badge",
  ) as HTMLElement;
  statusBadge.textContent = lot.availability;
  statusBadge.className = "status-badge " + lot.availability.toLowerCase();

  // Calculate and show the occupancy progress bar
  const totalSpots: number = lot.capacity;
  const openSpots: number = lot.openSpots;
  const occupiedSpots: number = totalSpots - openSpots;
  const occupancyPercent: number =
    totalSpots > 0 ? (occupiedSpots / totalSpots) * 100 : 0;

  (document.getElementById("peek-progress-fill") as HTMLElement).style.width =
    occupancyPercent + "%";
  (document.getElementById("peek-spots-text") as HTMLElement).textContent =
    openSpots + " spots open of " + totalSpots;

  // Set the rate schedule prices
  (document.getElementById("peek-price-day") as HTMLElement).textContent =
    "$" +
    lot.schedule.daytimePrice.toFixed(2) +
    " / " +
    lot.schedule.daytimeRate +
    " " +
    lot.schedule.rateUnit;
  (document.getElementById("peek-price-evening") as HTMLElement).textContent =
    "$" +
    lot.schedule.eveningPrice.toFixed(2) +
    " / " +
    lot.schedule.eveningRate +
    " " +
    lot.schedule.rateUnit;
  (document.getElementById("peek-price-weekend") as HTMLElement).textContent =
    "$" +
    lot.schedule.weekendPrice.toFixed(2) +
    " / " +
    lot.schedule.weekendRate +
    " " +
    lot.schedule.rateUnit;

  // Wire up the Reserve button to go to the new reservation page for this lot
  const reserveBtn = document.querySelector(
    ".reserve-now-btn",
  ) as HTMLButtonElement;
  reserveBtn.onclick = () => {
    window.location.href = "/reserve/reservations/new?lotId=" + lot.lotId;
  };
}

/**
 * @func Opens the details side panel and slides the main sidebar out
 * @params lot - the parking lot object to display
 * @returns void
 */
export function openDetailsPanel(lot: any): void {
  const hiddenSidePanel = document.querySelector(".details-side-panel");
  populateDetailsPanel(lot);
  hiddenSidePanel?.classList.add("active");
}

/**
 * @func Closes the details side panel and brings the main sidebar back
 * @params None
 * @returns void
 */
function closeDetailsPanel(): void {
  const hiddenSidePanel = document.querySelector(".details-side-panel");

  hiddenSidePanel?.classList.remove("active");
}

/**
 * @func Helper function that checks if "Details" button was clicked
 * @params event
 * @returns void
 */
function checkDetailsBtnClick(event: Event): void {
  const target = event?.target as HTMLElement;

  // Check if the close button was clicked
  if (target.closest("#close-peek")) {
    closeDetailsPanel();
    return;
  }

  // Check if a lot card "Details" button was clicked (sidebar)
  const spBtn = target.closest(".sp-details-btn");
  if (spBtn) {
    const btnId = Number(spBtn.getAttribute("data-id"));
    const lot = parkingLotsData.find((l: any) => l.lotId === btnId);

    if (lot) {
      console.log("Details button clicked for lot:", lot.name);
      openDetailsPanel(lot);
    } else {
      console.error("Could not find matching lot data for ID:", btnId);
    }
    return;
  }

  // Check if a map marker info window "Details" button was clicked
  const iwBtn = target.closest(".iw-details-btn");
  if (iwBtn) {
    const lotName = (iwBtn as HTMLElement).getAttribute("data-lot-name");
    const lot = parkingLotsData.find((l: any) => l.name === lotName);

    if (lot) {
      console.log("Map marker Details button clicked for lot:", lot.name);
      openDetailsPanel(lot);
    }
    return;
  }
}

/**
 * @func Toggles the visibility of the detailed parking lot info side panel when user clicks the "Details" button on either the main side panel or marker pop-up card
 * @params None
 * @returns void
 */
function toggleDetailsHiddenSidePanel(): void {
  // Listen for clicks on the page
  document?.addEventListener("click", (event: Event) => {
    checkDetailsBtnClick(event);
  });
}

toggleDetailsHiddenSidePanel();

/**
 * @func Handles the sidebar collapse/expand toggle button
 * @params None
 * @returns void
 */
function setupSidebarToggle(): void {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.querySelector(".sidebar-toggle");
  const reopenBtn = document.getElementById("sidebar-reopen-btn");

  // Collapse the sidebar when the toggle button is clicked
  toggleBtn?.addEventListener("click", () => {
    sidebar?.classList.add("collapsed");

    // Show the re-open button on the map area
    if (reopenBtn) {
      (reopenBtn as HTMLElement).style.display = "block";
    }
  });

  // Expand the sidebar when the re-open button is clicked
  reopenBtn?.addEventListener("click", () => {
    sidebar?.classList.remove("collapsed");

    // Hide the re-open button again
    if (reopenBtn) {
      (reopenBtn as HTMLElement).style.display = "none";
    }
  });
}

setupSidebarToggle();
