/*
* created by george.silva
* 20.01.2018
*/

'use strict'

const request = require('request').defaults({json: true});
const Promise = require('promise');

const discoverServices = function(app) {

  const _discard_endpoints = ["self", "profile", "first", "next", "last"];
  const _services = app.services.services;

  let _clientServices = undefined;

  return {
    getEndPoints: getEndPoints
  }

  function getEndPoints() {

    if (_clientServices) {
      return Promise.resolve(_clientServices);
    } else {
      _clientServices = {};
    };
    
    const addRoutes = function(endPointObj) {

      return new Promise(function(resolve, reject) {

        request({url: endPointObj.url, qs: endPointObj.params}, getLinksComplete);

        function getLinksComplete(err, resp, body) {

          if (err) {
            reject({field: endPointObj.rel, error: err});
            return;
          };

          if (!body) {
            reject({field: endPointObj.rel, error: "No content for Link: " + endPointObj.url});
            return;
          };

          if (body._links) {

            let endPointLinks = {};
            let promisesList = [];

            Object.keys(body._links).forEach(function(rel) {
              if(_discard_endpoints.indexOf(rel) == -1) {

                endPointLinks[rel] = {href: body._links[rel].href};

                if(body._links[rel].templated) {
                  endPointLinks[rel].params = body._links[rel].href.split("{\?")[1].replace("}", "").split(",");
                  endPointLinks[rel].href = endPointLinks[rel].href.split("{\?")[0];
                }

                if (endPointLinks[rel].params && endPointLinks[rel].params.indexOf("size") != -1) {
                  promisesList.push(addRoutes({version: endPointObj.version, rel: rel, url: endPointLinks[rel].href, params: {size: 1}}));
                } else if(!body._links[rel].templated) {
                  promisesList.push(addRoutes({version: endPointObj.version, rel: rel, url: endPointLinks[rel].href}));
                }
              }
            });

            Promise.all(promisesList)
              .then(function(links) {
                links.forEach(function(link) {
                  endPointLinks[link.rel].links = link.links;
                });
                resolve({version: endPointObj.version, rel: endPointObj.rel, links: endPointLinks});
              }).catch(function(reason) {
                console.log(reason);
                reject(reason);
              });

          } else {
            resolve({field: endPointObj.rel});
          };

        };
      });
    };

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

    return Promise.all(_promisesList)
      .then(function(services) {
        services.forEach(function(service) {
          _clientServices[service.version][service.rel] = service.links;
        });
        return _clientServices;
      }).catch(function(reason) {
        console.log("Failed discovering services: " + JSON.stringify(reason))
        _clientServices = undefined;
        return _clientServices;
      });
  };

};

module.exports = discoverServices;