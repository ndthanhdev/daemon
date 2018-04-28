const util = require('util');
const IOTA = require('iota.lib.js');
const TAG = require('./tag');


// This specifies the number of bundles you will walk back and confirm.
const DEPTH = 3;
// 	This is the minimum weight magnitude (MWM) that specifies how mwm proof of work is required. On the testnet, anything less than 9 is not going to be accepted
const MWM = 14;

exports.commitChange = async (
    {
        sProvider,
        sSeed,
        sUris = {},
    }) => {
    const iota = new IOTA({ provider: sProvider });
    const address = await util.promisify(iota.api.getNewAddress)(sSeed);
    const message = {
        sUris,
    };
    const transfers = [
        {
            value: 0,
            address,
            message,
            tag: TAG.DATA,
        },
    ];
    await util.promisify(iota.api.sendTransfer)(sSeed, DEPTH, MWM, transfers);
};
