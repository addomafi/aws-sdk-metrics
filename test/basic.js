var assert   = require('assert'),
    should   = require('should'),
    sinon    = require('sinon');
const moment = require('moment'),
    zlib = require('zlib'),
    AWS = require('aws-sdk');

var AWSMOCK = require('aws-sdk-mock');
AWSMOCK.mock('DynamoDB', 'batchWriteItem', function (params, callback) {
  callback(null, "successfully batch Overwrite item in database");
});
var dynamoDB = new AWS.DynamoDB();

describe('aws-sdk-metrics', function() {
  let errorSpy;

  before(() => {
  })

  beforeEach(function() {
    errorSpy = sinon.spy(console, 'error');
  });

  afterEach((function() {
    errorSpy.restore();
  }))

  it('should get metrics', function(done) {
    dynamoDB.batchWriteItem({
      RequestItems: {
        Airport: [
          {
            PutRequest: {
              Item: {
                  airportCode: {"S": "GRU"},
                  airportName: {"S": "Guarulhos"}
              }
            }
          }
        ]
      }
    },
    function (err, data) {
      if (err) {
        done(err)
      } else {
        done();
      }
    });
  });

  it('should get metrics when promise', function(done) {
    (new AWS.DynamoDB()).batchWriteItem({
      RequestItems: {
        Airport: [
          {
            PutRequest: {
              Item: {
                  airportCode: {"S": "GRU"},
                  airportName: {"S": "Guarulhos"}
              }
            }
          }
        ]
      }
    }).promise()
      .then(data => {
        done();
      })
      .catch(err => {
        done(err)
      })
  });
});
