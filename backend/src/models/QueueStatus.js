const mongoose = require('mongoose');
const queueStatusSchema = new mongoose.Schema({
    _id:{
        type:String,
        default:'singleton'//for entire app/clinic
    },
    isQueueOpen:{
        type:Boolean,
        default :false
    }
})

module.exports = mongoose.model("QueueStatus",queueStatusSchema);