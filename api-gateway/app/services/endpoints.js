/*
* created by george.silva
* 20.01.2018
*/

'use strict'

const request = require('request').defaults({json: true});
const Promise = require('promise');

const discoverServices = function(app) {

  const _discard_endpoints = ["self", "profile"];

  const _services = app.services.services;

  const addRoutes = function(endPointObj) {

    return new Promise(function(resolve, reject) {

      request(endPointObj.url, getLinksComplete);

      function getLinksComplete(err, resp, body) {
        //console.log(err, resp, body);

        if (err) {
          reject({field: endPointObj.rel});
          return;
        };

        if (!body) {
          reject({field: endPointObj.rel});
          return;
        };

        if (body._links) {

          let endPointLinks = {};
          let promisesList = [];

          Object.keys(body._links).forEach(function(rel) {
            if(_discard_endpoints.indexOf(rel) == -1) {
              endPointLinks[rel] = {href: body._links[rel].href};

              if(body._links[rel].templated) {
                let params = body._links[rel].href.split("{\?")[1].replace("}", "").split(",");
                endPointLinks[rel].params = params;
                endPointLinks[rel].href = endPointLinks[rel].href.split("{\?")[0];
              }

              if(!body._links[rel].templated) {
                promisesList.push(addRoutes({version: endPointObj.version, rel: rel, url: body._links[rel].href}));
              }
            }
          });

          Promise.all(promisesList)
            .then(function(links) {
              links.forEach(function(link) {
                endPointLinks[link.rel].links = link.links;
              });
              resolve({version: endPointObj.version, rel: endPointObj.rel, links: endPointLinks});
            }, function(err) {
              console.log(err);
              reject(err);
            });

        } else {
          resolve({field: endPointObj.rel});
        }
      };
    });
  };

  let _clientServices = {};
  let _promisesList = [];

  Object.keys(_services).forEach(function(version) {
    _clientServices[version] = {};
    Object.keys(_services[version]).forEach(function(serviceName) {
      _clientServices[version][serviceName] = {};
      const service = _services[version][serviceName];
      const serviceUrl = 'http://' + service.host + ":" + service.port + service.basePath;
      _clientServices[version][serviceName].url = serviceUrl
      _promisesList.push(addRoutes({version: version, rel: serviceName, url: serviceUrl}));    
    });
  });

  Promise.all(_promisesList)
    .then(function(services) {
      services.forEach(function(service) {
        _clientServices[service.version][service.rel] = service.links;
      });
    });
  
  return _clientServices;

};

module.exports = discoverServices;