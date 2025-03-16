export type PlayerColor = 'white' | 'black';
export type DoublingCubeOwner = PlayerColor | 'center' | null;

export interface PointState {
  count: number;
  color: PlayerColor;
}

export interface DiceState {
  values: number[] | null;
  used_values: number[];
}

export interface GameState {
  points: { [key: number]: PointState | null };
  bar: {
    white: number;
    black: number;
  };
  home: {
    white: number;
    black: number;
  };
  current_turn?: PlayerColor;
  dice_state: DiceState;
}

export interface TimeControl {
  initialTime: number;      // Initial time in seconds
  increment: number;        // Time added after each move in seconds
  isClockRunning: boolean;
  activePlayer: PlayerColor | null;
  remainingTime: {
    white: number;
    black: number;
  };
}

export interface Move {
  from: number;
  to: number;
  color: PlayerColor;
}

export interface GameRules {
  allowDoubling: boolean;
  crawford: boolean;
  jacoby: boolean;
  automaticDoubles: boolean;
}

export type ResignationType = 'single' | 'gammon' | 'backgammon';

export interface GameScore {
  points: number;           // Basic points for winning
  isGammon: boolean;       // Whether it's a gammon (2x)
  isBackgammon: boolean;   // Whether it's a backgammon (3x)
  cubeValue: number;       // Current value of doubling cube
} 