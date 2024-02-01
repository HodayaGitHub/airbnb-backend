import fs from 'fs'

import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'


export const stayService = {
    query,
    getById,
    remove,
    add,
    update,
}


const ITEMS_PER_PAGE = 48

async function query(filterBy, page = 1) {
    try {
        const criteria = {}
        const collection = await dbService.getCollection('stay')

        const skips = ITEMS_PER_PAGE * (page - 1)

        if (filterBy?.label) {
            criteria.$or = [
                { "type": filterBy.label },
                { "amenities": { $elemMatch: { $eq: filterBy.label } } }
            ]
        }

        let stays = await collection.find(criteria).skip(skips).limit(ITEMS_PER_PAGE).toArray()


        return stays
    } catch (err) {
        logger.error('Cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = await collection.findOne({ _id: new ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ _id: new ObjectId(stayId) })
    } catch (err) {
        logger.error(`cannot remove car ${stayId}`, err)
        throw err
    }
}

async function update(stay) {
    try {
        console.log('stay to remove', stay)
        const stayToSave = {
            name: stay.name,
            price: stay.price,
        }
        const collection = await dbService.getCollection('stay')
        await collection.updateOne(
            { _id: new ObjectId(stay._id) },
            { $set: stayToSave })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stay._id}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stay)
        return stay
    } catch (err) {
        logger.error('cannot insert car', err)
        throw err
    }
}

