// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */

//module.import GeoTag from "./geotag.js";
const GeoTag = require("./geotag");


class InMemoryGeoTagStore{

    constructor(){
        this.geoTagMemory = [];
    }

    addGeoTag = function (name, latitude, longitude, hashtag) {
        var newID;
        var lastID;
        var lastElement = this.geoTagMemory[this.geoTagMemory.length - 1];

        if ( lastElement == undefined ) {
            newID = 1;
        } else {
            lastID = lastElement._id;
            newID = lastID + 1;
        }
        
        var geotag = new GeoTag(newID, name, latitude, longitude, hashtag);
        this.geoTagMemory.push(geotag);
    }

    removeGeoTag = function(name) {
        const index = arr.indexOf(name);
        if (index > -1) {
            arr.splice(index, 1);
        }

    }

    getNearbyGeoTags = function(latitude, longitude) {
        var geotags = [];
        var proximity = 2;
      
        //compares the distance of all tags to the current location and if the distance is smaller than the proximity radius the tag gets added to the new geotagProximity Array
        for(i = 0; i < this.geoTagMemory.length; i++) {
            var comparePoint = this.geoTagMemory[i];
            var distance = Math.sqrt((comparePoint._latitude - latitude)^2 + (comparePoint._longitude - longitude)^2);
            if (distance <= proximity) {
                geotags.push(comparePoint);
            }
        }

        return geotags;
    }

    searchNearbyGeoTags = function(latitude, longitude, keyword, start) {
        //Gibt Tags im Radius zurueck
        var geotagsRadius = this.getNearbyGeoTags(latitude, longitude);
        var geotagsAll = [];
        var geotags = [];

        //konvertiert das eingegeben keyword zu Kleinbuchstaben um die Suche case-insensitive zu machen
        var lowercaseKeyword = keyword.toLowerCase();

        //nimmt die bereits nach dem Radius gefilterten Tags und überprüft ob der Name oder das Hashtag das Keyword enthalten
        for(i = 0; i < geotagsRadius.length; i++) {
            var currentTag = geotagsRadius[i];

            //konvertiert die zu suchenden Werte (name und hashtag) zu Kleinbuchstaben um die Suche case-insensitive zu machen
            var lowercaseName = currentTag._name.toLowerCase();
            var lowercaseHashtag = currentTag._hashtag.toLowerCase();

            if (lowercaseName.includes(lowercaseKeyword) || lowercaseHashtag.includes(lowercaseKeyword)) {
                geotagsAll.push(currentTag);
            }
        }

        var countAll = geotagsAll.length;
        var end = start + 7; 

        console.log("start: ", start);
        console.log("end: ", end);

        for(i = start; i < end; i++) {
            if (geotagsAll[i] != undefined) {
            geotags.push(geotagsAll[i]);
            console.log("geotagsAll: ", geotagsAll[i] + "geotags: ", geotags);
            }
        }

        countAll = {"name": undefined, "latitude": undefined, "longitude": undefined,"Anzahl": countAll};
        geotags.push(countAll);

        return geotags;
    }

    searchGeoTagByID = function(id) {
        for(i = 0; i < this.geoTagMemory.length; i++) {
            var geotag;
            var currentGeoTag = this.geoTagMemory[i];
            if (currentGeoTag._id == id) {
                geotag = currentGeoTag;
                break;
            }
        }

        return geotag;
    }

    changeGeoTagByID = function(id, name, latitude, longitude, hashtag, geoTagStore) {
        var geotag = geoTagStore.searchGeoTagID(id);
        if (name != undefined) {
            geotag._name = name;
        }

        if (latitude != undefined) {
            geotag._latitude = latitude;
        }

        if (longitude != undefined) {
            geotag._longitude = longitude;
        }

        if (hashtag != undefined) {
            geotag._hashtag = hashtag;
        }
    }

    deleteGeoTagByID = function(id) {
        for(i = 0; i < this.geoTagMemory.length; i++) {
            //laut GitHub kein Austausch von Ressourcen, laut index.js soll gelöschtes Element zurückgegeben werden -> return ja oder nein?
            var deletedGeotag; 
            var currentGeoTag = this.geoTagMemory[i];
            if (currentGeoTag._id == id) {
                this.geoTagMemory.splice(i, 1);
                deletedGeotag = currentGeoTag;
                break;
            }

            return deletedGeotag;
        }
    }

    getAllGeoTags = function() {
        var geotags = [];
      
        //compares the distance of all tags to the current location and if the distance is smaller than the proximity radius the tag gets added to the new geotagProximity Array
        for(i = 0; i < this.geoTagMemory.length; i++) {
            var currentGeoTag = this.geoTagMemory[i];
            geotags.push(currentGeoTag);
        }

        return geotags;
    }



}

module.exports = InMemoryGeoTagStore

