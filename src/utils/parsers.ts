import { ChatSubGiftInfo, ChatSubInfo, UserNotice } from '@twurple/chat';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import { params } from '../misc/enums';

type ChatSub = ChatSubInfo & ChatSubGiftInfo;
type EventTags = TwitchPrivateMessage | UserNotice;

const mapToObject = (map: Map<string, string | string[]>) => {
  return map.size && Object.fromEntries(map);
};

const prop = (param: string, value: any) => {
  return value && { [param]: value };
};

export function parseTags(tags: EventTags) {
  return {
    channelId: tags.channelId!,
    userInfo: {
      ...prop(params.messageId, tags.id),
      ...prop(params.userId, Number(tags.userInfo.userId)),
      ...prop(params.login, tags.userInfo.userName),
      ...prop(params.displayName, tags.userInfo.displayName),
      ...prop(params.color, tags.userInfo.color),
      ...prop(params.badges, mapToObject(tags.userInfo.badges)),
      ...prop(params.badgeInfo, mapToObject(tags.userInfo.badgeInfo)),
      ...prop(params.emotes, mapToObject(tags.emoteOffsets)),
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
      ...prop(params.streak, Number(subInfo.streak)),
      ...prop(params.count, Number(subInfo.gifterGiftCount)),
      ...prop(params.userId, isSubGift && Number(subInfo.userId)),
      ...prop(params.login, isSubGift && subInfo.userName),
      ...prop(params.displayName, isSubGift && subInfo.displayName),
    },
  };
}
