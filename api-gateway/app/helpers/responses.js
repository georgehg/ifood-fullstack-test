/*
* created by george.silva
* 24.01.2018
*/

'use strict'

const helper = function(app) {

	return {
		handle: _handleResponse
	}

    function _handleResponse(resp, body) {

        let response = {statusCode: resp.statusCode, content: {}};

        if (resp.statusCode != 200) {
            response.content = body;
            return response;
        }

        if (resp.statusCode == 200) {
            if (body._embedded) {
                // remove backend services links
                /*Object.keys(body._embedded).forEach(function(entity) {
                    body._embedded[entity].forEach(function(entry) {
                        entry._links = undefined;
                    })
                    response.content[entity] = body._embedded[entity];                    
                });*/

                response.content = body._embedded;  
            } else {
                if(body._links) {
                    body._links = undefined;
                }                
                response.content = body;
            }
        }
        
        return response;
    }
}

module.exports = helper;