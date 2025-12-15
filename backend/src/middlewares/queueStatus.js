const QueueStatus = require("../models/QueueStatus");
const queueStatus = async (req, res, next) => {
    try {
        const config = await QueueStatus.findById('singleton');
        if(!config || !config.isQueueOpen ){
            return res.status(403).json({
                success:false,
                message:'Clinic is currently closed, will be open soon'
            });
        }

        next();
    } catch (error) {
        console.error('Error in queueStatus checking');
        return res.status(501).json({
            success:false,
            message:'Internal Server error in queue status checking'
        })
    }
};

module.exports = queueStatus;
