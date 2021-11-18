import { ChatSubGiftInfo, ChatSubInfo, UserNotice } from '@twurple/chat';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import { params } from '../misc/enums';
import { objProp } from './helpers';

type ChatSub = ChatSubInfo & ChatSubGiftInfo;
type EventTags = TwitchPrivateMessage | UserNotice;

export function parseTags(tags: EventTags) {
  return {
    channelId: tags.channelId!,
    userInfo: {
      ...prop(params.messageId, tags.id),
      [params.userId]: Number(tags.userInfo.userId),
      [params.login]: tags.userInfo.userName,
      [params.displayName]: tags.userInfo.displayName,
      ...objProp(params.color, tags.userInfo.color),
      ...objProp(params.badges, tags.userInfo.badges),
      ...objProp(params.badgeInfo, tags.userInfo.badgeInfo),
      ...objProp(params.emotes, tags.emoteOffsets),
    },
  };
}

export function parseSubInfo(subInfo: Partial<ChatSub>) {
  const isSubGift = !!subInfo.gifter;

  return {
    message: subInfo.message,
    subInfo: {
      [params.tier]: Number(subInfo.plan) / 1000 || 0,
      [params.months]: Number(subInfo.months),
      ...prop(params.login, isSubGift && subInfo.userName),
      ...objProp(params.streak, Number(subInfo.streak)),
      ...objProp(params.count, Number(subInfo.gifterGiftCount)),
      ...objProp(params.userId, isSubGift && Number(subInfo.userId)),
      ...objProp(params.displayName, isSubGift && subInfo.displayName),
    },
  };
}
