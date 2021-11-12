import mongoose from 'mongoose';

mongoose.pluralize(null);

export const channelSchema = new mongoose.Schema(
  {
    userId: String,
    login: String,
    displayName: String,
    isLogged: Boolean,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
