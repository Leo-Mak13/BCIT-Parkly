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
    if (target.classList.contains(".sp-details-btn") ||
        target.classList.contains(".iw-details-btn")) {
        console.log("Details button clicked!");
        hiddenSidePanel?.classList.add("active");
    }
}
/**
 * @func Toggles the visibility of the detailed parking lot info side panel when user click the "Detials" button on either the main side panel or marker pop-up card
 * @params None
 * @returns void
 */
function toggleDetailsHiddenSidePanel() {
    // Get main and hidden side panel HTML elements
    const mainSidePanel = document.querySelector(".parking-list");
    const markerInfoWindow = document.querySelector(".info-window");
    // Listen for clicks on "Detials" button on the main side panel
    mainSidePanel?.addEventListener("click", (event) => {
        checkDetailsBtnClick(event);
    });
    // Listen for clicks on "Detials" button on the marker pop-up cards
    markerInfoWindow?.addEventListener("click", (event) => {
        checkDetailsBtnClick(event);
    });
}
toggleDetailsHiddenSidePanel();
export {};
