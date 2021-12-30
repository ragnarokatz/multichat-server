const debug = require('debug')('api:test:server');
const request = require('supertest');
const app = require('../../app');
const pool = require('../../database/pool');

beforeAll(async () => {
  try {
    const db = await pool.connect();
    await db.query(`CREATE TABLE IF NOT EXISTS accounts (
    id serial PRIMARY KEY,
    username varchar(12) NOT NULL,
    description varchar(30) NOT NULL,
    age int NOT NULL
);`);
  } catch (err) {
    debug(err);
  }
});

afterAll(async () => {
  try {
    await pool.close();
  } catch (err) {
    debug(err);
  }
});

describe('api endpoint testing', () => {
  let id = 0;
  let testData = {
    username: 'goodname',
    description: 'good description',
    age: 13,
  };

  let badData = {
    username: 'goodname',
    description: 'good description_nope',
    age: 13,
  };

  it('visiting root', () => {
    return request(app).get('/').expect(200);
  });

  it('visiting undefined route', () => {
    return request(app).get('/undefined').expect(404);
  });

  it('adding account', (done) => {
    request(app)
      .post('/accounts/add')
      .send(testData)
      .expect(200)
      .end((err, res) => {
        expect(res.body).toHaveProperty('id');
        id = res.body.id;
        done();
      });
  });

  it('adding account with bad data', () => {
    return request(app).post('/accounts/add').send(badData).expect(404);
  });

  it('getting account', (done) => {
    request(app)
      .get('/accounts/' + id)
      .expect(200)
      .end((err, res) => {
        expect(res.body).toMatchObject(testData);
        done();
      });
  });

  it('getting account that does not exist', () => {
    return request(app).get('/accounts/9571234').expect(404);
  });

  it('getting all accounts', () => {
    return request(app).get('/accounts').expect(200);
  });

  it('updating account', () => {
    return request(app)
      .put('/accounts/' + id)
      .send(testData)
      .expect(200);
  });

  it('updating account with bad data', () => {
    return request(app)
      .put('/accounts/' + id)
      .send(badData)
      .expect(404);
  });

  it('deleting account', () => {
    return request(app)
      .delete('/accounts/' + id)
      .expect(200);
  });
});
