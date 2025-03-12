import { Box, IconButton } from '@mui/material'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

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
        <IconButton size="small">
          <RadioButtonUncheckedIcon />
        </IconButton>
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