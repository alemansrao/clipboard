import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema(
  {
    shareId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
    },
    favorite: {
      type: Boolean,
      default: false
    },
    ownerId: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
