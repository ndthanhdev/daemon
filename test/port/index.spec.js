const port = require('../../src/port');
const IOTA = require('iota.lib.js');

jest.mock('iota.lib.js');
let iota = {
    api: {
        getNewAddress: jest.fn((seed, callback) => callback()),
        sendTransfer: jest.fn((seed, depth, minWeightMagnitude, transfers, callback) => callback())
    }
};
IOTA.mockImplementation(() => iota);

describe('commitChange', async () => {
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    test('Should create an IOTA object', async () => {
        await port.commitChange({
            sProvider: '',
            sSeed: ''
        });
        expect(IOTA).toHaveBeenCalledTimes(1);
    });
    test('Should generate an IOTA address', async () => {
        await port.commitChange({
            sProvider: '',
            sSeed: ''
        });
        expect(iota.api.getNewAddress).toHaveBeenCalledTimes(1);
    });
    test('Should send a tranfer', async () => {
        await port.commitChange({
            sProvider: '',
            sSeed: ''
        });
        expect(iota.api.sendTransfer).toHaveBeenCalledTimes(1);
    });
});
