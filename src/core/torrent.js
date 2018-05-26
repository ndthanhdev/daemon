const createTorrent = require('create-torrent');
const { promisify } = require('util');
const parseTorrent = require('parse-torrent');
const crypto = require('crypto');

/**
 * 
 * Generate 
 * @param {ReadableStream} oStream 
 * @returns {string}
 */
async function getMagnetUri(oStream) {
    const hashPipe = crypto.createHash('MD5');
    await promisify(oStream.pipe(hashPipe).one)('end');
    const hash = hashPipe.read();
    const magnetUri = parseTorrent.toMagnetURI({ infoHash: endTask });
    return magnetUri;
}

module.exports = {
    getMagnetUri
};