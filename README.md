# aws-sdk-metrics

This Node.js module provides an easy way to get metrics from HTTP(S) requests performed
by the [`aws-sdk` module](https://github.com/aws/aws-sdk-js)

## Usage

Basic usage is to require the module and call it, passing in the object
returned by `require('aws-sdk')`:

```js
var AWS = require('aws-sdk');

require('aws-sdk-metrics')(AWS);
```
