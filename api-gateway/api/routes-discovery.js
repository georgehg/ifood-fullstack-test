/*
* created by george.silva
* 20.01.2018
*/

'use strict'

const restify = require('restify-clients');
const Promise = require('promise');

// Creates a JSON client
const clientServiceRequest = restify.createJsonClient({
  url: 'http://localhost:8081',
  retry: false
});

const apiVersion = 'v1';
const basePath = '/' + apiVersion;
const rejectRelations = ['self', 'profile'];

const discoverRoutes = function(baseUrl) {

  let clientServiceEndpoints = {
    verions: apiVersion
  };

  const addRoutes = function(endPointObj) {

    return new Promise(function(resolve, reject) {

      clientServiceRequest.get(endPointObj.url, getLinksComplete);

      function getLinksComplete(err, req, res, obj) {

        if (err) {
          reject(err);
        };

        if (obj._links) {

          let endPointLinks = {};
          let promisesList = [];

          Object.keys(obj._links).forEach(function(rel) {
            endPointLinks[rel] = {href: obj._links[rel].href};
            if(rejectRelations.indexOf(rel) == -1 && !obj._links[rel].templated ) {
              promisesList.push(addRoutes({rel: rel, url: obj._links[rel].href}));
            }
          });

          Promise.all(promisesList)
            .then(function(links) {
              links.forEach(function(link) {
                endPointLinks[link.rel].links = link.links;
              });
              resolve({rel: endPointObj.rel, links: endPointLinks});
            }, function(err) {
              console.log(err);
            });

        } else {
          reject(obj);
        }
      };
    });
  }

  return addRoutes({rel: apiVersion, url: baseUrl});

};

module.exports = Object.assign({}, { discoverRoutes })
