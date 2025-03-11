import { Box } from '@mui/material'

export interface PieceProps {
  color: 'white' | 'black'
  pointNumber: number
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
}

export const Piece = ({ color, pointNumber, onDragStart }: PieceProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      color,
      fromPoint: pointNumber
    }))
    if (onDragStart) onDragStart(e)
  }

  return (
    <Box
      draggable
      onDragStart={handleDragStart}
      sx={{
        width: '90%',
        paddingBottom: '90%', // Makes it a perfect circle
        borderRadius: '50%',
        backgroundColor: color === 'white' ? '#F5F5F5' : '#1A1A1A',
        boxShadow: `0 2px 4px ${color === 'white' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.4)'}`,
        position: 'absolute',
        left: '5%', // Centers the piece horizontally (100% - 90%) / 2
        zIndex: 1,
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    />
  )
}

export default Piece 