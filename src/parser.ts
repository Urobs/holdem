// @ts-ignore

type ActionType = "call" | "raise" | "fold";
type GameStage = "preflop" | "flop" | "turn" | "river";

export interface PlayerAction {
  player: string;
  action: ActionType;
  amount?: number;
}

export interface BettingRound {
  stage: GameStage;
  actions: PlayerAction[];
}

export interface Player {
  name: string;
  stackChange: number;
  holeCards: string[];
}

export interface GameState {
  handId: number;
  bettingRounds: BettingRound[];
  communityCards: string[];
  players: Player[];
}

function parseLogLine(logLine: string, settings: number[]): GameState {
  const sections = logLine.replace("STATE", "").split(":").slice(1);

  const resultSection = sections[3];
  const stackChanges = resultSection
    .split("|")
    .map((change) => parseInt(change));

  // Parse player information
  const playersSection = sections[4];
  const playerNames = playersSection.split("|");
  const players: Player[] = playerNames.map((name, index) => {
    return {
      name: name,
      stackChange: stackChanges[index],
      holeCards: []
    };
  });

  const handId = parseInt(sections[0]);

  // Parse actions for each betting round
  const actionStrings = sections[1].split("/");
  const stages: GameStage[] = ["preflop", "flop", "turn", "river"];
  const bettingRounds: BettingRound[] = stages.map((stage, index) => ({
    stage: stage,
    actions:
      index < actionStrings.length
        ? parseActions(actionStrings[index], players, settings[index] - 1)
        : [],
  })).filter(st => st.actions.length > 0);

  // 分割出社区牌和手牌的部分
  const communityAndHoleCardsSection = sections[2].split("/");
  const communityCardsString = communityAndHoleCardsSection.slice(1);
  const holeCardsString = communityAndHoleCardsSection[0];

  // 解析社区牌
  const communityCards = communityCardsString.flatMap(
    (s) => s.match(/\w{2}/g) || []
  );

  // 解析手牌，假设格式为"3dJhQcJd"，其中"3dJh"为玩家1的手牌，"QcJd"为玩家2的手牌
  const holeCards = holeCardsString.match(/\w{2}/g);
  if (holeCards && holeCards.length >= 4) {
    players[0].holeCards = [holeCards[0], holeCards[1]];
    players[1].holeCards = [holeCards[2], holeCards[3]];
  }

  return {
    handId,
    bettingRounds,
    communityCards,
    players,
  };
}

function parseActions(
  actionSubString: string,
  players: Player[],
  offset = 1 | 0 // 表示从大盲还是小盲开始下注, 1表示大盲 0代表小盲
): PlayerAction[] {
  const actions: PlayerAction[] = [];
  let matches;

  // Regular expression to match actions and amounts
  const actionRegex = /([crf])(\d*)/g;
  while ((matches = actionRegex.exec(actionSubString)) !== null) {
    const [, action, amount] = matches;
    actions.push({
      player: players[(actions.length + offset) % 2].name,
      action: action === "c" ? "call" : action === "r" ? "raise" : "fold",
      amount: amount ? parseInt(amount) : undefined,
    });
  }

  return actions;
}

function splitIntoStates(logData: string): string[] {
  // 使用正则表达式分割文本，每个STATE:作为新记录的开始
  const stateRegex = /STATE:/g;
  console.log(logData.split(stateRegex))
  return logData.split(stateRegex).slice(1).map((data, _) => {
    return 'STATE:' + data;
  });
}
export function parseMultipleLogLines(logData: string, settings = [1, 2, 2, 2]): GameState[] {
  const states = splitIntoStates(logData);
  return states.map(state => parseLogLine(state, settings));
}
