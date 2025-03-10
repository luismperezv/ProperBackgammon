import { Box, Typography, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const handleCreateGame = () => {
    // TODO: Implement game creation logic
    navigate('/game/new')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Backgammon Online
      </Typography>
      
      <Paper
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Ready to play?
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateGame}
        >
          Create New Game
        </Button>
      </Paper>
    </Box>
  )
}

export default Home 