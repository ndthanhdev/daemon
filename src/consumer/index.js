/**
 * Lib imports
 */
const uuid = require('uuid/v4');
const BPromise = require('bluebird');
const { createReadStream, stat } = require('fs');
const { basename, join } = require('path');
const { createGzip } = require('zlib');
const { pick } = require('ramda');
const { seed } = require('../core/torrent');

/**
 * Project imports
 */
const { promptHeaderP } = require('../core/prompt');
const CM = require('../config-manager');
const SM = require('../space-manager');
const api = require('../core/api');
const ContractService = require('@open-bucket/contracts');
const { splitToDiskP } = require('../core/file');
const { createCipher } = require('../core/crypto');

// IMPORTANT:
// We don't handle errors here since they will not be propagated to CLI or Client.
// CLI or Client needs to handle errors on their own.

function getConsumersP() {
    return api.get({ url: '/consumers', token: CM.configs.authToken });
}

async function createConsumerP({tier, name}) {
    function printNewConsumerInfo({key, space, config}) {
        console.log('Generated a new consumer key:', key);
        console.log('Created new consumer space at:', space);
        console.log('Created new consumer config at:', config);
async function createConsumerP({ address }) {
    const newConsumerInfo = await api.post({ url: '/consumers', body: { address }, token: CM.configs.authToken });
    const { id } = newConsumerInfo;
    const key = uuid();
    console.log('Generated a new consumer key:', key);
    console.log('OBN Daemon will use this consumer key to encrypt/decrypt your data, please save this key in a secure place');

    const space = await SM.makeConsumerSpace(id);
    console.log('Created new consumer space at:', space);

    const consumerConfigFilePath = await CM.writeConsumerConfigFileP(id, { id, key, space });
    console.log('Created new consumer config at:', consumerConfigFilePath);

    return newConsumerInfo;
}

async function updateConsumerP(consumer) {
    const newConsumerInfo = await api.put({ url: `/consumers/${consumer.id}`, body: consumer, token: CM.configs.authToken });
    console.log('Updated consumer: ', newConsumerInfo);

    return newConsumerInfo;
    
}

// If file is larger than 1GB -> shard. Not always shard
// maxFileSize = 1GB - Producer will have their min sizeLimit is 1GB
// If file = 10GB => 10 parts

// shard is not needed to increase security & performance
// since if file is < 1GB, it is not sharded => 1 torrent file => every producer serving that torrent will serve parts of that file
// => torrent increase the performance for us


// Using key
// encrypt the file: const encryptedReadStream = fs.createReadStream(filePath).pipe(encrypt)
// [later] shard the file: DEFAULT: 5 parts, min size: 10 MB
//  - decide size of the shard.
//  - uses: https://github.com/dannycho7/split-file-stream
//  - to consumer space
// for each shard ->


async function _prepareFileP({ filePath, key, space }) {
    if (!key) {
        return BPromise.reject(new Error('Consumer key is not found'));
    }

    const consumerInfo = await api.post({url: '/consumers', body: {tier, name}, token: CM.configs.authToken});

    const key = uuid();
    const space = await SM.makeConsumerSpace(consumerInfo.id);
    const config = await CM.writeConsumerConfigFileP(consumerInfo.id, {id: consumerInfo.id, key, space});

    printNewConsumerInfo({key, space, config});

    return consumerInfo;
    if (!inputFileStat.size) {
        return BPromise.reject(new Error('File is empty'));
    }

    const GB_SIZE = Math.pow(1024, 3);
    // consumerSpace = ~/.open-bucket/spaces/consumer-1
    // filePath = ~/somewhere/asd.pdf
    const rootFileName = join(space, basename(filePath));
    const encryptedFileStream = createReadStream(filePath)
        .pipe(createCipher(key))
        .pipe(createGzip());
    return await splitToDiskP(encryptedFileStream, GB_SIZE, rootFileName);
}

function createConsumerActivationP({consumerId, accountIndex, value}) {
    return ContractService.createConsumerActivationP({consumerId, accountIndex, value});

// TODO: allow user to add consumer config
async function uploadFile({ name, filePath, consumerId }) {
    console.log('Start uploading process...');
    console.log('> Please don\'t open/modify the file in during the process');

    // CASES:
    // - read consumer config file failed
    // - make sure consumer space is present
    // - filePath is invalid
    const shards = await CM.readConsumerConfigFileP(consumerId)
        .then(({ key, space }) => _prepareFileP({ filePath, key, space }));
    const streams = shards.map(shard => createReadStream(shard));
    const magnetUris = await Promise.all(streams.map(stream => seed(stream)));
    const file = await api.post({ url: '/files', body: { magnetUris, name, consumerId }, token: CM.configs.authToken });
    return file;
}

module.exports = {
    createConsumerP,
    updateConsumerP,
    getConsumersP,
    createConsumerActivationP
    uploadFilePromptP,
    uploadFile
};
