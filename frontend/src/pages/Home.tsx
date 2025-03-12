import { Box, Typography, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function Home() {
  const navigate = useNavigate()

  const handleCreateGame = async () => {
    try {
      const game = await api.createGame()
      navigate(`/game/${game.id}`)
    } catch (error) {
      console.error('Error creating game:', error)
    }
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