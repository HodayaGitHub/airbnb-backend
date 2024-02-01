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

async function query(filterBy) {
    try {
        const criteria = {}

        // if (filterBy?.txt) {
        //     criteria.name = { $regex: filterBy.txt, $options: 'i' }
        // }

        // if (filterBy?.maxPrice > 0) {
        //     criteria.price = { $lte: filterBy.maxPrice }
        // }

        // // filterBy.labels = ["Space Ranger", "Doll"]
        // if (filterBy?.labels?.length > 0) {
        //     criteria.labels = { $in: filterBy.labels }
        // }

        // const collection = await dbService.getCollection('stay')

        // const sortCriteria = {}
        // if (selectedLabel?.by) {
        //     const sortAsc = JSON.parse(selectedLabel.asc)
        //     sortCriteria[selectedLabel.by] = sortAsc ? 1 : -1
        // }

        // console.log(sortCriteria)
        // let stays = await collection.find(criteria).sort(sortCriteria).toArray()
        

        const collection = await dbService.getCollection('stay')
        let stays = await collection.find(criteria).toArray()

        // let stays = await dbService.getCollection('stay')

        return stays

    } catch (err) {
        logger.error('cannot find stays', err)
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
