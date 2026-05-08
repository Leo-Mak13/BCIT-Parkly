// This is the map logic

declare const parkingLotsData: any[];

//  Request the needed libraries
const [{ Map: GoogleMap }, { AdvancedMarkerElement }] = await Promise.all([
  google.maps.importLibrary("maps") as Promise<google.maps.MapsLibrary>,
  google.maps.importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
]);

function addMarker(markerClass: any, map: any, lot: any) {
  new markerClass({
    map: map,
    position: { lat: lot.latitude, lng: lot.longitude },
    title: lot.name,
  });
}

async function initMap(): Promise<void> {
  // Get the gmp-map element
  const mapElement = document.querySelector(
    "gmp-map",
  ) as google.maps.MapElement;

  const innerMap = mapElement.innerMap; // get the inner map
  const bounds = new google.maps.LatLngBounds(); // create bounds for zoom level based on markers

  parkingLotsData.forEach((lot: any) => {
    const position = { lat: lot.latitude, lng: lot.longitude };
    bounds.extend(position);
    addMarker(AdvancedMarkerElement, innerMap, lot);
  });

  if (mapElement.center) {
    bounds.extend(mapElement.center);
  }

  const mapPadding = {
    top: 50,
    right: 50,
    bottom: 900,
    left: 50,
  };
  innerMap.fitBounds(bounds, mapPadding);

  google.maps.event.addListenerOnce(innerMap, "idle", () => {
    const currentZoom = innerMap.getZoom();

    if (currentZoom) {
      innerMap.setZoom(currentZoom - 1.5);
    }
  });

  // Set map options
  innerMap.setOptions({
    mapTypeControl: false,
  });

  // Add a marker positioned at the map center (DTC)
  new AdvancedMarkerElement({
    map: innerMap,
    position: { lat: 49.2835, lng: -123.1153 },
    title: "BCIT DTC",
  });
}

initMap();

export {};
