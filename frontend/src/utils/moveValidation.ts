import { GameState } from '../store/types'

export interface ValidMove {
  fromPoint: number
  toPoint: number
  diceValue: number
  isCompoundMove?: boolean
  usedValues: number[]
}

export const getValidMoves = (
  gameState: GameState,
  fromPoint: number,
  currentPlayer: 'white' | 'black'
): ValidMove[] => {
  const validMoves: ValidMove[] = []
  const diceValues = gameState.dice_state.values || []
  const usedValues = gameState.dice_state.used_values || []
  
  // If no dice values, no valid moves
  if (!diceValues.length) {
    return []
  }

  // Check if it's doubles (both dice have same value)
  const isDoubles = diceValues.length >= 2 && diceValues.every(v => v === diceValues[0])
  
  // For doubles, expand the dice values to four identical values
  const expandedDiceValues = isDoubles ? Array(4).fill(diceValues[0]) : diceValues
  
  // Get available dice values considering doubles and used values
  const availableDiceValues = expandedDiceValues.filter((value, index) => {
    // Count how many times this value has been used
    const timesUsed = usedValues.filter(used => used === value).length
    // For doubles, we can use each value up to the number of times it appears in expandedDiceValues
    const maxUses = isDoubles ? 4 : diceValues.filter(v => v === value).length
    return timesUsed < maxUses
  })

  if (availableDiceValues.length === 0) {
    return []
  }

  // Helper function to check if a point is a valid target
  const isValidTarget = (point: number) => {
    if (point < 1 || point > 24) return false
    const targetPoint = gameState.points[point]
    return !targetPoint || // empty point
           targetPoint.color === currentPlayer || // our pieces
           (targetPoint.color !== currentPlayer && targetPoint.count === 1) // single opponent piece
  }

  // Calculate single moves first
  availableDiceValues.forEach(diceValue => {
    const direction = currentPlayer === 'white' ? -1 : 1
    const toPoint = fromPoint + (diceValue * direction)
    
    if (isValidTarget(toPoint)) {
      validMoves.push({
        fromPoint,
        toPoint,
        diceValue,
        isCompoundMove: false,
        usedValues: [diceValue]
      })
    }
  })

  // Calculate compound moves
  if (availableDiceValues.length >= 2) {
    const direction = currentPlayer === 'white' ? -1 : 1
    
    // For doubles, try all possible combinations of consecutive dice
    if (isDoubles) {
      const diceValue = availableDiceValues[0]
      
      // Try moves using 2, 3, or 4 dice
      for (let numDice = 2; numDice <= availableDiceValues.length; numDice++) {
        const totalDistance = diceValue * numDice
        const targetPoint = fromPoint + (totalDistance * direction)
        
        // Check if all intermediate points are valid
        let allPointsValid = true
        for (let i = 1; i < numDice; i++) {
          const intermediatePoint = fromPoint + (diceValue * i * direction)
          if (!isValidTarget(intermediatePoint)) {
            allPointsValid = false
            break
          }
        }
        
        if (allPointsValid && isValidTarget(targetPoint)) {
          validMoves.push({
            fromPoint,
            toPoint: targetPoint,
            diceValue: totalDistance,
            isCompoundMove: true,
            usedValues: Array(numDice).fill(diceValue)
          })
        }
      }
    }
    // For non-doubles, try all permutations of available dice values
    else {
      for (let i = 0; i < availableDiceValues.length; i++) {
        for (let j = 0; j < availableDiceValues.length; j++) {
          if (i !== j) {
            const firstValue = availableDiceValues[i]
            const secondValue = availableDiceValues[j]
            
            // Calculate intermediate point after first move
            const intermediatePoint = fromPoint + (firstValue * direction)
            
            // If intermediate point is valid, check final point
            if (isValidTarget(intermediatePoint)) {
              const finalPoint = intermediatePoint + (secondValue * direction)
              
              if (isValidTarget(finalPoint)) {
                validMoves.push({
                  fromPoint,
                  toPoint: finalPoint,
                  diceValue: firstValue + secondValue,
                  isCompoundMove: true,
                  usedValues: [firstValue, secondValue]
                })
              }
            }
          }
        }
      }
    }
  }

  return validMoves
} 