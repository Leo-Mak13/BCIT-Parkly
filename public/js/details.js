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
function toggleDetailsHiddenSidePanel() {
    // Listen for clicks on the page
    document?.addEventListener("click", (event) => {
        checkDetailsBtnClick(event);
    });
}
toggleDetailsHiddenSidePanel();
function getLotData() {
    const detailsBtn = document.querySelectorAll(".sp-details-btn");
    let targetLot;
    // Loop through all "Details" buttons on the screen and assign an event listener to each button
    for (const dBtn of detailsBtn) {
        dBtn?.addEventListener("click", (event) => {
            const target = event?.target;
            const btnId = target.getAttribute("data-id");
            targetLot = parkingLotsData.find((lot) => lot.lotId === btnId);
            // Inject the data into the empty HTML elements
        });
    }
}
getLotData();
export {};
