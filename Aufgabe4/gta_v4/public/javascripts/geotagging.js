// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {

    //Benoetigte Felder finden und speichern
    let latitudeFieldTag = document.getElementById('latitude');
    let longitudeFieldTag = document.getElementById('longitude');
    let latitudeFieldDiscovery = document.getElementById('latitude_search');
    let longitudeFieldDiscovery = document.getElementById('longitude_search');
    let mapView = document.getElementById("mapView");

    //aktuelle Position aus dem Formular entnehmen und speichern
    var currentLatitude = latitudeFieldTag.value;
    var currentLongitude = longitudeFieldTag.value;

    //MapManager initalisieren
    let mapManager = new MapManager();

    //überprüfen ob Position leer, nur dann muss die Position bestimmt werden
    if(currentLatitude == '' || currentLongitude == '') {
        // #### Callback Methode aufrufen (finden der aktuellen Position) #### 
        LocationHelper.findLocation((helper) => {
        
            // ###### Position aktualisieren ######

            //Aktuelle Position speichern
            let latitude = helper.latitude;
            let longitude = helper.longitude;

            //Aktuelle Position in die Felder des Tagging Formulars schreiben
            latitudeFieldTag.value = latitude;
            longitudeFieldTag.value = longitude;

            //Aktuelle Position in die Felder des Discovery Formulars schreiben
            latitudeFieldDiscovery.value = latitude;
            longitudeFieldDiscovery.value = longitude;

            // ###### Map aktualisieren ######

            //Map mit aktueller Positon aktualisieren
            mapManager.initMap(latitude,longitude);
            mapManager.updateMarkers(latitude,longitude);

            //Platzhalter der Map entfernen
            mapView.nextElementSibling.remove();
            mapView.remove();
        
        }) ;
    } else {

        let taglist_json = document.getElementById('map').dataset.tags;
        let taglist = JSON.parse(taglist_json);

        //Map mit der Ergebnisliste aus der Suche aktualisieren
        mapManager.initMap(currentLatitude,currentLongitude);
        mapManager.updateMarkers(currentLatitude,currentLongitude, taglist);

        //Platzhalter der Map entfernen
        mapView.nextElementSibling.remove();
        mapView.remove();
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});