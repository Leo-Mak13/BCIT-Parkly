// This is the map logic

async function initMap(): Promise<void> {
  //  Request the needed libraries
  const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
    google.maps.importLibrary("maps") as Promise<google.maps.MapsLibrary>,
    google.maps.importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
  ]);
  // Get the gmp-map element
  const mapElement = document.querySelector(
    "gmp-map",
  ) as google.maps.MapElement;

  // Get the inner map
  const innerMap = mapElement.innerMap;

  // Set map options
  innerMap.setOptions({
    mapTypeControl: false,
  });

  // Add a marker positioned at the map center (DTC)
  const marker = new AdvancedMarkerElement({
    map: innerMap,
    position: mapElement.center,
    title: "BCIT DTC",
  });
}

initMap();
