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


// const ITEMS_PER_PAGE = 48

// async function query(filterBy, page = 1, itemsPerPage) {
//     try {
//         const criteria = {}
//         const collection = await dbService.getCollection('stay')


//         if (filterBy?.label) {
//             criteria.$or = [
//                 { "type": filterBy.label },
//                 { "amenities": { $elemMatch: { $eq: filterBy.label } } }
//             ]
//         }

//         if (filterBy?.roomType && filterBy.roomType !== "Any type") {
//             criteria.roomType = filterBy.roomType
//         }

//         if (filterBy?.price) {
//             criteria.price = {
//                 $gte: +filterBy.price.minPrice,
//                 $lte: +filterBy.price.maxPrice
//             }
//         }

//         if (filterBy?.beds) {
//             criteria.beds = { $gte: +filterBy.beds }
//         }

//         if (filterBy?.bathrooms) {
//             criteria.bathrooms = { $gte: +filterBy.bathrooms }
//         }

//         if (filterBy?.bedrooms) {
//             criteria.bedrooms = { $gte: +filterBy.bedrooms }
//         }

//         if (filterBy?.region) {
//             console.log(filterBy.region)
//             criteria['loc.country'] = filterBy.region
//         }

//         if (filterBy?.guestFavorite !== "false") {
//             console.log(filterBy.guestFavorite)
//             criteria.guestFavorite = { $ne: false }
//         }



//         let skips = +itemsPerPage * (page - 1)
//         let totalDocumentsCount = await collection.find(criteria).toArray()
//         let stays = await collection.find(criteria).skip(skips).limit(+itemsPerPage).toArray();

//         console.log('totalDocumentsCount ', totalDocumentsCount.length);
//         return { totalDocumentsCount, stays }

//         // return stays
//     } catch (err) {
//         logger.error('Cannot find stays', err)
//         throw err
//     }
// }


async function query(filterBy, page = 1, itemsPerPage) {
    try {
        const collection = await dbService.getCollection('stay')
        const criteria = buildCriteria(filterBy)
        let stays
        let skips = +itemsPerPage * (page - 1)
        const totalStayCount = await collection.countDocuments(criteria);
        stays = await collection.find(criteria).sort({ _id: -1 }).skip(skips).limit(+itemsPerPage).toArray();
        return { totalStayCount, stays }
    } catch (err) {
        logger.error('Cannot find stays', err)
        throw err
    }
}


function buildCriteria() {
    const criteria = {}
    if (filterBy?.label) {
        criteria.$or = [
            { "type": filterBy.label },
            { "amenities": { $elemMatch: { $eq: filterBy.label } } }
        ]
    }
    if (filterBy?.roomType && filterBy.roomType !== "Any type") {
        criteria.roomType = filterBy.roomType
    }
    if (filterBy?.price) {
        if (+filterBy.price.minPrice >= 0) {
            criteria.price = {
                $gte: +filterBy.price.minPrice
            }
        }
        if (+filterBy.price.maxPrice !== Infinity) {
            criteria.price = criteria.price ?? {}
            criteria.price.$lte = +filterBy.price.maxPrice
        }
    }
    if (filterBy?.beds) {
        criteria.beds = { $gte: +filterBy.beds }
    }
    if (filterBy?.bathrooms) {
        criteria.bathrooms = { $gte: +filterBy.bathrooms }
    }
    if (filterBy?.bedrooms) {
        criteria.bedrooms = { $gte: +filterBy.bedrooms }
    }
    if (filterBy?.region) {
        console.log(filterBy.region)
        criteria['loc.country'] = filterBy.region
    }
    if (filterBy?.guestFavorite !== "false") {
        console.log(filterBy.guestFavorite)
        criteria.guestFavorite = { $ne: false }
    }
    if (filterBy?.check_In && filterBy?.check_Out) {
        criteria['orders.check_In'] = {
            $lte: new Date(filterBy.checkOut).toISOString()
        }
        criteria['orders.check_Out'] = {
            $gte: new Date(filterBy.checkIn).toISOString()
        }
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

