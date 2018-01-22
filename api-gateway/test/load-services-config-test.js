const services = require('../api/services');
const test = require('unit.js');

describe('Loading Services Config', function() {

    it('Client Service Version is V1', function() {
        test.assert.equal(services['client-service-v1'].version, "v1")
    });

    it('Order Service Port is 8082', function() {
        test.assert.equal(services['order-service-v1'].port, "8082")
    });

});