var assert   = require('assert'),
  should  = require('should'),
  AWS_mock = require('aws-sdk-mock'),
  AWS      = require('aws-sdk');

AWS.config.update({region:'us-east-1'});
describe('aws-sdk-metrics', function() {

  before(function() {
    require('../')(AWS)
  })

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
        }, function(err, data){
        console.log(JSON.stringify(err));
    });

    should.exist(this.startedAt)
    done()
  })


})
