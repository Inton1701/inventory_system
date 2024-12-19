const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    status:{
        type: Boolean,
        default: true
    },
    folderID:{
        type: String,
        default: '1DpVqEewMFx4tvioAeSdvD1FjT4sbVtZk'
    }

},
{timestamps: true}
)

module.exports = mongoose.model('Config', configSchema);