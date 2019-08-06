/*
###############################################################################
#                        S C R I P T  H E A D E R                             #
###############################################################################
#          Script           :    NodeServer.js                                #
#                                                                             #
#          Description      :    Entry point for this application.            #
#                                Creates server and initiates the flow.       #
#                                                                             #
###############################################################################
*/

const http = require('http');
const properties = require('./Properties');
const CommonUtilClass = require('./CommonUtil');
const Service1 = require('./Service1');
const EventEmitter = require('events');
const crypto = require('crypto');

const commonUtil = new CommonUtilClass();
var service1;

const loggers = commonUtil.getLoggers();
const log = loggers.logType1;
const logFailedRecord = loggers.logFailedRecord;
Service1.setLogger(log, logFailedRecord);

process.on('uncaughtException', function (err) {
    // handle the error safely
    log.error('Exception occurred');
    log.error(err);
});

class NodeServerClass extends EventEmitter {

    createServer() {
        log.info(`Starting server`);

        http.createServer((req, res) => {
            log.info();
            log.info('---------------------------------------------------------------');
            res.statusCode = 200;
            res.setHeader('Content-type', 'text/plain');
            res.write(`Hello World! : ${req.url}`);
            res.end();

            var tempThis = this;
            var chunks = [];

            req.on('data', (d) => {
                chunks.push(d);

            }).on('end', function () {

                if (req.headers) {

                    var data = Buffer.concat(chunks);

                    /*
                    let sig = "sha1=" + crypto.createHmac('sha1', properties.secret).update(data.toString()).digest('hex');

                    if (req.headers['x-hub-signature'] == sig) {
                        log.info("Valid Secret");
                    */

                    log.info(`Header:`);
                    log.info(req.headers);                    

                    var body = ""
                    if (data.length > 0 && req.headers['content-type'] && req.headers['content-type'].indexOf('application/json') > -1) {
                        body = JSON.parse(data, 'utf-8');
                    }

                    var request = { 'request': req, 'body': body };
                    log.info(`Body:`);
                    log.info(request.body);

                    tempThis.initiateFlow(request);

                    /*
                    } else {
                        log.error("Invalid Secret");
                        log.info('Terminating flow');
                    }
                    */
                } else {
                    log.error('Headers not found');
                    log.info('Terminating flow');
                }

            }).on('error', (e) => {
                log.error(e);
            });

        }).listen(properties.nodeServerListenerPort, properties.nodeServerHostname, () => {
            log.info('Server started at port ' + properties.nodeServerListenerPort);
        });
    }

    initiateFlow(requestObj) {

        service1 = new Service1();
        log.info(`URL: ${requestObj.request.url}`);

        if (requestObj.request.url === '/array') {

            var data = {
                'array': ['cat', 'rat', 'bat', 'cat', 'rat', 'bat']
            };

            service1.service1Flow(data);

        } else if (requestObj.request.url === '/shellscript') {
            service1.service2Flow();

        } else if (requestObj.request.url === '/apicall') {
            service1.service3Flow(requestObj.body);

        }

    }
}

const nodeServer = new NodeServerClass();
nodeServer.createServer();