import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        py: 8,
      }}
    >
      <Typography variant="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
      >
        Go Home
      </Button>
    </Box>
  )
}

export default NotFound 