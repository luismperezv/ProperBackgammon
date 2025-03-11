import { create } from 'zustand';
import { INITIAL_POSITION } from '../constants/game';
import {
  PlayerColor,
  DoublingCubeOwner,
  GameState,
  TimeControl,
  Move,
  GameRules,
  ResignationType,
  GameScore,
  PointState
} from './types';

interface GameStore {
  // Match state
  matchScore: {
    white: number;
    black: number;
  };
  matchLength: number;
  isMatchOver: boolean;
  matchWinner: PlayerColor | null;

  // Game state
  gameState: GameState;
  currentPlayer: PlayerColor;
  isGameStarted: boolean;
  isGameOver: boolean;
  gameWinner: PlayerColor | null;
  
  // Doubling cube state
  doublingCubeValue: number;
  doublingCubeOwner: DoublingCubeOwner;
  canDouble: boolean;
  wasDoubleOffered: boolean;
  
  // Turn state
  dice: number[];
  canRoll: boolean;
  validMoves: Move[];
  selectedPoint: number | null;
  
  // Crawford and special rules
  isCrawfordGame: boolean;
  postCrawford: boolean;
  gameRules: GameRules;
  
  // Time control
  timeControl: TimeControl | null;
  
  // Potential gammon/backgammon tracking
  potentialGammon: boolean;
  potentialBackgammon: boolean;
  
  // Actions
  // Match actions
  startMatch: (matchLength: number, rules: Partial<GameRules>, timeControl?: TimeControl) => void;
  endMatch: () => void;
  
  // Game actions
  startNewGame: () => void;
  resignGame: (type: ResignationType) => void;
  calculateGameScore: () => GameScore;
  
  // Doubling actions
  offerDouble: () => void;
  acceptDouble: () => void;
  rejectDouble: () => void;
  
  // Turn actions
  rollDice: () => void;
  makeMove: (from: number, to: number) => void;
  selectPoint: (pointNumber: number | null) => void;
  undoLastMove: () => void;
  
  // Clock actions
  startClock: () => void;
  stopClock: () => void;
  addIncrement: (player: PlayerColor) => void;
  
  // State sync
  updateGameState: (newState: GameState) => void;
  updateMatchScore: (white: number, black: number) => void;
  updatePoint: (pointNumber: number, newState: PointState) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial match state
  matchScore: { white: 0, black: 0 },
  matchLength: 0,
  isMatchOver: false,
  matchWinner: null,

  // Initial game state
  gameState: INITIAL_POSITION,
  currentPlayer: 'white',
  isGameStarted: false,
  isGameOver: false,
  gameWinner: null,

  // Initial doubling cube state
  doublingCubeValue: 1,
  doublingCubeOwner: 'center',
  canDouble: true,
  wasDoubleOffered: false,

  // Initial turn state
  dice: [],
  canRoll: true,
  validMoves: [],
  selectedPoint: null,

  // Initial Crawford state
  isCrawfordGame: false,
  postCrawford: false,
  
  // Default game rules
  gameRules: {
    isCrawfordRule: true,
    isJacobyRule: true,
    automaticDoubles: true,
    maximumCube: 64
  },

  // Initial time control
  timeControl: null,

  // Initial gammon potential
  potentialGammon: false,
  potentialBackgammon: false,

  // Match actions
  startMatch: (matchLength, rules, timeControl) => {
    set({
      matchLength,
      matchScore: { white: 0, black: 0 },
      isMatchOver: false,
      matchWinner: null,
      gameRules: { ...get().gameRules, ...rules },
      timeControl: timeControl || null
    });
    get().startNewGame();
  },

  endMatch: () => {
    set({
      isMatchOver: true,
      isGameStarted: false,
      timeControl: null
    });
  },

  // Game actions
  startNewGame: () => {
    const { matchScore, matchLength, gameRules } = get();
    
    // Check for Crawford game
    const isCrawfordGame = gameRules.isCrawfordRule && 
      (matchScore.white === matchLength - 1 || matchScore.black === matchLength - 1) &&
      !get().postCrawford;

    set({
      gameState: INITIAL_POSITION,
      currentPlayer: 'white',
      isGameStarted: true,
      isGameOver: false,
      gameWinner: null,
      doublingCubeValue: 1,
      doublingCubeOwner: 'center',
      canDouble: !isCrawfordGame,
      wasDoubleOffered: false,
      dice: [],
      canRoll: true,
      validMoves: [],
      selectedPoint: null,
      isCrawfordGame,
      potentialGammon: false,
      potentialBackgammon: false
    });

    if (get().timeControl) {
      const tc = get().timeControl;
      if (!tc) return;  // Extra safety check after reassignment
      
      const newTimeControl: TimeControl = {
        initialTime: tc.initialTime,
        increment: tc.increment,
        timeLeft: { white: tc.initialTime, black: tc.initialTime },
        isClockRunning: false,
        activePlayer: null
      };
      set({ timeControl: newTimeControl });
    }
  },

