import { Box, Typography } from '@mui/material'
import { useGameStore } from '../../store/gameStore'

interface DiceDisplayProps {
  boardWidth: number
}

export const DiceDisplay = ({ boardWidth }: DiceDisplayProps) => {
  const { dice, currentPlayer } = useGameStore()
  const diceSize = boardWidth * 0.05 // Match piece size (5% of board width)

  if (!dice || dice.length === 0) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {dice.map((value, index) => (
        <Typography
          key={index}
          sx={{
            fontSize: `${diceSize * 0.6}px`, // Scale font size relative to dice size
            fontWeight: 'bold',
            color: currentPlayer === 'black' ? '#FFFFFF' : '#1A1A1A',
            width: `${diceSize}px`,
            height: `${diceSize}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentPlayer === 'black' ? '#1A1A1A' : '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {value}
        </Typography>
      ))}
    </Box>
  )
} 