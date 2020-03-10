'use strict';

const express = require('express');
const uuid = require('uuid');
const server = express();

const database = {};

class Question {
  constructor(id, question, answer) {
    this.id = id;
    this.question = question;
    this.answer = answer;
  }
}

// Parse JSON requests, based on body parser
server.use(express.json());

// Base route
server.get('/', (req, res) => {
  res.status(200).send({ api: 'number-trivia' });
});

// Create a new trivia question
server.post('/questions', (req, res) => {
  const question = new Question(uuid.v1(), req.body.question, req.body.answer);
  database[question.id] = question;
  res.status(201).send({ id: question.id });
});

// Retrieve a specific trivia question
server.get('/questions/:id', (req, res) => {
  const question = database[req.params.id];
  res.status(200).send(question);
});

// List all trivia questions
server.get('/questions', (req, res) => {
  const questions = Object.keys(database).map((id) => database[id]);
  res.status(200).send(questions);
});

// Replace an existing trivia question
server.put('/questions/:id', (req, res) => {
  const question = new Question(
    req.params.id,
    req.body.question,
    req.body.answer
  );

  const status = database[req.params.id] ? 200 : 201;
  database[req.params.id] = question;
  res.status(status).send(question);
});

// Replace part of an existing trivia question
server.patch('/questions/:id', (req, res) => {
  if (req.body.question) {
    database[req.params.id].question = req.body.question;
  }
  if (req.body.answer) {
    database[req.params.id].answer = req.body.answer;
  }
  res.status(200).send(database[req.params.id]);
});

// Delete a trivia question
server.delete('/questions/:id', (req, res) => {
  delete database[req.params.id];
  res.status(204).send();
});

module.exports = server;
