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
    
        return response.json({
            id: ids[0],
            ...point
        })
    }
}

export default PointsController;