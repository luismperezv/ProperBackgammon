import { Box } from '@mui/material'

export interface PieceProps {
  color: 'white' | 'black'
}

export const Piece = ({ color }: PieceProps) => {
  return (
    <Box
      sx={{
        width: '90%',
        paddingBottom: '90%', // Makes it a perfect circle
        borderRadius: '50%',
        backgroundColor: color === 'white' ? '#F5F5F5' : '#1A1A1A',
        boxShadow: `0 2px 4px ${color === 'white' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.4)'}`,
        position: 'absolute',
        left: '5%', // Centers the piece horizontally (100% - 90%) / 2
        zIndex: 1,
      }}
    />
  )
}

export default Piece 