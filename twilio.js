// Load the twilio module
var twilio = require('twilio');
 
// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient('ACccf22e4c1a7309958906a98241730e7e', '9572dba0e25db8c81fc529617194bfd5');
 


module.exports = client;