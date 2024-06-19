// File origin: VS1LAB A3, A4

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
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [], coordinates: {latitude: '', longitude: ''}, taglist_json: [] })
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', function(req, res) {

  // Values for search
  var latitude = req.query.latitude_search;
  var longitude = req.query.longitude_search;
  var search = req.query.search;

  // Search the geotags in the proximity which includes the searched keyword
  var searchTagList = geoTagStore.searchNearbyGeoTags(latitude, longitude, search);
  console.log("searchTagList: ", searchTagList);

  // Convert the outputArray into Json
 var taglist_json = JSON.stringify(searchTagList);


  var coordinates = {
    latitude: latitude,
    longitude: longitude
  };

  console.log("Coordinates: ", coordinates);
  res.json(taglist_json);
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', function(req, res) {

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
  res.json(taglist_json);
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', function(req, res) {

  var id = req.params.id;

  var geotag = geoTagStore.searchGeoTagByID(id);

  res.json(geotag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', function(req, res) {

  var id = req.params.id;
  var name = req.body.name;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var hashtag = req.body.hashtag;

  var geotag = geoTagStore.changeGeoTagByID(id, name, latitude, longitude, hashtag, geoTagStore);

  res.json(geotag);
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', function(req, res) {

  var id = req.params.id;

  var geotag = geoTagStore.deleteGeoTagByID(id);

  //console.log("DELETE GEOTAG: ", geoTagStore.getAllGeoTags());

  res.json(geotag);
});

module.exports = router;
