/**
 * Lib imports
 */
const WebSocket = require('ws');
const BPromise = require('bluebird');

/**
 * Project imports
 */
const CM = require('../config-manager');
const {WS_TYPE} = require('../enums');

// returns Promise(wsClient)
function connectTrackerServerP(metadata) {
    return new BPromise((resolve, reject) => {
        const wsClient = new WebSocket(CM.configs.trackerWS, {
            headers: {
                'Authorization': CM.configs.authToken,
                'ws-metadata': JSON.stringify(metadata)
            }
        });
        wsClient
            .once('open', () => resolve(wsClient))
            .once('error', reject);

        wsClient.sendP = message => new BPromise(resolve => {
            wsClient.send(message, resolve);
        });
    });
}

function connectProducerP(id) {
    return connectTrackerServerP({type: WS_TYPE.PRODUCER, id});
}

function connectConsumerP(id) {
    return connectTrackerServerP({type: WS_TYPE.CONSUMER, id});
}

module.exports = {
    connectProducerP,
    connectConsumerP
};
