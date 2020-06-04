import express, { request, response } from 'express';
import knex from './database/connection';


const routes = express.Router();

routes.get('/itens', async (request, response) => {
    const itens = await knex('itens').select('*');

    const serializedItens = itens.map(item => {
        return {
            id: item.id,
            title: item.title,
            image_url: `http:localhost:3333/uploads/${item.image}`,
        };
    });

    return response.json(serializedItens);
});

routes.post('/points', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        cidade,
        uf,
        itens
    } = request.body;

    const trx = await knex.transaction();

    const ids = await trx('points').insert({
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        cidade,
        uf,
    });

    const pointItem = itens.map((item_id: number) => {
        return {
            item_id,
            point_id: ids[0],
        };
    })

    await trx('point_item').insert(pointItem);

    return response.json({sucess:'true'})
});

export default routes;