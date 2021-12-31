const debug = require('debug')('api:test:account:registration');
const { validateRegister } = require('../../controllers/account');

describe('registration email validation tests', () => {
  let testData = [
    {
      email: 'herpdaderp@gmail.com',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: null,
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: 123192847,
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: '',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: 'akdfajkl',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: 'akdfajkl90812901',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: '@lkfdjslfkj',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: 'lkfdjslfkj@@',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: '@@lkfdjslfkj',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: 'lkfdjsl@@fkj',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: 'lkfdjslfkj@sand.gov',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: 'lkfdjslfkj@asdfasf.qccc',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: 'lkfdjslfkj@asdfasf.q',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: 'a@gma.com',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: 'a091234581290548293045zxdfgzxgfbszfgddsg5829035809254809@gmail.com',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
  ];

  it('should be good for proper data', async () => {
    await expect(validateRegister(testData[0])).resolves.toBeTruthy();
  });

  for (let i = 1; i < testData.length; i++) {
    it('should be bad for malformed data', async () => {
      await expect(validateRegister(testData[i])).rejects.toThrow();
    });
  }
});

describe('registration password validation tests', () => {
  let testData = [
    {
      email: 'herpdaderp@gmail.com',
      password: '1234Password',
      confirmPassword: '1234Password',
    },
    {
      email: 'herpdaderp@gmail.com',
      confirmPassword: '1234Password',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: null,
      confirmPassword: '1234Password',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: 123513986,
      confirmPassword: '1234Password',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: 'zX',
      confirmPassword: '1234Password',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: 'zX9230481209lkjflkfsjakfljakfl23o4',
      confirmPassword: '1234Password',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: 'zX9230481209lk.-',
      confirmPassword: '1234Password',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: '1234Password',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: '1234Password',
      confirmPassword: null,
    },
    {
      email: 'herpdaderp@gmail.com',
      password: '1234Password',
      confirmPassword: 512365688,
    },
    {
      email: 'herpdaderp@gmail.com',
      password: '1234Password',
      confirmPassword: 'adfas',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: '1234Password',
      confirmPassword: 'adf2132314jklkdjf982354ulkdjsfmkldfas',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: '1234Password',
      confirmPassword: 'adf@#@dsfj-0as',
    },
    {
      email: 'herpdaderp@gmail.com',
      password: 'hueHewlkjkldfs1',
      confirmPassword: '1234Password',
    },
  ];

  it('should be good for proper data', async () => {
    await expect(validateRegister(testData[0])).resolves.toBeTruthy();
  });

  for (let i = 1; i < testData.length; i++) {
    it('should be bad for malformed data', async () => {
      await expect(validateRegister(testData[i])).rejects.toThrow();
    });
  }
});
