/**
 * @file This file handles the initialization and logic for the Google Map,
 * including dynamic marker placement, automated camera bounds, and custom UI padding.
 */
// Request the needed libraries
const [{ Map, InfoWindow }, { AdvancedMarkerElement, PinElement }] = await Promise.all([
    google.maps.importLibrary("maps"),
    google.maps.importLibrary("marker"),
]);
/**
 * @func Creates and places a single customized marker on the provided map instance based on lot availability
 * @params markerClass, map, lot, type
 * @returns void
 */
function addMarker(markerClass, map, lot, type) {
    const markerImg = document.createElement("img"); // img element for markers
    // Pick markr color based on availability (special marker for DTC)
    if (type === "DTC") {
        markerImg.src = "../assets/marker-dtc.png";
    }
    else if (type.toLowerCase() === "available") {
        markerImg.src = "../assets/marker-green.png";
    }
    else if (type.toLowerCase() === "limited") {
        markerImg.src = "../assets/marker-orange.png";
    }
    else if (type.toLowerCase() === "full") {
        markerImg.src = "../assets/marker-red.png";
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
        const infoWindow = addInfoWindow(lot);
        // Open the info window when the marker is clicked
        marker.addEventListener("click", () => {
            infoWindow.open({
                anchor: marker,
                map: map,
            });
        });
    }
}
/**
 * @func Creates and places a single customized info window on each parking lot marker
 * @params lot
 * @returns An InfoWindow object
 */
function addInfoWindow(lot) {
    // Create the info window content
    const contentString = `
    <style>
      .info-window { 
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
        padding: 0px;
        display: flex;
        flex-direction: column;
        width: 150px;
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
        border-radius: 4px; 
        text-decoration: none;
        display: block;
        width: 100%;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        margin-top: 5px;
      }

      .iw-details-btn:hover { 
        background-color: #0a549e;
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
      <a href="/lots/${lot.lotId}" class="iw-details-btn">Details →</a>
    </div>
  `;
    // Create the info window
    const newInfoWindow = new InfoWindow({
        content: contentString,
    });
    return newInfoWindow;
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
        addMarker(AdvancedMarkerElement, innerMap, lot, lot.availability);
    });
    const DTCmarkerImg = document.createElement("img"); // create img element for custom marker
    DTCmarkerImg.src = "../assets/map-marker-orange.png";
    DTCmarkerImg.style.width = "85px";
    DTCmarkerImg.style.height = "auto";
    const DTCLot = {
        latitude: 49.2835,
        longitude: -123.1153,
        title: "BCIT DTC",
        content: DTCmarkerImg,
    };
    // Add a marker positioned at the map center (DTC)
    addMarker(AdvancedMarkerElement, innerMap, DTCLot, "DTC");
    // Set map options
    innerMap.setOptions({
        mapTypeControl: false,
        tilt: 45,
        heading: 0,
        mapId: "8278b06836e5e0a728cb592b",
    });
}
initMap();
export {};
