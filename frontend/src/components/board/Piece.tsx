import { Box } from '@mui/material'

export interface PieceProps {
  color: 'white' | 'black'
  pointNumber: number
  boardWidth: number
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
}

export const Piece = ({ color, pointNumber, boardWidth, onDragStart }: PieceProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      color,
      fromPoint: pointNumber
    }))
    if (onDragStart) onDragStart(e)
  }

  // Calculate piece size as 6% of board width
  const pieceSize = `${boardWidth * 0.06}px`

  return (
    <Box
      draggable
      onDragStart={handleDragStart}
      sx={{
        width: pieceSize,
        height: pieceSize,
        borderRadius: '50%',
        backgroundColor: color === 'white' ? '#F5F5F5' : '#1A1A1A',
        boxShadow: `0 2px 4px ${color === 'white' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.4)'}`,
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
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