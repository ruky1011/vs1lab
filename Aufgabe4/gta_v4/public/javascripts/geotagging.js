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

// #### Initialisiert die MapManager Klasse -> soll nur einmalig geladen werden ####
function initMapManager() {
    //MapManager initalisieren
    mapManager = new MapManager();
}

// #### Sucht die aktuelle Position und/oder aktualisiert die Ergebnisliste und die Map ####
// Aktuelle Position vorhanden?
// Nein? -> suche aktuelle Position und lade diese in das Tagging- und das Discovery-Formular, lade die Karte mit dem aktuellen Standort
// Ja? -> aktualisiert die Ergebnisliste und die Map mit den Daten aus der Response
function updateLocation(response) {

    //Benoetigte Felder finden und speichern
    let latitudeFieldTag = document.getElementById('latitude');
    let longitudeFieldTag = document.getElementById('longitude');
    let latitudeFieldDiscovery = document.getElementById('latitude_search');
    let longitudeFieldDiscovery = document.getElementById('longitude_search');
    let mapView = document.getElementById("mapView");

    //aktuelle Position aus dem Formular entnehmen und speichern
    var currentLatitude = latitudeFieldTag.value;
    var currentLongitude = longitudeFieldTag.value;


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

    //wenn aktuelle Position bereits vorhanden
    } else {
        console.log("response: ", response);
        if(response != undefined) {
        console.log("response: ", response);
        var data = JSON.parse(response);
        console.log("data: ", data);
            for(i = 0; i < data.length; i++) {
            li = document.createElement('li');
            dataInnerHTML = data[i]._name + " (" + data[i]._latitude + ", " + data[i]._longitude + ") " + data[i]._hashtag;
            li.innerHTML = dataInnerHTML;
            document.getElementById('discoveryResults').appendChild(li);
            }
            mapManager.updateMarkers(currentLatitude, currentLongitude, data);
        }
    }
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    initMapManager();
    updateLocation(undefined);
    
    //Event-Listener für die Button erstellen
    document.getElementById("tag-form").addEventListener("submit", buttonClickedTagging);
    document.getElementById("discoveryFilterForm").addEventListener("submit", buttonClickedDiscovery);
});

//Erstellt ein GeoTag Element und bietet die Möglichkeit ein GeoTag Element in Json zu verwandeln
class GeoTag {

    constructor(name, latitude, longitude, hashtag){
        this._name = name;
  	    this._latitude = latitude;
  	    this._longitude = longitude;
        this._hashtag = hashtag;
    }

    toJson() {
        let arr = {"name": this._name, "latitude": this._latitude, "longitude": this._longitude, "hashtag": this._hashtag};
        return JSON.stringify(arr);
    }
}

// #### Funktion wenn der "Add Tag"- Button angeklickt wurde
async function buttonClickedTagging(event) {
    // Werte speichern
    var nameTagForm = document.getElementById('name').value;
    var latitudeTagForm = document.getElementById('latitude').value;
    var longitudeTagForm = document.getElementById('longitude').value;
    var hashtagTagForm = document.getElementById('hashtag').value;

    // Neues GeoTag Element erstellen
    var tagFormData = new GeoTag(nameTagForm, latitudeTagForm, longitudeTagForm, hashtagTagForm);

    // Validierung der Felder korrekt?
    // Ja? -> Absenden des Formulars verhindern und fetch auslösen
    // Nein? -> Validierungsmeldung anzeigen
    if (event.target.checkValidity()) {
        event.preventDefault();  
        const response = await fetch('/api/geotags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //Daten für das Hinzufügen des Tags wird im Body mitgegeben
            body: tagFormData.toJson()
        })
        .then(response => response.json())
        .then(data => updateLocation(data)); //Updatet die Ergebnisliste und die Karte mit den gefundenen Werten
    } else {
        event.target.reportValidity(); 
    }
}

// #### Funktion wenn der "Search"- Button angeklickt wurde
async function buttonClickedDiscovery(event) {
    //Werte für die Suche aus Formular holen
    var latitudeDiscoveryForm = document.getElementById('latitude_search').value;
    var longitudeDiscoveryForm = document.getElementById('longitude_search').value;
    var searchDiscoveryForm = document.getElementById('search').value;

    //Paramater für die Abfrage speichern
    const params = new URLSearchParams({
        'latitude_search': latitudeDiscoveryForm,
        'longitude_search': longitudeDiscoveryForm,
        'search': searchDiscoveryForm
    });

    //URL für die Abfrage mit gespeicherten Parametern erstellen
    const queryUrl = `http://localhost:3000/api/geotags?${params}`

    // Validierung der Felder korrekt?
    // Ja? -> Absenden des Formulars verhindern und fetch auslösen
    // Nein? -> Validierungsmeldung anzeigen
    if (event.target.checkValidity()) {
        event.preventDefault();  
        const response = await fetch(queryUrl, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => updateLocation(data)); //Updatet die Ergebnisliste und die Karte mit den gefundenen Werten
    } else {
        event.target.reportValidity(); 
    }
}