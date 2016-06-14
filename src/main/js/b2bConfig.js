/**
 * API Version : ${api.version}
 */
var name="${artifactId}";
var version="${api.version}";
var loggers = {
		generalLogger: { 
			name: "gatewayscript-user",
			logLevel: "7"
		}, 
		splunkLogger: {
			name: "splunkFeed",
			logLevel: "7"
		}
	};

var config = [
              {name:"acctbalance",
            	  methods:[
            	           {name:"GET", targetUrl:"http://api-springboot.mybluemix.net/acctbalance"}
            	           ]
              }                            
             ];

exports.getApiConfig = function(frameworkLocation, console) {

	var util = require(frameworkLocation + 'Util.js');
		
	return util.getApiConfig(frameworkLocation, console, name, version, config, loggers);
}


