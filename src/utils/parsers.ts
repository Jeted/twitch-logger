import type { ChatSubGiftInfo, ChatSubInfo, UserNotice } from '@twurple/chat';
import type { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import { params } from '../misc/enums';

type ChatSub = ChatSubInfo & ChatSubGiftInfo;
type EventTags = TwitchPrivateMessage | UserNotice;

const mapToObject = (map: Map<string, string | string[]>) => {
  return map.size && Object.fromEntries(map);
};

const value = (param: string, value: any) => {
  return value && { [param]: value };
};

export function parseTags(tags: EventTags) {
  return {
    channelId: tags.channelId!,
    userInfo: {
      ...value(params.messageId, tags.id),
      ...value(params.userId, Number(tags.userInfo.userId)),
      ...value(params.login, tags.userInfo.userName),
      ...value(params.displayName, tags.userInfo.displayName),
      ...value(params.color, tags.userInfo.color),
      ...value(params.badges, mapToObject(tags.userInfo.badges)),
      ...value(params.badgeInfo, mapToObject(tags.userInfo.badgeInfo)),
      ...value(params.emotes, mapToObject(tags.emoteOffsets)),
    },
  };
}

export function parseSubInfo(subInfo: Partial<ChatSub>) {
  const isSubGift = !!subInfo.gifter;
  const plan = Number(subInfo.plan);

  return {
    message: subInfo.message,
    subInfo: {
      [params.tier]: isNaN(plan) ? 0 : plan / 1000,
      [params.months]: Number(subInfo.months),
      ...value(params.streak, Number(subInfo.streak)),
      ...value(params.count, Number(subInfo.gifterGiftCount)),
      ...value(params.userId, isSubGift && Number(subInfo.userId)),
      ...value(params.login, isSubGift && subInfo.userName),
      ...value(params.displayName, isSubGift && subInfo.displayName),
    },
  };
}
