const createTorrent = require('create-torrent');
const parseTorrent = require('parse-torrent');
const { promisify } = require('util');

/**
 * 
 * Generate 
 * @param {ReadableStream} oStream 
 * @returns {string}
 */
async function getMagnetUri(oStream) {
    const torrentBuffer = await promisify(createTorrent)(oStream);
    const torrentInfo = parseTorrent(torrentBuffer);
    const uri = parseTorrent.toMagnetURI(torrentInfo);
    return uri;
}

module.exports = {
    getMagnetUri
};