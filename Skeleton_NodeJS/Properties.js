/*
###############################################################################
#                        S C R I P T  H E A D E R                             #
###############################################################################
#          Script           :    Properties.js                                #
#                                                                             #
#          Description      :    Holds all the constant property values       #
#                                                                             #
###############################################################################
*/


//  Node server details
const nodeServerHostname = 'localhost'; // loopback address 127.0.0.1
const nodeServerListenerPort = '7001';  

module.exports.nodeServerHostname = nodeServerHostname;
module.exports.nodeServerListenerPort = nodeServerListenerPort;


// Backend API call details
const backendHost = 'localhost';
const backendPort = 7000;
//const authorizationKey = 'Basic a3VtYXJhOnRoYnMxMjMj';

module.exports.backendHost = backendHost;
module.exports.backendPort = backendPort;
//module.exports.authorizationKey = authorizationKey;


// Secret key passed by GitHub on each webhook POST
const secret = "demokey";
module.exports.secret = secret;


// Log details
const logsPath = './logs/';
module.exports.logsPath = logsPath;


//Script filename
const demoScript = 'DemoScript.sh';
module.exports.demoScript = demoScript;


// Workflow type
const type1Workflow = 'type1';
const type2Workflow = 'type2';
const type3Workflow = 'type3';
module.exports.type1Workflow = type1Workflow;
module.exports.type2Workflow = type2Workflow;
module.exports.type3Workflow = type3Workflow;


// API path prefixes
const pathPrefixForBackendAPI = '/n4smh/api';
module.exports.pathPrefixForBackendAPI = pathPrefixForBackendAPI;

// User defined values
const gitURL = `https://github.com/n4smh/Skeleton_NodeJS.git`;
module.exports.gitURL = gitURL;