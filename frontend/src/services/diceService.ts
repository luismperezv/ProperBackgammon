import api from './axiosConfig';

export const DEBUG_GAME_ID = 'debug-game-001'

interface DiceRollResponse {
  die1: number
  die2: number
  is_doubles: boolean
}

export const rollDice = async (gameId: string): Promise<DiceRollResponse> => {
  if (!gameId) {
    throw new Error('Game ID is required to roll dice')
  }

  const { data } = await api.post<DiceRollResponse>(`/dice/roll`, null, {
    params: { game_id: gameId },
  })
  
  return data
} 