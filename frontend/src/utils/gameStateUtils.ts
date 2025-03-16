import { GameState, PlayerColor } from '../store/types';
import { ValidMove } from './moveValidation';

export const createNewGameState = (currentState: GameState): GameState => {
  return {
    points: {},
    bar: { ...currentState.bar },
    home: { ...currentState.home },
    dice_state: {
      values: currentState.dice_state?.values ? [...currentState.dice_state.values] : null,
      used_values: currentState.dice_state?.used_values ? [...currentState.dice_state.used_values] : []
    }
  };
};

export const copyPoints = (newGameState: GameState, currentState: GameState) => {
  Object.entries(currentState.points).forEach(([pointKey, pointState]) => {
    if (pointState) {
      newGameState.points[Number(pointKey)] = {
        color: pointState.color,
        count: pointState.count
      };
    }
  });
};

export const removePieceFromPoint = (
  newGameState: GameState,
  fromPoint: number,
  color: PlayerColor
) => {
  if (fromPoint === -1) {
    // Moving from bar
    newGameState.bar[color]--;
  } else {
    // Moving from a point
    const sourcePoint = newGameState.points[fromPoint];
    if (sourcePoint) {
      sourcePoint.count--;
      if (sourcePoint.count === 0) {
        delete newGameState.points[fromPoint];
      }
    }
  }
};

export const addPieceToPoint = (
  newGameState: GameState,
  toPoint: number,
  color: PlayerColor
) => {
  if (toPoint === 25 || toPoint === 26) {
    // Moving to home
    const homeColor = toPoint === 25 ? 'white' : 'black';
    newGameState.home[homeColor]++;
  } else {
    // Moving to a point
    if (!newGameState.points[toPoint]) {
      newGameState.points[toPoint] = { color, count: 1 };
    } else {
      newGameState.points[toPoint].count++;
    }
  }
};

export const updateDiceState = (
  newGameState: GameState,
  usedValues: number[]
) => {
  if (!newGameState.dice_state?.values) return;

  const isDoubles = newGameState.dice_state.values.length >= 2 && 
                   newGameState.dice_state.values.every(v => v === newGameState.dice_state.values![0]);

  if (isDoubles) {
    // For doubles, keep the original dice values but mark these as used
    newGameState.dice_state = {
      values: newGameState.dice_state.values,
      used_values: [...(newGameState.dice_state.used_values || []), ...usedValues]
    };
  } else {
    // For non-doubles, remove the used values
    const remainingValues = [...newGameState.dice_state.values];
    usedValues.forEach(diceValue => {
      const diceIndex = remainingValues.indexOf(diceValue);
      if (diceIndex !== -1) {
        remainingValues.splice(diceIndex, 1);
      }
    });
    
    newGameState.dice_state = {
      values: remainingValues,
      used_values: [...(newGameState.dice_state.used_values || []), ...usedValues]
    };
  }
}; 