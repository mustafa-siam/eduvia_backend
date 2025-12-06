import { Schema, model, Document } from 'mongoose';
import { IAuth } from './auth.schema';

const authSchema = new Schema<IAuth & Document>({
  name: { type: String, required: true },
}, { timestamps: true });

const AuthModel = model<IAuth & Document>('Auth', authSchema);
export default AuthModel;
