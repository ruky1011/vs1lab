// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    constructor(name, latitude, longitude, hashtag){
        this._name = name;
  	    this._latitude = latitude;
  	    this._longitude = longitude;
        this._hashtag = hashtag;
    }

    getName() {
        return this._name;
    }

    setName(name) {
        this._name = name;
    }

    getLatitude() {
        return this._latitude;
    }

    setLatitude(latitude) {
        this._latitude = latitude;
    }

    getLongitude() {
        return this._longitude;
    }

    setLongitude(longitude) {
        this._longitude = longitude;
    }

    getHashtag(){
        return this._hashtag
    }

    setHashtag(hashtag){
        this._hashtag = hashtag;
    }
    
}

module.exports = GeoTag;
