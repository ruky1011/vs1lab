// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 * 
 * coordinates where load into tagging and discovery form
 * taglist_json is load into discovery map
 */


router.get('/', (req, res) => {
  res.render('index', { taglist: [], coordinates: {latitude: '', longitude: ''}, taglist_json: [] })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 * 
 * coordinates where load into tagging and discovery form
 * taglist_json is load into discovery map
 */

router.post('/tagging', function(req, res) {
  var name = req.body.name;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var hashtag = req.body.hashtag;

  geoTagStore.addGeoTag(name, latitude, longitude, hashtag);
  var proximityTagList = geoTagStore.getNearbyGeoTags(latitude, longitude);
  var taglist_json = JSON.stringify(proximityTagList);

  console.log("tagList json tagging: ", taglist_json);

  var coordinates = {
    latitude: req.body.latitude,
    longitude: req.body.longitude
  };
  res.render('./index.ejs', { taglist: proximityTagList, coordinates, taglist_json });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 * 
 * coordinates where load into tagging and discovery form
 * taglist_json is load into discovery map
 * 
 */

router.post('/discovery', function(req, res) {

  // Values for search
  var latitude = req.body.latitude_search;
  var longitude = req.body.longitude_search;
  var search = req.body.search;

  // Search the geotags in the proximity which includes the searched keyword
  var searchTagList = geoTagStore.searchNearbyGeoTags(latitude, longitude, search);

  // Convert the outputArray into Json
  var taglist_json = JSON.stringify(searchTagList);


  var coordinates = {
    latitude: latitude,
    longitude: longitude
  };

  console.log("Coordinates: ", coordinates);
  res.render('./index.ejs', { taglist: searchTagList, coordinates, taglist_json });
});

module.exports = router;
