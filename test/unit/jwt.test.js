const debug = require('debug')('api:test:jwt');
const { verify, sign } = require('../../utils/jwt');

describe('tests for jwt functions', () => {
  let testData = [
    {
      username: 'goodname',
      description: 'good description',
      age: 13,
    },
    234235128798,
  ];

  let validToken;
  let invalidToken = 'lkafjdalkfjalkadsklfdja';

  it('should be good for valid payload', async () => {
    validToken = await sign(testData[0]);
    await expect(sign(testData[0])).resolves.toBeTruthy();
  });
  it('should be bad for invalid payload', async () => {
    await expect(sign(testData[1])).rejects.toThrow();
  });
  it('should be good for valid token', async () => {
    await expect(verify(validToken)).resolves.toBeTruthy();
  });
  it('should be bad for invalid token', async () => {
    await expect(verify(invalidToken)).rejects.toThrow();
  });
});
