import { Box, IconButton, Button } from '@mui/material'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CasinoIcon from '@mui/icons-material/Casino'
import { useGameStore } from '../../store/gameStore'
import { rollDice } from '../../services/diceService'
import { DiceDisplay } from './DiceDisplay'

interface ActionBarProps {
  boardWidth: number
}

export const ActionBar = ({ boardWidth }: ActionBarProps) => {
  const { rollDice: storeRollDice, canRoll, dice, currentGameId } = useGameStore()

  const handleRollDice = async () => {
    if (!currentGameId) {
      console.error('No active game')
      return
    }

    try {
      const data = await rollDice(currentGameId)
      // Update game store with dice roll results
      storeRollDice([data.die1, data.die2] as [number, number])
    } catch (error) {
      console.error('Error rolling dice:', error)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
      }}
    >
      {/* Away board section - 42% */}
      <Box
        id="action-away-board"
        sx={{
          width: '42%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton size="small">
          <RadioButtonUncheckedIcon />
        </IconButton>
      </Box>

      {/* Center bar section - 8% */}
      <Box
        id="action-center-bar"
        sx={{
          width: '8%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton size="small">
          <RadioButtonUncheckedIcon />
        </IconButton>
      </Box>

      {/* Home board section - 42% */}
      <Box
        id="action-home-board"
        sx={{
          width: '42%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {dice && dice.length > 0 ? (
          <DiceDisplay boardWidth={boardWidth} />
        ) : (
          <Button
            id="dice-roll"
            variant="contained"
            color="primary"
            startIcon={<CasinoIcon sx={{ fontSize: 28 }} />}
            size="large"
            disabled={!canRoll}
            onClick={handleRollDice}
            sx={{
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
              boxShadow: (theme) => `0 4px 8px ${theme.palette.primary.main}40`,
            }}
          >
            Roll Dice
          </Button>
        )}
      </Box>

      {/* Home bar section - 8% */}
      <Box
        id="action-home-bar"
        sx={{
          width: '8%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </Box>
  )
}

export default ActionBar 