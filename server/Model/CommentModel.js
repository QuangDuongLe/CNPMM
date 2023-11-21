const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  author: {
    type: String,
  },
  content: {
    type: String,
    require: true,
  },
 replies: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Comment',
}],
check: {
  type: Boolean 
},
isReply:{
  type:Boolean
}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
