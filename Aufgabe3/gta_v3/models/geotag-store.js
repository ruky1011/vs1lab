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
        var geotag = new GeoTag(name, latitude, longitude, hashtag);
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
           /* console.log("Distanz: ", distance);
            console.log("comparePoint", comparePoint);
            console.log("comparePoint Latitude", comparePoint._latitude);
            console.log("Vergleichs Latitude", latitude);*/
            if (distance <= proximity) {
                geotags.push(comparePoint);
            }
        }

        return geotags;
    }

    searchNearbyGeoTags = function(latitude, longitude, keyword) {
        //Gibt Tags im Radius zurueck
        var geotagsRadius = this.getNearbyGeoTags(latitude, longitude);
        var geotags = [];

        //überprüft ob Tags im Radius das Keyword enthalten
        for(i = 0; i < geotagsRadius.length; i++) {
            var currentTag = geotagsRadius[i];
            if (currentTag._name.includes(keyword) || currentTag._hashtag.includes(keyword)) {
                geotags.push(currentTag);
            }
        }

        return geotags;
    }

}

module.exports = InMemoryGeoTagStore

