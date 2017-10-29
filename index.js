const clone = require('stringify-clone')
const moment = require('moment')
const extend = require('extend')
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

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
      this.on('send', function() {
        this.startedAt = moment()
      });

      this.on('complete', function(response) {
        var event = {
          host: this.httpRequest.endpoint.host,
          operation: this.operation,
          duration: moment().diff(this.startedAt) // Calculate the total spend time
        };
        if (response.error) {
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
        } else {
          console.info(JSON.stringify(event))
        }
      })
      return proto._sendBeforeMetrics.apply(this, arguments)
    }
  }
}

exports.log = function(type, data) {
  var toLog = {}
  toLog[type] = data
  console.error(JSON.stringify(toLog))
}
