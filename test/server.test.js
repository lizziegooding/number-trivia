'use strict';

const test = require('tape');
const supertest = require('supertest');
const app = require('../server.js');

let id;

test('200 GET - /', async (t) => {
  const res = await supertest(app)
    .get('/')
    .expect(200);
  t.deepEqual(res.body, { api: 'number-trivia' }, 'retrieves base route');
  t.end();
});

test('201 POST - /questions', async (t) => {
  const res = await supertest(app)
    .post('/questions')
    .send({ question: 'How old is Bernie Sanders?', answer: 78 })
    .expect(201);
  t.ok(res.body.id, 'creates a question');
  id = res.body.id;
  t.end();
});

test('200 GET - /questions/:id', async (t) => {
  const res = await supertest(app)
    .get(`/questions/${id}`)
    .expect(200);
  t.deepEqual(res.body, { id: id, question: 'How old is Bernie Sanders?', answer: 78 }, 'retrieves a question by id');
  t.end();
});

test('200 GET - /questions', async (t) => {
  const res = await supertest(app)
    .get('/questions')
    .expect(200);
  t.deepEqual(res.body, [{ id: id, question: 'How old is Bernie Sanders?', answer: 78 }], 'lists all questions');
  t.end();
});

test('201 PUT - /questions/id', async (t) => {
  const res = await supertest(app)
    .put('/questions/1')
    .send({ question: 'How many Dalai Lamas have there been?', answer: 14 })
    .expect(201);
  t.deepEqual(res.body, { id: '1', question: 'How many Dalai Lamas have there been?', answer: 14 }, 'creates a new question on if the id doesn\'t exist');
  t.end();
});

test('200 PUT - /questions/id', async (t) => {
  const res = await supertest(app)
    .put(`/questions/${id}`)
    .send({ question: 'What year was Bernie Sanders born?', answer: 1940 })
    .expect(200);
  t.deepEqual(res.body, { id: id, question: 'What year was Bernie Sanders born?', answer: 1940 }, 'replaces an existing question if the id doesn\'t exist');
  t.end();
});

test('200 PATCH - /questions/id', async (t) => {
  const res = await supertest(app)
    .patch(`/questions/${id}`)
    .send({ answer: 1941 })
    .expect(200);
  t.deepEqual(res.body, { id: id, question: 'What year was Bernie Sanders born?', answer: 1941 }, 'updates a portion of the question');
  t.end();
});

test('204 DELETE - /questions/id', async (t) => {
  const res = await supertest(app)
    .delete(`/questions/${id}`)
    .expect(204);
  t.deepEqual(res.body, {}, 'deletes a question');
  t.end();
});

test('200 GET - /questions, list questions', async (t) => {
  const res = await supertest(app)
    .get('/questions')
    .expect(200);
  t.deepEqual(res.body, [{ id: '1', question: 'How many Dalai Lamas have there been?', answer: 14 }], 'deleted question is no longer in database');
  t.end();
});
