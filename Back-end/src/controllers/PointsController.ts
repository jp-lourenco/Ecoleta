import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {
    async create(request: Request, response: Response)  {
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
    
        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            cidade,
            uf,
        };

        const ids = await trx('points').insert(point)
    
        const pointItem = itens.map((item_id: number) => {
            return {
                item_id,
                point_id: ids[0],
            };
        })
    
        await trx('point_item').insert(pointItem);

        await trx.commit();
    
        return response.json({
            id: ids[0],
            ...point
        })
    }

    async show(request: Request, response: Response)  {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point) {
            return response.status(400).json({message: 'Point not found'});
        }

        const itens = await knex('itens')
            .join('point_item', 'itens.id', '=', 'point_item.item_id')
            .where('point_item.point_id', id)
            .select('itens.title');

        return response.json({point, itens});
    }

    async index(request: Request, response: Response)  {
        const { cidade, uf, itens } = request.query;

        const parsedItens = String(itens)
            .split(',')
            .map(item => Number(item.trim()));


        const point = await knex('points')
            .join('point_item', 'points.id', '=', 'point_item.point_id')
            .whereIn('point_item.item_id', parsedItens)
            .where('cidade', String(cidade))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return response.json(point)
    }
}

export default PointsController;