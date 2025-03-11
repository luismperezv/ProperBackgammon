export type PlayerColor = 'white' | 'black';
export type DoublingCubeOwner = PlayerColor | 'center' | null;

export interface PointState {
  count: number;
  color: PlayerColor;
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
}

export interface TimeControl {
  initialTime: number;      // Initial time in seconds
  increment: number;        // Time added after each move in seconds
  timeLeft: {
    white: number;
    black: number;
  };
  isClockRunning: boolean;
  activePlayer: PlayerColor | null;
}

export interface Move {
  from: number;
  to: number;
}

export interface GameRules {
  isCrawfordRule: boolean;  // Whether Crawford rule is in effect
  isJacobyRule: boolean;    // Whether Jacoby rule is in effect
  automaticDoubles: boolean; // Whether initial double 1s, 2s, etc. are automatic
  maximumCube: number;      // Maximum value of doubling cube (typically 64)
}

export type ResignationType = 'single' | 'gammon' | 'backgammon';

export interface GameScore {
  points: number;           // Basic points for winning
  isGammon: boolean;       // Whether it's a gammon (2x)
  isBackgammon: boolean;   // Whether it's a backgammon (3x)
  cubeValue: number;       // Current value of doubling cube
} 