/**
 * @file This file handles the initialization and logic for the Google Map,
 * including dynamic marker placement, automated camera bounds, and custom UI padding.
 */
// Request the needed libraries
const [{ Map }, { AdvancedMarkerElement, PinElement }] = await Promise.all([
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
    new markerClass({
        map: map,
        position: { lat: lot.latitude, lng: lot.longitude },
        title: lot.name,
        content: markerImg,
    });
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
