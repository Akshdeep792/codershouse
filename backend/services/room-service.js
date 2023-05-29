const roomModel = require("../models/room-model");

class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload;
        const room = await roomModel.create({
            topic,
            roomType,
            ownerId,
            speaker: [ownerId]
        })
        return room
    }
}

module.exports = new RoomService()