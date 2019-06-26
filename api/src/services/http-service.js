'use strict';

var { request } = require('../config/dependencies');

var HttpService = {};
HttpService.name = 'HttpService';

HttpService.post = async(url, body) => {
  return await request({
    method: 'POST',
    uri: url,
    body: body,
    json: true,
  });
};

module.exports = HttpService;
