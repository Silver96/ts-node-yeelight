import { Yeelight } from '../src';

describe('Yeelight instance setup', () => {

    let instance: Yeelight;

    beforeEach(() => {
        instance = new Yeelight({ discoveryTimeoutSeconds: 2 });
    });

    it('Instance can listen', async () => {
        await instance.listen();
        await instance.close();
    }, 2000);

    it('Instance can discover', async () => {
        await instance.discover();
        expect(instance.devices).toHaveLength(2);
        expect(instance.devices).toEqual(expect.arrayContaining([expect.objectContaining({ id: '0x0000000005ed214f' })]));
    });
});
