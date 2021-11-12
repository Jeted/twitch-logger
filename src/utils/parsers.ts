import type { ChatSubGiftInfo, ChatSubInfo, UserNotice } from '@twurple/chat';
import type { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import { params } from '../misc/enums';

type ChatSub = ChatSubInfo & ChatSubGiftInfo;
type EventTags = TwitchPrivateMessage | UserNotice;

const mapToObject = (map: Map<string, string | string[]>) => {
  return map.size && Object.fromEntries(map);
};

export function parseTags(tags: EventTags) {
  const messageId = tags.id;
  const channelId = tags.channelId;
  const userId = tags.userInfo.userId;
  const color = tags.userInfo.color;
  const login = tags.userInfo.userName;
  const displayName = tags.userInfo.displayName;
  const badges = mapToObject(tags.userInfo.badges);
  const badgeInfo = mapToObject(tags.userInfo.badgeInfo);
  const emotes = mapToObject(tags.emoteOffsets);

  return {
    channelId: channelId!,
    userInfo: {
      ...(messageId && { [params.messageId]: messageId }),
      ...(userId && { [params.userId]: Number(userId) }),
      ...(login && { [params.login]: login }),
      ...(displayName && { [params.displayName]: displayName }),
      ...(color && { [params.color]: color }),
      ...(badges && { [params.badges]: badges }),
      ...(badgeInfo && { [params.badgeInfo]: badgeInfo }),
      ...(emotes && { [params.emotes]: emotes }),
    },
  };
}

export function parseSubInfo(subInfo: Partial<ChatSub>) {
  const isSubGift = !!subInfo.gifter;

  const plan = subInfo.plan;
  const months = subInfo.months;
  const message = subInfo.message;
  const streak = subInfo.streak;
  const count = subInfo.gifterGiftCount;
  const userId = isSubGift && subInfo.userId;
  const login = isSubGift && subInfo.userName;
  const displayName = isSubGift && subInfo.displayName;

  return {
    [params.tier]: isNaN(Number(plan)) ? 0 : Number(plan) / 1000,
    [params.months]: Number(months),
    ...(message && { [params.message]: message }),
    ...(streak && { [params.streak]: Number(streak) }),
    ...(count && { [params.count]: Number(count) }),
    ...(userId && { [params.userId]: Number(userId) }),
    ...(login && { [params.login]: login }),
    ...(displayName && { [params.displayName]: displayName }),
  };
}
