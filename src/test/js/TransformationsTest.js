var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/target/framework/js/';
var configLocation = currentWorkingDir + '/src/main/js/';

var Require = load('src/main/js/lib/Require.js');
var require = Require('./', [ configLocation, frameworkLocation ]);

describe(
		"TransformationsTest",
		function() {

			// spy object to replace console
			var console;
			var apim;

			var logger;
			var config = [ {
				name : "/users",
				methods : [ {
					name : "GET",
					targetUrl : "https://randomuser.me/api/users"
				} ]
			}, {
				name : "/users/all",
				methods : [ {
					name : "GET",
					targetUrl : "https://randomuser.me/api/users/all"
				} ]
			} ];

			beforeEach(function() {
				console = jasmine.createSpyObj('console', [ 'debug', 'info',
						'notice', 'warning', 'error', 'critical', 'alert',
						'emergency', 'options' ]);
				apim = jasmine.createSpyObj('apim', [ 'getvariable' ]);

				logger = require('Logger.js').newLogger({ 
					logLevel: "7"
				}, console);
			
				var log = function(msg) {
					print(msg);
				}
				
				console.info.and.callFake(log);
				console.notice.and.callFake(log);
				console.debug.and.callFake(log);
				console.error.and.callFake(log);
			});			

			it("testAcctbalancePostTransform",
					function() {

						try {
							var transformations = require("Transformations.js");
							var api = require("Api.js").newApi(
									frameworkLocation, "api", "1.0.0", config,
									logger, logger);

							// mock body to transform
							var body = {
									"custId" : "GTYF658309",
									"accounts" : [ {
										"bankAccountId" : "56784567465798545",
										"accountHolderName" : "George Smith",
										"availableBalance" : "4430.67",
										"currentBalance" : "4430.67",
										"availableLimit" : "8967.54",
										"branchCode" : "6583"
									},
									{		
										"bankAccountId" : "6573456746577800",
										"accountHolderName" : "G Smith & Co",
										"availableBalance" : "6587.78",
										"currentBalance" : "6524.57",
										"availableLimit" : "20000",
										"branchCode" : "6582"
									}]
								};

							apim.getvariable.and.callFake(function(variable) {
								return body;
							});

							var result = transformations
									.acctbalancePostTransform(
											frameworkLocation, api, apim);
							var actualResults = JSON.stringify(result);
							api.logger.info(actualResults);
							var expectedResults = '{"Accounts":[{"accountNumber":"56784567465798545","branchID":"6583","name":"George Smith","Balances":[{"balanceType":"Running Book","balanceAmount":"4430.67"},{"balanceType":"Available","balanceAmount":"4430.67"},{"balanceType":"Available Limit","balanceAmount":"8967.54"}]},{"accountNumber":"6573456746577800","branchID":"6582","name":"G Smith & Co","Balances":[{"balanceType":"Running Book","balanceAmount":"6524.57"},{"balanceType":"Available","balanceAmount":"6587.78"},{"balanceType":"Available Limit","balanceAmount":"20000"}]}]}';
							

							expect(expectedResults).toBe(actualResults);

							console.info(actualResults);

							expect(apim.getvariable).toHaveBeenCalledWith(
									'message.body');

						} catch (e) {
							console.debug(e);
						}
					});
			
			it("testAcctbalancePreTransform",
					function() {

						try {
							var transformations = require("Transformations.js");
							var api = require("Api.js").newApi(
									frameworkLocation, "api", "1.0.0", config,
									logger, logger);

							// mock body to transform
							var custId = '6584095';

							apim.getvariable.and.callFake(function(variable) {
								return custId;
							});

							var result = transformations
									.acctbalancePreTransform(
											frameworkLocation, api, apim);
							api.logger.info(result);
							var expectedResults = '{"custId":"6584095"}';
							var actualResults = JSON.stringify(result);

							expect(expectedResults).toBe(actualResults);

							console.info(actualResults);


						} catch (e) {
							console.debug(e);
						}
					});

	

		});
