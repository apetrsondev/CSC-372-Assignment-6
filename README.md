# CSC-372-Assignment-6

## Setup

``` bash
npm install
npm run seed
npm start
```

Then open http://localhost:3000


## Endpoints

### GET

| GET url | result | 
|--|--|
| GET /triviabook/topics | list topics |
| GET /triviabook/topic/{topic}?limit={int}&difficulty=[easy/medium/hard] | get questions from selected topic w difficulty/amt specified |
| GET /triviabook/random | get random question |

### POST

| POST url | Body | result | 
|---|---|---|
| POST /triviabook/answer | { "id": int, "guess": str} | checks if answer is correct |
| POST /triviabook/question/add | {"topic": str, "question": str, "answer":str, "difficulty": str} | Adds question to the database

## Schema 

### Topics 

| id | name (UNIQUE) |
| -- | - | 

### Questions

| id | topic_id | question | answer | difficulty (CHECK easy/medium/hard) |
|--|--|--|--|--|