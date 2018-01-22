const discoverServices = require('../api/services/discover-services');
const test = require('unit.js');

describe('Testing Client Service API Discovery', function() {

  it('Test Clients EndPoint', function(done) {
    test.promise.given(discoverServices(services['client-service-v1']))
      .then(function(routes) {
        test.assert.equal(routes.links.clients.href, 'http://localhost:8081/v1/clients');
      })
      .catch(function(err){
        test.fail(err.message);
      })
      .finally(done)
      .done();
  });

  it('Test Clients Search EndPoint', function(done) {
    test.promise.given(discoverServices(services['client-service-v1']))
      .then(function(routes) {
        test.assert.equal(routes.links.clients.links.search.href, 'http://localhost:8081/v1/clients/search');
      })
      .catch(function(err){
        test.fail(err.message);
      })
      .finally(done)
      .done();
  });

  it('Test Clients Search byName EndPoint', function(done) {
    test.promise.given(discoverServices(services['client-service-v1']))
      .then(function(routes) {
        test.assert.notEqual(routes.links.clients.links.search.links.byName.href, 'http://localhost:8081/v1/clients/search/byName');
      }).catch(function(err){
        test.fail(err.message);
      })
      .finally(done)
      .done();
  });

  it('Test Clients Search byEmail EndPoint', function(done) {
    test.promise.given(discoverServices(services['client-service-v1'])).then(function(routes) {
      test.assert.equal(routes.links.clients.links.search.links.byEmail.href, 'http://localhost:8081/v1/clients/search/byName');
    }).catch(function(err){
      test.fail(err.message);
    })
    .finally(done)
    .done();
  });

});

/*describe('Testing Order Service API Discovery', function() {

  it('Test Orders EndPoint', function(done) {
    test.promise.given(discoverServices(services['order-service-v1']))
      .then(function(routes) {
        test.assert.equal(routes.links.orders.href, 'http://localhost:8082/v1/orders');
      })
      .catch(function(err){
        test.fail(err.message);
      })
      .finally(done)
      .done();
  });

  it('Test Orders Search EndPoint', function(done) {
    test.promise.given(discoverServices(services['order-service-v1']))
      .then(function(routes) {
        test.assert.equal(routes.links.orders.links.search.href, 'http://localhost:8082/v1/orders/search');
      })
      .catch(function(err){
        test.fail(err.message);
      })
      .finally(done)
      .done();
  });

  it('Test Orders Search findByRestaurantId EndPoint', function(done) {
    test.promise.given(discoverServices(services['order-service-v1']))
      .then(function(routes) {
        test.assert.notEqual(routes.links.orders.links.search.links.findByRestaurantId.href, 'http://localhost:8082/v1/orders/search/findByRestaurantId');
      }).catch(function(err){
        test.fail(err.message);
      })
      .finally(done)
      .done();
  });

  it('Test Orders Search byEmail EndPoint', function(done) {
    test.promise.given(discoverServices(services['order-service-v1'])).then(function(routes) {
      test.assert.equal(routes.links.orders.links.search.links.byEmail.href, 'http://localhost:8082/v1/orders/search/byName');
    }).catch(function(err){
      test.fail(err.message);
    })
    .finally(done)
    .done();
  });*/

});

