export const DEBUG_GAME_ID = 'debug-game-001'

interface DiceRollResponse {
  die1: number
  die2: number
}

export const rollDice = async (gameId: string): Promise<DiceRollResponse> => {
  if (!gameId) {
    throw new Error('Game ID is required to roll dice')
  }

  const response = await fetch(`/api/dice/roll?game_id=${gameId}`, {
    method: 'POST',
  })
  
  if (!response.ok) {
    throw new Error('Failed to roll dice')
  }
  
  return response.json()
} 