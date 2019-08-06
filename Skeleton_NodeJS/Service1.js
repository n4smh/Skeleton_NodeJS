/*
###############################################################################
#                        S C R I P T  H E A D E R                             #
###############################################################################
#          Script           :    Service1.js                                  #
#                                                                             #
#          Description      :    Service1 workflow                            #
#                                                                             #
###############################################################################
*/

const properties = require('./Properties');
const CommonUtilClass = require('./CommonUtil');
const EventEmitter = require('events');
const childProcess = require('child_process');
const commonUtil = new CommonUtilClass();

var log = '';
var logFailedRecord = '';

function setLogger(logger, failedLogger) {
    log = logger;
    logFailedRecord = failedLogger;
    CommonUtilClass.setLogger(log);
}

class Service1Flow extends EventEmitter {
    constructor() {
        super();

        this.currentCall = "";
        this.doneCount = 0;
    }

    getArgument(options, data) {

        options.hostname = properties.backendHost;
        options.headers = {
            'Content-Type': 'application/json',
            //'Authorization': properties.authorizationKey
        };

        var args = {
            "options": options,
            "dataString": JSON.stringify(data)
        };

        return args;
    }

    makeBackendCall(url, bodyData, method, expectedStatusCode) {
        this.currentCall = 'makeBackendCall';
        log.info('---------------------------------------------------------------');
        log.info(`Making backend call to URL ${url}`);

        const options = {

            port: properties.backendPort,
            method: method,
            //path: `${properties.pathPrefixForBackendAPI}/${url}`
            path: url
        };

        var key = options.method + options.path;

        try {
            var data = bodyData;

            if (commonUtil.listenerCount(`response${key}`) < 1) {
                commonUtil.on(`response${key}`, (res) => {

                    if (this.currentCall === "makeBackendCall") {

                        if (res.statusCode == expectedStatusCode) {
                            log.info(`Backend call to URL ${url} success`);
                            this.emit(`makeBackendCall${method}${url}`, true);

                        } else {
                            log.error(`Backend call to URL ${url} failed`);
                            this.logFailedRecord(this.constructError(`Backend call`, `Backend call to URL ${url} failed`));
                            this.emit(`makeBackendCall${method}${url}`, false);

                        }
                    }
                });
            }
            commonUtil.makeHttpCall(this.getArgument(options, data), key);
        } catch (err) {
            log.debug(err);
            this.logFailedRecord(this.constructError(`Backend call`, err));
        }

    }


    printArrayElements(array) {
        log.info('---------------------------------------------------------------');
        log.info("Array elements: ");

        var count = 0;
        commonUtil.doneCount = 0;

        commonUtil.IterateOver(array, function (element, report) {
            log.info(`${++count}: ${element}`)
            report();

        }, (response) => {
            log.info(`Total elements: ${count}`);
        });

    }


    service1Flow(bodyData) {
        log.info('---------------------------------------------------------------');
        log.info(`Starting with ${properties.type1Workflow} flow`);
        this.currentFlowCall = properties.type1Workflow;

        var tempThis = this;

        tempThis.printArrayElements(bodyData.array);

        log.info(`Completed ${properties.type1Workflow} flow`);

    }

    service2Flow() {
        log.info('---------------------------------------------------------------');
        log.info(`Starting with ${properties.type2Workflow} flow`);
        this.currentFlowCall = properties.type2Workflow;

        var chunks = [];

        log.info(`Executing ${properties.demoScript} script with argument ${properties.gitURL}`);
        const shellScript = childProcess.exec(`sh ${properties.demoScript} ${this.gitURL}`);

        shellScript.stdout.on('data', function (data) {
            log.info(data);
        });

        shellScript.stderr.on('data', function (data) {
            chunks.push(data);
            log.error(data);

        }).on('end', function () {
            if (chunks.length > 0) {
                log.error(`Error occurred in ${properties.demoScript} script`);
                log.info('Terminating flow');
            } else {
                log.info(`Successfully executed ${properties.demoScript} script.`);
            }

            log.info(`Completed ${properties.type2Workflow} flow`);
        });

    }

    service3Flow(request) {
        log.info('---------------------------------------------------------------');
        log.info(`Starting with ${properties.type3Workflow} flow`);
        this.currentFlowCall = properties.type3Workflow;

        var tempThis = this;
        var terminate = false;

        if (request.url) {
            var url = request.url;
            log.info(`URL: ${url}`);

        } else {
            log.error('URL not found');
            terminate = true;
        }

        if (request.method) {
            var method = request.method;
            log.info(`Method: ${method}`);

        } else {
            log.error('Method not found');
            terminate = true;
        }

        if (request.body) {
            var body = request.body;

        } else if (method !== 'GET') {
            log.error('Body not found');
            terminate = true;
        }

        if (request.expectedStatusCode) {
            var expectedStatusCode = request.expectedStatusCode;
        } else {
            log.error('Expected StatusCode not found');
            terminate = true;
        }

        if (terminate) {
            log.info('Terminating flow');
            return;
        }

        if (tempThis.listenerCount(`makeBackendCall${method}${url}`) < 1) {
            tempThis.on(`makeBackendCall${method}${url}`, response => {

                if (tempThis.currentFlowCall === properties.type3Workflow) {
                    if (response) {
                        log.info(`Completed ${properties.type3Workflow} flow`);

                    } else {
                        log.error(`Failed to complete ${properties.type3Workflow} flow`);
                        log.info('Terminating flow');

                    }
                }
            });
        }

        tempThis.makeBackendCall(url, body, method, expectedStatusCode);

    }

    logFailedRecord(errObj) {
        var failedRecord = commonUtil.getFailedRecordObj(
            this.currentFlowCall,
            errObj.failedAt,
            errObj.errorDescription
        );

        failedRecord.gitURL = this.gitURL;

        logFailedRecord.debug(JSON.stringify(failedRecord));
    }

    constructError(failedAt, errorDescription) {
        var error = {
            'failedAt': failedAt,
            'errorDescription': errorDescription
        };
        return error;
    }
}

module.exports = Service1Flow;
module.exports.setLogger = setLogger;