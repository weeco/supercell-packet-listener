/**
 * Packet IDs mapped by name
 */
export enum MessageIds {
  // Client messages
  ClientHello = 10100,
  Login = 10101,
  KeepAlive = 10108,
  AskForPlayingGamecenterFriends = 10512,
  GoHome = 14101,
  StartBattle = 14103, // Guessed
  BattleWaitLine = 14106, // Guessed
  CancelMatchmake = 14109, // Guessed
  VisitHome = 14113,
  CreateAlliance = 14301,
  AskForAllianceData = 14302,
  AskForJoinableAlliancesList = 14303,
  AskForAllianceStream = 14304,
  JoinAlliance = 14305,
  ChangeAllianceMemberRole = 14306,
  KickAllianceMember = 14307,
  LeaveAlliance = 14308,
  ChatToAllianceStream = 14315,
  ChangeAllianceSettings = 14316,
  RequestJoinAlliance = 14317,
  SearchAlliances = 14324,
  SetDeviceToken = 10113,
  ClientCapabilities = 10107,
  CancelPurchase = 10160,
  BattleConnectionType = 10177,
  ChangeAvatarName = 10212,
  EndClientTurn = 14102,
  BotBattleResult = 14110,
  CreateRoom = 14350,
  QuitRoom = 14353,
  ChangeBrawlerInRoom = 14354,
  ReadyUpInRoom = 14355,
  EnablePracticeInRoom = 14356,
  JoinRoom = 14358,
  SendMessageIntoRoom = 14359,
  AdvertiseRoomToBand = 14360,
  MyRoomState = 14361, // In battle, other scren, present, ready, brawling, end screen
  ChangeRoomEvent = 14362, // Event change for instance
  ChangeRoomType = 14363, // To friendly battle or ranked
  AskForAvatarRankingList = 14403, // Best band leaderboard, brawler leaderboards, player leaderboards
  ChangeName = 14600,
  BindGamecenterAccount = 14212,
  // 14366 - When you collect the new Map reward / coins

  // Server messages
  LoginFailed = 20103,
  LoginOk = 20104,
  KeepAliveOk = 20108,
  ShutdownStarted = 20161,
  BattleInfoPreload = 20405,
  BattleInfoFull = 20559,
  BattleEndInfo = 23456,
  PlayersOnline = 23457,
  OwnHomeData = 24101,
  EventUpdate = 24111,
  UdpConnectionInfo = 24112,
  VisitedHomeData = 24113,
  RoomContent = 24124,
  RoomDisconnect = 24125,
  RoomError = 24129,
  RoomUpdate = 24131, // When someone joins or leaves a room
  AllianceData = 24301,
  JoinableAllianceList = 24304,
  AllianceList = 24310,
  AllianceStream = 24311,
  AllianceStreamEntry = 24312,
  AllianceStreamEntryRemoved = 24318,
  AllianceJoinRequestOk = 24319,
  AllianceJoinRequestFailed = 24320,
  AllianceInvitationSendFailed = 24321,
  AllianceInvitationSentOk = 24322,
  AllianceFullEntryUpdate = 24324,
  AllianceOnlineStatusUpdated = 20207,
  AllianceCreateFailed = 24332,
  AllianceChangeFailed = 24333,
  AllianceStatus = 24399,
  AllianceRankingList = 24401,
  AllianceLocalRankingList = 24402,
  AvatarRankingList = 24403,
  ChangeNameFailed = 20300,
  BannedFromMatch = 24115, // Idle disconnect / banned from battle
  AllianceMember = 24308,
  ServerHello = 20100
}
