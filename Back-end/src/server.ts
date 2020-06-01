import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    response.json([
        'Jp',
    ]);
});

app.listen(3333);