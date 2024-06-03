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
module.GeoTag;

class InMemoryGeoTagStore{

    constructor(){

    }

    geoTagMemory = [];

    addGeoTag = function (name, latitude, longitude, hashtag) {
        var geotag = GeoTag(name, latitude, longitude, hashtag);
        geoTagMemory.push(geotag);
    }

    removeGeoTag = function(name) {
        const index = arr.indexOf(name);
        if (index > -1) {
            arr.splice(index, 1);
        }

    }

    getNearbyGeoTags = function(latitude, longitude) {
        var geotags = [];
        var proximity = 20;
      
        //compares the distance of all tags to the current location and if the distance is smaller than the proximity radius the tag gets added to the new geotagProximity Array
        for(i = 0; i < geoTagMemory.length; i++) {
            var comparePoint = geoTagMemory[i];
            var distance = Math.sqrt((comparePoint.latitude - latitude)^2 + (comparePoint.longitude - longitude)^2);
            if (distance <= proximity) {
                geotags.push(comparePoint);
            }
        }

        return geotags;
    }

    searchNearbyGeoTags = function(latitude, longitude, keyword) {

        //Gibt Tags im Radius zurueck
        var geotagsRadius = getNearbyGeoTags(latitude, longitude);
        var geotags = [];

        //überprüft ob Tags im Radius das Keyword enthalten
        for(i = 0; i < geotagsRadius.length; i++) {
            var currentTag = geotagsRadius[i];
            if (currentTag.name.includes(keyword) || currentTag.hashtag.includes(keyword)) {
                geotags.push(currentTag);
            }
        }

        return geotags;
    }

}

module.exports = InMemoryGeoTagStore

