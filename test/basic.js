var assert   = require('assert'),
    should   = require('should'),
    AWS_mock = require('aws-sdk-mock'),
    AWS      = require('aws-sdk'),
    sinon    = require('sinon');

const moment = require('moment');

AWS.config.update({region:'us-east-1'});

describe('aws-sdk-metrics', function() {
  let errorSpy;

  before(() => {
    require('../')(AWS);
  })

  beforeEach(function() {
    errorSpy = sinon.spy(console, 'error');
  });

  afterEach((function() {
    errorSpy.restore();
  }))

  it('should get metrics', function(done) {
    var dynamoDB = new AWS.DynamoDB()
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
    (err, data) => {
      sinon.assert.calledOnce(errorSpy);
      done();
    });
  });

  it('should get metrics when promise', function(done) {
    var dynamoDB = new AWS.DynamoDB()
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
    }).promise()
      .then(() => done(new Error('This should not appear')))
      .catch(() => {
        sinon.assert.calledOnce(errorSpy);
        done();
      })
  });
});
