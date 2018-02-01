var {mongoose} = require('../../db/mongoose');
var {ObjectId} = mongoose;
var Schema = mongoose.Schema;

postSchema = new Schema({
    postType: {
        type: String,
        required: [true, 'no type associated'],
        default: "post"
    },    
    content: {
        type: String,
        required: [true , 'Please write something first!']
    },
    views: {
        type: Number,
        default: 0
    },
    sticky: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'user not associated']
    }
});

var post = mongoose.model('Post',postSchema);
module.exports =  post;