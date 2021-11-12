import mongoose from 'mongoose';
import { params } from '../misc/enums';

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

export const logSchema = new mongoose.Schema(
  {
    date: {
      required: true,
      type: Date,
    },
    [params.messageId]: {
      type: String,
      default: mongoose.Types.ObjectId,
    },
    [params.userId]: {
      index: true,
      type: Number,
    },
    [params.login]: String,
    [params.displayName]: String,
    [params.color]: String,
    [params.badges]: Object,
    [params.badgeInfo]: Object,
    [params.emotes]: Object,
    [params.subInfo]: Object,
    [params.duration]: Number,
    [params.message]: String,
    [params.joined]: {
      default: undefined,
      index: true,
      type: Array,
    },
    [params.parted]: {
      default: undefined,
      index: true,
      type: Array,
    },
    [params.messageType]: {
      index: true,
      type: String,
    },
  },
  {
    versionKey: false,
  }
);
