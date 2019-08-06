/*
###############################################################################
#                        S C R I P T  H E A D E R                             #
###############################################################################
#          Script           :    CommonUtill.js                               #
#                                                                             #
#          Description      :    Common functions                             #
#                                                                             #
###############################################################################
#                   H I S T O R Y   O F   C H A N G E S                       #
###############################################################################
# Import Pacakages                                                            #
#-----------------------------------------------------------------------------#
# Properties.js                                                               #
# http                                                                        #
# events                                                                      #
# log4js                                                                      #
# fs                                                                          #
###############################################################################
*/

const properties = require('./Properties');
const http = require('http');
const EventEmitter = require('events');
const log4js = require('log4js');
const fs = require('fs');

log4js.configure({
    everything: {
        type: 'dateFile',
        filename:
            [
                `${properties.logsPath}/Common.log`,
                `${properties.logsPath}/Type1.log`,
                `${properties.logsPath}/Type2.log`,
                `${properties.logsPath}/FailedRecords.log`
            ],
        pattern: '.yyyy-MM-dd-hh'
    },
    appenders: {
        common: { type: 'file', filename: `${properties.logsPath}/Common.log` },
        type1Log: { type: 'file', filename: `${properties.logsPath}/Type1.log` },
        type2Log: { type: 'file', filename: `${properties.logsPath}/Type2.log` },
        failedRecords: { type: 'file', filename: `${properties.logsPath}/FailedRecords.log` },
        out: { type: 'stdout', layout: { type: 'coloured' } }
    },
    categories: {
        default: { appenders: ['out', 'common'], level: 'debug' },
        'common': { appenders: ['out', 'common'], level: 'debug' },
        'type1Log': { appenders: ['type1Log', 'out', 'common'], level: 'debug' },
        'type2Log': { appenders: ['type2Log', 'out', 'common'], level: 'debug' },
        'failedRecord': { appenders: ['failedRecords', 'out', 'common'], level: 'debug' }
    }
});

const logType1 = log4js.getLogger('type1Log');
const logType2 = log4js.getLogger('type2Log');
const logFailedRecord = log4js.getLogger('failedRecord');
const logCommon = log4js.getLogger('common');

var log = '';

function setLogger(logger) {
    logCommon.info('Entered: setLogger---------------------------------------------------------------');

    log = logger;
    log.info(`Log: ${log}`);

    logCommon.info('Exiting: setLogger---------------------------------------------------------------');
}

class CommonUtillClass extends EventEmitter {
    constructor() {
        super();
        
        this.doneCount = 0;
    }

    getLoggers() {
        logCommon.info('Entered: getLoggers---------------------------------------------------------------');
        const loggers = {
            'logCommon': logCommon,
            'logType1': logType1,
            'logType2': logType2,
            'logFailedRecord': logFailedRecord
        };

        logCommon.info('Exiting: getLoggers---------------------------------------------------------------');
        return loggers;
    }

    readFile(path) {
        log.info('Entered: readFile---------------------------------------------------------------');
        log.info(`Reading file: ${path}`);

        var fileData = fs.readFileSync(path).toString();

        log.info(`File content:`);
        log.info(fileData);

        log.info('Exiting: readFile---------------------------------------------------------------');
        return fileData;
    }

    getJsonFromFile(filename) {
        log.info('Entered: getJsonFromFile---------------------------------------------------------------');

        var fileData = this.readFile(filename);
        var jsonString = fileData.slice(fileData.indexOf('{'), fileData.lastIndexOf('}') + 1);
        var jsonObj;

        try {
            jsonObj = JSON.parse(jsonString);

        } catch (err) {
            log.error(`Failed to parse JSON string in ${filename}.`);
            log.error(err);
            return false;
        }

        log.info(`JSON in file ${filename}:`);
        log.info(jsonObj);

        log.info('Exiting: getJsonFromFile---------------------------------------------------------------');
        return jsonObj;
    }

    makeHttpCall(args, key) {
        log.info('Entered: makeHttpCall---------------------------------------------------------------');

        const req = http.request(args.options, (res) => {
            log.info('StatusCode: ', res.statusCode);
            log.info('Headers: ', res.headers);

            var tempThis = this;
            var chunks = [];

            res.on('data', (d) => {
                chunks.push(d);

            }).on('end', function () {
                var data = Buffer.concat(chunks);
                log.info(`Response body: ${data.toString()}`);
                
                var body = "";
                if (data.length > 0 && res.headers['content-type'] && res.headers['content-type'].indexOf('application/json') > -1 ) {
                    body = JSON.parse(data, 'utf-8');
                }

                var response = { 'statusCode': res.statusCode, 'headers': res.headers, 'body': body };
                log.info("Response constructed:");
                log.info(response);

                tempThis.emit(`response${key}`, response);

            }).on('error', (e) => {
                log.error(e);
            });

        }).on('error', (e) => {
            log.error(e);
        });

        req.write(args.dataString);
        req.end();

        log.info(`Request:`);
        log.info(req);

        log.info('Exiting: makeHttpCall---------------------------------------------------------------');
    }

    getFailedRecordObj(flow, failedAt, errorDescription) {

        var failedRecord = {
            'flow': flow,
            'failedAt': failedAt,
            'errorDescription': errorDescription
        };
        return failedRecord;
    }

    IterateOver(list, iterator, callback) {
        var tempThis = this;

        function report(listObj) {
            tempThis.doneCount++;
            if (tempThis.doneCount === list.length) {
                callback();
            }

        }

        for (var i = 0; i < list.length; i++) {
            iterator(list[i], report)
        }
    }
}

module.exports = CommonUtillClass;
module.exports.setLogger = setLogger;