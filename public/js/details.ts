/**
 * @file Handles the interaction logic for the parking lot details side panel.
 * Uses event delegation to listen for clicks on dynamically rendered lot cards.
 */

declare const parkingLotsData: any[];

/**
 * @func Helper function that checks if "Details" button was clicked
 * @params event
 * @returns void
 */
function checkDetailsBtnClick(event: Event): void {
  const target = event?.target as HTMLElement;
  const hiddenSidePanel = document.querySelector(".details-side-panel");
  const mainSidePanel = document.querySelector(".sidebar");

  // Only slide the hidden panel in IF it's a "Detials" button
  if (target.closest(".sp-details-btn") || target.closest(".iw-details-btn")) {
    console.log("Details button clicked!");
    hiddenSidePanel?.classList.add("active");
    mainSidePanel?.classList.add("shifted-out");
  }
}

/**
 * @func Toggles the visibility of the detailed parking lot info side panel when user click the "Detials" button on either the main side panel or marker pop-up card
 * @params None
 * @returns void
 */

function toggleDetailsHiddenSidePanel(): void {
  // Listen for clicks on the page
  document?.addEventListener("click", (event) => {
    checkDetailsBtnClick(event);
  });
}

toggleDetailsHiddenSidePanel();

function getLotData(): void {
  const detailsBtn = document.querySelectorAll(".sp-details-btn");
  let targetLot: any;

  // Loop through all "Details" buttons on the screen and assign an event listener to each button
  for (const dBtn of detailsBtn) {
    dBtn?.addEventListener("click", (event: Event) => {
      const target = event?.target as HTMLElement;
      const btnId = target.getAttribute("data-id");
      targetLot = parkingLotsData.find((lot: any) => lot.lotId === btnId);

      // Inject the data into the empty HTML elements
    });
  }
}

getLotData();
