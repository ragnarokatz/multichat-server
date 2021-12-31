const debug = require('debug')('api:test:account:login');
const { validateLogin } = require('../../controllers/account');

describe('login email validation tests', () => {
  let testData = [
    {
      email: 'herpdaderp@gmail.com',
      password: '1234Password',
    },
    {
      password: '1234Password',
    },
    {
      email: null,
      password: '1234Password',
    },
    {
      email: 123192847,
      password: '1234Password',
    },
    {
      email: '',
      password: '1234Password',
    },
    {
      email: 'akdfajkl',
      password: '1234Password',
    },
    {
      email: 'akdfajkl90812901',
      password: '1234Password',
    },
    {
      email: '@lkfdjslfkj',
      password: '1234Password',
    },
    {
      email: 'lkfdjslfkj@@',
      password: '1234Password',
    },
    {
      email: '@@lkfdjslfkj',
      password: '1234Password',
    },
    {
      email: 'lkfdjsl@@fkj',
      password: '1234Password',
    },
    {
      email: 'lkfdjslfkj@sand.gov',
      password: '1234Password',
    },
    {
      email: 'lkfdjslfkj@asdfasf.qccc',
      password: '1234Password',
    },
    {
      email: 'lkfdjslfkj@asdfasf.q',
      password: '1234Password',
    },
    {
      email: 'a@gma.com',
      password: '1234Password',
    },
    {
      email: 'a091234581290548293045zxdfgzxgfbszfgddsg5829035809254809@gmail.com',
      password: '1234Password',
    },
    {
      email: 'a091234581290548293045zxdfgzxgfbszfgddsg5829035809254809@gmail.com',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
  ];

  it('should be good for proper data', async () => {
    await expect(validateLogin(testData[0])).resolves.toBeTruthy();
  });

  for (let i = 1; i < testData.length; i++) {
    it('should be bad for malformed data', async () => {
      await expect(validateLogin(testData[i])).rejects.toThrow();
    });
  }
});

describe('login password validation tests', () => {
  let testData = [
    {
      email: 'herpdaderp@gmail.com',
      password: '1234Password',
    },
    {
      email: 'herpdaderp@gmail.com',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: null,
    },
    {
      email: 'herpdaderp@gmail.com',
      password: 123513986,
    },
    {
      email: 'herpdaderp@gmail.com',
      password: 'zX',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: 'zX9230481209lkjflkfsjakfljakfl23o4',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: 'zX9230481209lk.-',
    },
  ];

  it('should be good for proper data', async () => {
    await expect(validateLogin(testData[0])).resolves.toBeTruthy();
  });

  for (let i = 1; i < testData.length; i++) {
    it('should be bad for malformed data', async () => {
      await expect(validateLogin(testData[i])).rejects.toThrow();
    });
  }
});
