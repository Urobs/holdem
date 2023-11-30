type ActionType = "call" | "raise" | "fold";
type GameStage = "preflop" | "flop" | "turn" | "river";

interface PlayerAction {
  player: string;
  action: ActionType;
  amount?: number;
}

interface BettingRound {
  stage: GameStage;
  actions: PlayerAction[];
}

interface Player {
  name: string;
  stackChange: number;
  holeCards: string[];
}

interface GameState {
  handId: number;
  bettingRounds: BettingRound[];
  communityCards: string[];
  players: Player[];
}

function parseLogLine(logLine: string): GameState {
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
        ? parseActions(actionStrings[index], players)
        : [],
  }));

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
  players: Player[]
): PlayerAction[] {
  const actions: PlayerAction[] = [];
  let matches;

  // Regular expression to match actions and amounts
  const actionRegex = /([crf])(\d*)/g;
  while ((matches = actionRegex.exec(actionSubString)) !== null) {
    const [, action, amount] = matches;
    actions.push({
      player: players[actions.length % 2].name,
      action: action === "c" ? "call" : action === "r" ? "raise" : "fold",
      amount: amount ? parseInt(amount) : undefined,
    });
  }

  return actions;
}

// Test the function with a sample log line
const sampleLogLine =
  "STATE:995:cc/cc/cr3339f:3dJh|QcJd/8c4d4s/Qs:100|-100:player02-143-discovery|player01-143-discovery";
export const gameState = parseLogLine(sampleLogLine);
