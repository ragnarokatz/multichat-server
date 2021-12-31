const debug = require('debug')('api:test:server');
const request = require('supertest');
const app = require('../../app');
const pool = require('../../database/pool');

let id = 0;

beforeAll(async () => {
  try {
    const db = await pool.connect();
    await db.query(`CREATE TABLE IF NOT EXISTS accounts (
      id serial PRIMARY KEY,
      email varchar(30) NOT NULL UNIQUE,
      passhash varchar(60) NOT NULL,
      verified BOOLEAN NOT NULL DEFAULT FALSE
  );`);
  } catch (err) {
    debug(err);
  }
});

afterAll(async () => {
  try {
    // cleanup
    let db = await pool.connect();
    await db.query(`DELETE FROM accounts WHERE id = '${id}';`);
    await pool.close();
  } catch (err) {
    debug(err);
  }
});

describe('api endpoint testing', () => {
  let token;
  let registerData = {
    email: 'herpdaderp@gmail.com',
    password: '1234Password',
    confirmPassword: '1234Password',
  };

  let badRegisterData = {
    email: 'herpdaderp@gmail.com',
    password: '1234Password',
    confirmPassword: '34DSFsdfsfc',
  };

  let loginData = {
    email: 'herpdaderp@gmail.com',
    password: '1234Password',
  };

  let badLoginData = {
    email: 'herpdaderp@gmail.com',
    password: '34DSFsdfsfc',
  };

  it('visiting root', () => {
    return request(app).get('/').expect(200);
  });

  it('visiting undefined route', () => {
    return request(app).get('/undefined').expect(404);
  });

  it('visiting protected route', () => {
    return request(app).get('/protected').expect(403);
  });

  it('registering account', (done) => {
    request(app)
      .post('/account/register')
      .send(registerData)
      .expect(200)
      .end((err, res) => {
        expect(res.body).toHaveProperty('id');
        id = res.body.id;
        done();
      });
  });

  it('registering account with invalid credentials', () => {
    request(app).post('/account/register').send(badRegisterData).expect(404);
  });

  it('logging in with invalid credentials', () => {
    request(app).post('/account/login').send(badLoginData).expect(404);
  });

  it('logging in with valid credentials', (done) => {
    request(app)
      .post('/account/login')
      .send(loginData)
      .expect(200)
      .end((err, res) => {
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
        done();
      });
  });

  it('validating a valid token', () => {
    request(app).post('/account/validate').send({ token: token }).expect(404);
  });

  it('validating an invalid token', () => {
    request(app)
      .post('/account/validate')
      .send({ token: '198347189ksdfjklwior5.o0234-sdfa' })
      .expect(404);
  });

  it('visiting protected route', () => {
    console.log(token);
    return request(app).get('/protected').set('Authorization', `Bearer ${token}`).expect(200);
  });
});