  resignGame: (type: ResignationType) => {
    const { currentPlayer, doublingCubeValue } = get();
    const winner = currentPlayer === 'white' ? 'black' : 'white';
    const points = type === 'single' ? 1 : type === 'gammon' ? 2 : 3;
    
    set({
      isGameOver: true,
      gameWinner: winner,
      matchScore: {
        ...get().matchScore,
        [winner]: get().matchScore[winner] + points * doublingCubeValue
      }
    });

    if (get().timeControl) {
      set({ timeControl: { ...get().timeControl!, isClockRunning: false } });
    }
  },

  calculateGameScore: () => {
    const { gameState, potentialGammon, potentialBackgammon, doublingCubeValue } = get();
    return {
      points: 1,
      isGammon: potentialGammon,
      isBackgammon: potentialBackgammon,
      cubeValue: doublingCubeValue
    };
  },

  // Doubling actions
  offerDouble: () => {
    if (!get().canDouble || get().isCrawfordGame) return;
    
    set({
      wasDoubleOffered: true,
      canDouble: false
    });
  },

  acceptDouble: () => {
    const { doublingCubeValue, currentPlayer } = get();
    set({
      doublingCubeValue: doublingCubeValue * 2,
      doublingCubeOwner: currentPlayer,
      wasDoubleOffered: false,
      canDouble: true,
      currentPlayer: currentPlayer === 'white' ? 'black' : 'white'
    });
  },

  rejectDouble: () => {
    const { currentPlayer, doublingCubeValue } = get();
    const winner = currentPlayer;
    
    set({
      isGameOver: true,
      gameWinner: winner,
      matchScore: {
        ...get().matchScore,
        [winner]: get().matchScore[winner] + doublingCubeValue
      },
      wasDoubleOffered: false
    });
  },

  // Turn actions
  rollDice: () => {
    if (!get().canRoll) return;
    
    const dice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    
    set({
      dice,
      canRoll: false,
      // TODO: Calculate valid moves based on dice
      validMoves: []
    });

    // Start clock if time control is enabled
    if (get().timeControl) {
      get().startClock();
    }
  },

  makeMove: (from: number, to: number) => {
    // TODO: Implement move logic
    // This will need to:
    // 1. Update game state
    // 2. Update valid moves
    // 3. Check for gammon/backgammon potential
    // 4. Check for game end
    // 5. Add time increment if using time control
  },

  selectPoint: (pointNumber: number | null) => {
    set({ selectedPoint: pointNumber });
  },

  undoLastMove: () => {
    // TODO: Implement undo logic
  },

  // Clock actions
  startClock: () => {
    if (!get().timeControl) return;
    
    set({
      timeControl: {
        ...get().timeControl!,
        isClockRunning: true,
        activePlayer: get().currentPlayer
      }
    });
  },

  stopClock: () => {
    if (!get().timeControl) return;
    
    set({
      timeControl: {
        ...get().timeControl!,
        isClockRunning: false,
        activePlayer: null
      }
    });
  },

  addIncrement: (player: PlayerColor) => {
    const tc = get().timeControl;
    if (!tc) return;
    
    const newTimeControl: TimeControl = {
      initialTime: tc.initialTime,
      increment: tc.increment,
      timeLeft: {
        ...tc.timeLeft,
        [player]: tc.timeLeft[player] + tc.increment
      },
      isClockRunning: tc.isClockRunning,
      activePlayer: tc.activePlayer
    };
    set({ timeControl: newTimeControl });
  },

  // State sync
  updateGameState: (newState: GameState) => {
    set({ gameState: newState });
  },

  updateMatchScore: (white: number, black: number) => {
    set({
      matchScore: { white, black },
      isMatchOver: white >= get().matchLength || black >= get().matchLength,
      matchWinner: white >= get().matchLength ? 'white' : 
                  black >= get().matchLength ? 'black' : null
    });
  },

  updatePoint: (pointNumber: number, newState: PointState) => {
    const currentState = get().gameState;
    
    // Handle bar and home points
    if (pointNumber === -1) { // Bar
      set({
        gameState: {
          ...currentState,
          bar: {
            ...currentState.bar,
            [newState.color]: newState.count
          }
        }
      });
    } else if (pointNumber === 25) { // White home
      set({
        gameState: {
          ...currentState,
          home: {
            ...currentState.home,
            white: newState.count
          }
        }
      });
    } else if (pointNumber === 26) { // Black home
      set({
        gameState: {
          ...currentState,
          home: {
            ...currentState.home,
            black: newState.count
          }
        }
      });
    } else { // Regular points
      set({
        gameState: {
          ...currentState,
          points: {
            ...currentState.points,
            [pointNumber]: newState.count > 0 ? newState : null
          }
        }
      });
    }
  }
})); 