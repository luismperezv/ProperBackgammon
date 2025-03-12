import { Box, Typography } from '@mui/material'
import { useGameStore } from '../../store/gameStore'

export const DiceDisplay = () => {
  const { dice } = useGameStore()

  if (!dice || dice.length === 0) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
      }}
    >
      {dice.map((value, index) => (
        <Typography
          key={index}
          sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'primary.main',
            borderRadius: '8px',
            boxShadow: (theme) => `0 2px 4px ${theme.palette.primary.main}40`,
          }}
        >
          {value}
        </Typography>
      ))}
    </Box>
  )
} 