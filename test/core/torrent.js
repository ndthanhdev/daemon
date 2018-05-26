const MemoryStream = require('memorystream');
const { getMagnetUri } = require('../../src/core/torrent');
var fs = require('fs');

describe('torrent', () => {
    it('getMagnetUrl', async () => {
        var stream = new MemoryStream([]);
        // const sMagnetUriTask = getMagnetUri(stream);
        let ts = fs.createReadStream('C:\\Users\\i348613\\Downloads\\expr\\local-seeder\\test');
        const sMagnetUriTask = getMagnetUri(ts);
        const sMagnetUri = await sMagnetUriTask;
        expect(typeof sMagnetUri).toEqual('string');
    });
});