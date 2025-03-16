import { Box } from '@mui/material'

interface PhantomPieceProps {
  color: 'white' | 'black'
  isTopRow: boolean
  pointNumber: number
  boardWidth: number
  stackHeight: number // Number of pieces currently in the stack
}

export const PhantomPiece = ({ color, isTopRow, pointNumber, boardWidth, stackHeight }: PhantomPieceProps) => {
  // Calculate piece size as 6% of board width to match regular pieces
  const pieceSize = boardWidth * 0.06
  const pieceSizePx = `${pieceSize}px`

  // Calculate vertical position based on stack height and row position
  const calculatePosition = () => {
    const stackOffset = stackHeight * (pieceSize * 0.85) // 0.85 is the overlap factor for stacked pieces
    const baseOffset = pieceSize * 0.03 // 3% base offset from edge
    
    if (isTopRow) {
      return { top: `${baseOffset + stackOffset}px` }
    } else {
      return { bottom: `${baseOffset + stackOffset}px` }
    }
  }

  const position = calculatePosition()

  return (
    <Box
      sx={{
        width: pieceSizePx,
        height: pieceSizePx,
        borderRadius: '50%',
        backgroundColor: color === 'white' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
        border: '2px solid',
        borderColor: color === 'white' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        pointerEvents: 'none',
        boxShadow: `0 0 16px ${color === 'white' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}`,
        ...position
      }}
    />
  )
} 