/**
 * API Version : ${api.version}
 */


/**
 * Masks the given string based on regular expressions
 * @param str String to be masked
 */
exports.mask = function(str) {
	var maskedStr = str;
	
	// Mask credit card account number
	maskedStr = maskedStr.replace(/\b(\d{12})(\d{4})\b/ig, 'xxxxxxxxxxxx$2');	
	// Mask reference number
	maskedStr = maskedStr.replace(/(?:"(refNum|referenceNumber)"\s*:\s*")\b(\d{4})\d+(\d{4})\b/ig, '"$1": "$2xxxxxxxx$3');
	
	return maskedStr;
}

exports.acctbalancePreTransform = function(frameworkLocation,api,apim) {

	api.logger.debug("acctbalancePreTransform Entry");
	var transformer = require(frameworkLocation + 'JsonTransformer.js').newJsonTransformer(frameworkLocation);
	
	var custId = apim.getvariable('request.parameters.custId');
	
	var value = {
			custId: custId
				};
	
	api.logger.debug("acctbalancePreTransform Exit");
		
	return value;		
}


exports.acctbalancePostTransform = function(frameworkLocation,api,apim) {

	api.logger.debug("acctbalancePostTransform Entry");
	
	var data = apim.getvariable('message.body');
	if(data != null && data.errorCode != null) {
		return api.generateBusinessError(frameworkLocation, apim, 'Oracle MSL', data.errorCode);
	}
	
	var transformer = require(frameworkLocation + 'JsonTransformer.js').newJsonTransformer(frameworkLocation);
	
	var Accounts = [];
	if (data.accounts) {
        for (var i in data.accounts) {
			var obj ={};
			obj.accountNumber = data.accounts[i].bankAccountId;
	        obj.branchID = data.accounts[i].branchCode;
	        obj.displayAccountNumber = data.accounts[i].displayBankAccountId;
	        obj.name = data.accounts[i].accountHolderName;
	        var Balances = [];
	
	        if (data.accounts[i].currentBalance) {
	            var runnbal = {};
	            runnbal.balanceType = 'Running Book';
	            runnbal.balanceAmount = data.accounts[i].currentBalance;
	            Balances.push(runnbal);
	        }
	
	        if (data.accounts[i].availableBalance) {
	            var availbal = {};
	            availbal.balanceType = 'Available';
	            availbal.balanceAmount = data.accounts[i].availableBalance;
	            Balances.push(availbal);
	        }
	
	        if (data.accounts[i].availableLimit) {
	            var availlimit = {};
	            availlimit.balanceType = 'Available Limit';
	            availlimit.balanceAmount = data.accounts[i].availableLimit;
	            Balances.push(availlimit);
	        }
	        obj.Balances = Balances;
	        
	        Accounts.push(obj);
		}
	}	
	
	var ret = {Accounts : Accounts};
	api.logger.debug("acctbalancePostTransform Exit");
		
	return ret;		
}
