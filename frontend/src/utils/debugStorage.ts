import { GameState } from '../store/types';

const DEBUG_STATES_KEY = 'debug_saved_states';

interface SavedState {
  timestamp: string;
  title: string;
  state: GameState;
}

export const getSavedStates = (): SavedState[] => {
  try {
    const states = localStorage.getItem(DEBUG_STATES_KEY);
    return states ? JSON.parse(states) : [];
  } catch (error) {
    console.error('Error loading saved states:', error);
    return [];
  }
};

export const saveCurrentState = (state: GameState): void => {
  try {
    const states = getSavedStates();
    const now = new Date();
    const timestamp = now.toISOString();
    const title = now.toLocaleString();
    
    states.push({ timestamp, title, state });
    localStorage.setItem(DEBUG_STATES_KEY, JSON.stringify(states));
  } catch (error) {
    console.error('Error saving state:', error);
  }
};

export const loadState = (timestamp: string): GameState | null => {
  try {
    const states = getSavedStates();
    const savedState = states.find(s => s.timestamp === timestamp);
    return savedState ? savedState.state : null;
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
};

export const deleteSavedState = (timestamp: string): void => {
  try {
    const states = getSavedStates();
    const filteredStates = states.filter(s => s.timestamp !== timestamp);
    localStorage.setItem(DEBUG_STATES_KEY, JSON.stringify(filteredStates));
  } catch (error) {
    console.error('Error deleting state:', error);
  }
}; 