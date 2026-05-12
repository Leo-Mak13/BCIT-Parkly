/**
 * @file This file handles the initialization and logic for the Google Map,
 * including dynamic marker and pop-up info window placement.
 */
let timer; //global timer for info window pop-ups
// Request the needed libraries
const [{ Map, InfoWindow }, { AdvancedMarkerElement, PinElement }] = await Promise.all([
    google.maps.importLibrary("maps"),
    google.maps.importLibrary("marker"),
]);
// Create a shared pop-up object for all markers on the map
let popupMarker = new AdvancedMarkerElement({
    map: null,
});
/**
 * @func Creates HTML element for the parking lot info windows
 * @params lot
 * @returns HTML element
 */
function generateHTMLElement(lot) {
    // Create the info window content
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
    <style>
      .info-window { 
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
        padding: 0px;
        display: flex;
        flex-direction: column;
        width: 150px;
        pointer-events: auto;
        margin-bottom: 100px; 
        background: white;
        padding: 10px;
        border-radius: 8px;
        position: relative;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }

      .info-window::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 10px;
        border-style: solid;
        border-color: white transparent transparent transparent;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
      }

      .iw-title {
        color: #0e6ac5;
        margin: 0 0 4px 0;
        font-size: 13px;
        font-weight: bold;
        line-height: 1.2;
      }

      .iw-address, .iw-description {
        margin: 0;
        font-size: 12px;
        color: #333;
        line-height: 1.3;
      }

      .iw-description {
        margin: 2px 0;
      }

      .iw-details-btn { 
        background-color: #0e6ac5; 
        color: white;
        padding: 10px 0;
        border: 1.5px #0a549e solid;
        border-radius: 4px; 
        text-decoration: none;
        display: block;
        width: 99%;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        margin-top: 5px;
      }

      .iw-details-btn:hover { 
        color: #0a549e;
        background-color: white;
        border: 1.5px #0a549e solid;
        width: 99%;
        transition: 0.4s ease;
      }

      .iw-status p {
        display: flex;
        flex-direction: row;
        padding: 0.5rem 0 0.6rem 0;
        gap: 0.5rem;
        align-items: center;
        font-size: 0.7rem;
        border-radius: 4px;
        padding: 8px 7px;
        font-weight: bold;
      }

      .iw-available {
        color: rgb(1, 78, 1);
        background-color: rgb(188, 246, 188);
        border: 1px rgb(19, 186, 19) solid;
      }

      .iw-limited {
        color: rgb(133, 100, 4);
        background-color: rgb(255, 243, 205);
        border: 1px rgb(255, 193, 7) solid;
      }

      .iw-full {
        color: rgb(132, 32, 41);
        background-color: rgb(248, 215, 218);
        border: 1px rgb(220, 53, 69) solid;
      }
    </style>

    <div class="info-window">
      <h4 class="iw-title">${lot.name}</h4>
      <p class="iw-address">${lot.address.street}, ${lot.address.city}</p>
      <p class="iw-address">${lot.address.province} ${lot.address.postalCode}</p>
      <div class="iw-status">
        <p class="iw-${lot.availability.toLowerCase()}">${lot.availability}</p>
      </div>
      <p class="iw-description">${lot.description}</p>
      <a class="iw-details-btn">Details →</a>
    </div>
  `;
    return wrapper;
}
/**
 * @func Creates and places a single customized marker with a pop-up info window on the provided map instance based on lot availability
 * @params markerClass, map, lot, type
 * @returns void
 */
function addMarkerAndInfoWindow(markerClass, map, lot, type) {
    const markerImg = document.createElement("img"); // img element for markers
    // Pick markr color based on availability (special marker for DTC)
    if (type === "DTC") {
        markerImg.src = "/assets/marker-dtc.png";
    }
    else if (type.toLowerCase() === "available") {
        markerImg.src = "/assets/marker-green.png";
    }
    else if (type.toLowerCase() === "limited") {
        markerImg.src = "/assets/marker-orange.png";
    }
    else if (type.toLowerCase() === "full") {
        markerImg.src = "/assets/marker-red.png";
    }
    markerImg.style.width = "85px";
    markerImg.style.height = "auto";
    const marker = new markerClass({
        map: map,
        position: { lat: lot.latitude, lng: lot.longitude },
        title: lot.name,
        content: markerImg,
        gmpClickable: true,
    });
    if (type !== "DTC") {
        // Open the info window when user hovers over the marker
        marker.addEventListener("pointerenter", () => {
            popupMarker.addEventListener("pointerenter", () => {
                console.log("Timer cleared.");
                clearTimeout(timer);
            });
            // If the user leaves the info window, wait 300ms then close it
            popupMarker.addEventListener("pointerleave", () => {
                timer = setTimeout(() => {
                    console.log("Starting timer.");
                    popupMarker.map = null;
                }, 300);
            });
            popupMarker.position = { lat: lot.latitude, lng: lot.longitude };
            popupMarker.content = generateHTMLElement(lot);
            popupMarker.map = map;
        });
        // Wait 300ms then close the info window when user leaves the marker
        marker.addEventListener("pointerleave", () => {
            timer = setTimeout(() => {
                popupMarker.map = null;
            }, 300);
        });
    }
}
/**
 * @func Initializes the map, processes parking lot data, and adjusts the viewport
 * @params None
 * @returns A promise that resolves when the map is initialized
 */
async function initMap() {
    // Get the gmp-map element
    const mapElement = document.querySelector("gmp-map");
    const innerMap = mapElement.innerMap; // get the inner map
    // Add marker for each parking lot
    parkingLotsData.forEach((lot) => {
        addMarkerAndInfoWindow(AdvancedMarkerElement, innerMap, lot, lot.availability);
    });
    const DTCLot = {
        latitude: 49.2835,
        longitude: -123.1153,
        title: "BCIT DTC",
    };
    // Add a marker positioned at the map center (DTC)
    addMarkerAndInfoWindow(AdvancedMarkerElement, innerMap, DTCLot, "DTC");
    // Get map ID from .env file
    const mapIdElement = document.querySelector("gmp-map");
    const mapIdFromEnv = mapIdElement?.getAttribute("map-id");
    // Set map options
    innerMap.setOptions({
        mapTypeControl: false,
        tilt: 45,
        heading: 0,
        mapId: mapIdFromEnv,
    });
}
initMap();
export {};
