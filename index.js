const clone = require('stringify-clone')
const moment = require('moment')
const extend = require('extend')
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

function generateEvent(context) {
  return {
    host: this.httpRequest.endpoint.host,
    operation: this.operation,
    duration: moment().diff(this.startedAt) // Calculate the total spend time
  };
}

function generateErrorMessages(context) {
  log('faultDetails', extend({
    request: {
      headers    : clone(this.httpRequest.headers),
      body       : this.httpRequest.body
    },
    response: {
      headers    : clone(this.response.httpResponse.headers),
      statusCode : this.response.httpResponse.statusCode,
      body       : decoder.write(this.response.httpResponse.body)
    }
  }, event))
}

module.exports = exports = function(aws, log) {
  log = log || exports.log

  var proto
  if (aws.Request) {
    proto = aws.Request.prototype
  } else {
    throw new Error(
      "Pass the object returned by require('aws-sdk') to this function.")
  }

  if (!proto._sendBeforeMetrics) {
    proto._sendBeforeMetrics = proto.send

    proto.send = function(callback) {
      this.on('build', function() {
        this.startedAt = moment()
      });

      this.on('complete', function(response) {
        var event = generateEvent(this);
        console.log(event);
        if (response.error) {
          generateErrorMessages(this);
        } else {
          console.info(JSON.stringify(event))
        }
      })
      return proto._sendBeforeMetrics.apply(this, arguments)
    }
  }

  // Overwrite promise module
  proto.promise = function promise() {
    var self = this;

    // append to user agent
    this.httpRequest.appendToUserAgent('promise');
    return new Promise(function(resolve, reject) {
      self.on('build', function() {
        this.startedAt = moment()
      });
  
      self.on('complete', function(response) {
        var event = generateEvent(self);
  
        if (response.error) {
          generateErrorMessages(self);
          reject(response.error);
        } else {
          console.info(JSON.stringify(event))
          resolve(Object.defineProperty(
            response.data || {},
            '$response',
            { value: response }
          ))
        }
      });
  
      self.runTo();
    });
  };
}

exports.log = function(type, data) {
  var toLog = {}
  toLog[type] = data;
  console.error(JSON.stringify(toLog))
}
