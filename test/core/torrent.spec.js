const MemoryStream = require('memorystream');
const { getMagnetUri } = require('../../src/core/torrent');

describe('torrent', () => {
    let stream;
    beforeEach(() => {
        stream = new MemoryStream([]);
    });

    it('getMagnetUri', async () => {
        var getUriTask = getMagnetUri(stream);
        stream.end('Abcd1234');
        let magnetUri = await getUriTask;
        expect(typeof magnetUri).toBe('string'); // hash of Abcd1234
    }, 5000);
});
