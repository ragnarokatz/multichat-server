const debug = require('debug')('api:test:account');
const { validateAccount } = require('../../controllers/account');

describe('username validation tests', () => {
  let testData = [
    {
      username: 'goodname',
      description: 'good description',
      age: 13,
    },
    {
      description: 'good description',
      age: 13,
    },
    {
      username: null,
      description: 'good description',
      age: 13,
    },
    {
      username: '',
      description: 'good description',
      age: 13,
    },
    {
      username: 'good name',
      description: 'good description',
      age: 13,
    },
    {
      username: 'good_name',
      description: 'good description',
      age: 13,
    },
    {
      username: 'superlongnameomg',
      description: 'good description',
      age: 13,
    },
    {
      username: 'short',
      description: 'good description',
      age: 13,
    },
  ];

  it('should be good for proper data', async () => {
    await expect(validateAccount(testData[0])).resolves.toBeTruthy();
  });
  it('should be bad for missing username', async () => {
    await expect(validateAccount(testData[1])).rejects.toThrow();
  });
  it('should be bad for null username', async () => {
    await expect(validateAccount(testData[2])).rejects.toThrow();
  });
  it('should be bad for empty username', async () => {
    await expect(validateAccount(testData[3])).rejects.toThrow();
  });
  it('should be bad for name with spaces', async () => {
    await expect(validateAccount(testData[4])).rejects.toThrow();
  });
  it('should be bad for name with symbols', async () => {
    await expect(validateAccount(testData[5])).rejects.toThrow();
  });
  it('should be bad for long name', async () => {
    await expect(validateAccount(testData[6])).rejects.toThrow();
  });
  it('should be bad for short name', async () => {
    await expect(validateAccount(testData[7])).rejects.toThrow();
  });
});

describe('description validation tests', () => {
  let testData = [
    {
      username: 'goodname',
      description: 'good description',
      age: 13,
    },
    {
      username: 'goodname',
      age: 13,
    },
    {
      username: 'goodname',
      description: null,
      age: 13,
    },
    {
      username: 'goodname',
      description: '',
      age: 13,
    },
    {
      username: 'goodname',
      description: 'good description and beyond',
      age: 13,
    },
    {
      username: 'goodname',
      description: 'good description, and beyond.',
      age: 13,
    },
    {
      username: 'goodname',
      description: 'good description_and beyond.',
      age: 13,
    },
    {
      username: 'goodname',
      description: 'good description and beyond over the character limit right.',
      age: 13,
    },
    {
      username: 'goodname',
      description: 's',
      age: 13,
    },
  ];

  it('should be good for proper data', async () => {
    await expect(validateAccount(testData[0])).resolves.toBeTruthy();
  });
  it('should be bad for missing description', async () => {
    await expect(validateAccount(testData[1])).rejects.toThrow();
  });
  it('should be bad for null description', async () => {
    await expect(validateAccount(testData[2])).rejects.toThrow();
  });
  it('should be bad for empty description', async () => {
    await expect(validateAccount(testData[3])).rejects.toThrow();
  });
  it('should be good for description with spaces', async () => {
    await expect(validateAccount(testData[4])).resolves.toBeTruthy();
  });
  it('should be good for description with allowed symbols', async () => {
    await expect(validateAccount(testData[5])).resolves.toBeTruthy();
  });
  it('should be bad for description with disallowed symbols', async () => {
    await expect(validateAccount(testData[6])).rejects.toThrow();
  });
  it('should be bad for long description', async () => {
    await expect(validateAccount(testData[7])).rejects.toThrow();
  });
  it('should be bad for short description', async () => {
    await expect(validateAccount(testData[7])).rejects.toThrow();
  });
});

describe('age validation tests', () => {
  let testData = [
    {
      username: 'goodname',
      description: 'good description',
      age: 13,
    },
    {
      username: 'goodname',
      description: 'good description',
    },
    {
      username: 'goodname',
      description: 'good description',
      age: null,
    },
    {
      username: 'goodname',
      description: 'good description',
      age: '',
    },
    {
      username: 'goodname',
      description: 'good description',
      age: 60.55,
    },
    {
      username: 'goodname',
      description: 'good description',
      age: 140,
    },
    {
      username: 'goodname',
      description: 'good description',
      age: -30,
    },
  ];

  it('should be good for proper data', async () => {
    await expect(validateAccount(testData[0])).resolves.toBeTruthy();
  });
  it('should be bad for missing age', async () => {
    await expect(validateAccount(testData[1])).rejects.toThrow();
  });
  it('should be bad for null age', async () => {
    await expect(validateAccount(testData[2])).rejects.toThrow();
  });
  it('should be bad for wrong data type for age', async () => {
    await expect(validateAccount(testData[3])).rejects.toThrow();
  });
  it('should be bad for non integer value for age', async () => {
    await expect(validateAccount(testData[3])).rejects.toThrow();
  });
  it('should be bad for age being too big', async () => {
    await expect(validateAccount(testData[3])).rejects.toThrow();
  });
  it('should be bad for age being too small', async () => {
    await expect(validateAccount(testData[3])).rejects.toThrow();
  });
});
