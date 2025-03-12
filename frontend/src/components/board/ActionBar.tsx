import { Box, IconButton, Button } from '@mui/material'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CasinoIcon from '@mui/icons-material/Casino'

export const ActionBar = () => {
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
        }}
      >
        <Button
          id="dice-roll"
          variant="contained"
          color="primary"
          startIcon={<CasinoIcon sx={{ fontSize: 28 }} />}
          size="large"
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
      >
        <IconButton size="small">
          <RadioButtonUncheckedIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default ActionBar 