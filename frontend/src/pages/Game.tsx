import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import Board from '../components/board/Board'

// TODO: Add game board component and WebSocket connection

function Game() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Initialize game state and WebSocket connection
    const initializeGame = async () => {
      try {
        setLoading(false)
      } catch (err) {
        setError('Failed to initialize game')
        setLoading(false)
      }
    }

    initializeGame()
  }, [])

  if (loading) {
    return <Typography>Loading game...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 64px)', // Full height minus header
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Board />
    </Box>
  )
}

export default Game 