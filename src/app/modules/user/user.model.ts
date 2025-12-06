import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.schema';
import { userConstant } from './user.constant';

const userSchema = new Schema<IUser & Document>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(userConstant.USER_ROLES),
      default: userConstant.USER_ROLES.USER,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

const UserModel = model<IUser & Document>('User', userSchema);
export default UserModel;
