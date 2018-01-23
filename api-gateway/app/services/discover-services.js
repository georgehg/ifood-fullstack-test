/*
* created by george.silva
* 20.01.2018
*/

'use strict'

const restify = require('restify-clients');
const Promise = require('promise');
const services = require('./services.js');

const discoverServices = function() {

  let clientServices = {
    version: 'v1'
  };

  let clientServiceRequest = restify.createJsonClient({    
    retry: false
  });

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
            if(service.discard_endpoints.indexOf(rel) == -1 && !obj._links[rel].templated ) {
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
          resolve({rel: endPointObj.rel});
        }
      };
    });
  };

  let promisesList = [];
  Object.keys(services[clientServices.version])
    .forEach(function(serviceName) {
      const service = services[clientServices.version][serviceName];
      clientServiceRequest.url = 'http://' + service.host + ":" + service.port;
      console.log(clientServiceRequest.url);
      promisesList.push(addRoutes({rel: service.version, url: service.basePath}));    
    });

  Promise.all(promisesList)
    .then(function(services) {
      Object.assign(clientServices, services);
      return clientServices;
    });

};

console.log(discoverServices());

module.exports = discoverServices;