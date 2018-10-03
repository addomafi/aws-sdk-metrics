var assert   = require('assert'),
    should   = require('should'),
    AWS_mock = require('aws-sdk-mock'),
    AWS      = require('aws-sdk'),
    sinon    = require('sinon');

const moment = require('moment');

AWS.config.update({region:'us-east-1'});

describe('aws-sdk-metrics', function() {
  let logSpy;
  let momentDiffStub;

  beforeEach(function() {
    require('../')(AWS)
    logSpy = sinon.spy(console, 'log');
    momentDiffStub = sinon.stub(moment.fn, 'diff');
  });

  afterEach((function() {
    logSpy.restore();
    momentDiffStub.restore();
  }))

  // it('should get metrics', function(done) {
  //   AWS_mock.mock('DynamoDB', 'batchWriteItem', (params, callback) => {
  //     callback(null, {});
  //   });

  //   var dynamoDB = new AWS.DynamoDB()
  //   dynamoDB.batchWriteItem({
  //         RequestItems: {
  //           Airport: [
  //             {
  //               PutRequest: {
  //                 Item: {
  //                     airportCode: {"S": "GRU"},
  //                     airportName: {"S": "Guarulhos"}
  //                 }
  //               }
  //             }
  //           ]
  //         }
  //     }, 
  //     function(err, data) {
  //       sinon.assert.calledOnce(logSpy);
  //       done();
  //     }
  //   );
  // });

  it('should get metrics when promise', function(done) {
    momentDiffStub.callsFake(() => 3);

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
        }, function(err, data){
        console.log(JSON.stringify(err));
    });
    
    done();
  });
});
