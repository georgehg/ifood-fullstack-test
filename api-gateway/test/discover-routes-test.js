const discoverRoutes = require('../api/routes-discovery').discoverRoutes;
const test = require('unit.js');

describe('Testing Client Service API Discovery', function() {

  it('Test Clients EndPoint', function(done) {
    test.promise.given(discoverRoutes('/v1'))
      .then(function(routes) {
        test.assert.equal(routes.links.clients.href, 'http://localhost:8081/v1/clients');
        done();
      })
      .catch(function(err){
        test.fail(err.message);
      })
      .finally(done)
      .done();
  });

  it('Test Clients Search EndPoint', function(done) {
    test.promise.given(discoverRoutes('/v1'))
      .then(function(routes) {
        test.assert.equal(routes.links.clients.links.search.href, 'http://localhost:8081/v1/clients/search');
        done();
      });
  });

  it('Test Clients Search byName EndPoint', function(done) {
    test.promise.given(discoverRoutes('/v1'))
      .then(function(routes) {
        test.assert.equal(routes.links.clients.links.search.links.byName.href, 'http://localhost:8081/v1/clients/search/byName');
        done();
      }).catch(function(err){
        test.fail(err.message);
      })
      .finally(done)
      .done();
  });

  it('Test Clients Search byEmail EndPoint', function(done) {
    test.promise.given(discoverRoutes('/v1')).then(function(routes) {
      test.assert.equal(routes.links.clients.links.search.links.byEmail.href, 'http://localhost:8081/v1/clients/search/byName');
      done();
    }).catch(function(err){
      test.fail(err.message);
    })
    .finally(done)
    .done();
  });

});
