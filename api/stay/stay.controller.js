import { stayService } from "./stay.service.js"
import { logger } from "../../services/logger.service.js"


// export async function getStays(req, res) {
//     try {
//         // console.log(req.query)
//         // const { filterBy, selectedLabel } = req.query
//          const { filterBy } = req.query

//         // logger.debug('Getting Stays', filterBy)
//         const stays = await stayService.query()

//         res.json(stays)

//     } catch (err) {
//         logger.error('Cannot get stays', err)
//         res.status(500).send({ err: 'Failed to get stay' })
//     }
// }


export async function getStays(req, res) {
    try {
        const { filterBy, page, itemsPerPage} = req.query
        const stays = await stayService.query(filterBy, page, itemsPerPage)
        res.json(stays)
    } catch (err) {
        logger.error('Cannot get stays', err)
        res.status(500).send({ err: 'Failed to get stay' })
    }
}



export async function getById(req, res) {
    try {
        const stayId = req.params.id
        const stay = await stayService.getById(stayId)
        res.json(stay)
    } catch (err) {
        logger.error('Failed to get stay', err)
        res.status(500).send({ err: 'Failed to get stay' })
    }
}

export async function removeStay(req, res) {
    try {
        const { stayId } = req.params
        await stayService.remove(stayId)
        logger.info(`Stay ${stayId} removed`)
        res.send()
    } catch (err) {
        logger.error('Cannot remove item', err)
        res.status(500).send({ err: 'Failed to remove stay' })
    }
}

export async function updateStay(req, res) {
    try {
        const stay = req.body
        // console.log(stay)
        const updatedStay = await stayService.update(stay)
        res.json(updatedStay)
    } catch (err) {
        logger.error('Failed to update stay', err)
        res.status(500).send({ err: 'Failed to update stay' })
    }
}

export async function addStay(req, res) {
    const { loggedinUser } = req

    try {
        const stay = req.body
        stay.owner = loggedinUser
        const addedStay = await stayService.add(stay)
        res.json(addedStay)
    } catch (err) {
        logger.error('Failed to add stay', err)
        res.status(500).send({ err: 'Failed to add stay' })
    }
}