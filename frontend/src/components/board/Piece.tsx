import { Box } from '@mui/material'
import { ReactNode } from 'react'

export interface PieceProps {
  color: 'white' | 'black'
  pointNumber: number
  boardWidth: number
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnd?: () => void
  isTopPiece?: boolean
  isTopRow?: boolean
  hasValidMoves?: boolean
  sx?: any // Allow additional styles to be passed in
  children?: ReactNode
}

export const Piece = ({ color, pointNumber, boardWidth, onDragStart, onDragEnd, isTopPiece = false, isTopRow = false, hasValidMoves = true, sx, children }: PieceProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Create a div element for the drag image
    const dragImage = document.createElement('div')
    const pieceSize = `${boardWidth * 0.06}px`
    
    // Apply styles directly to ensure no clipping contexts
    Object.assign(dragImage.style, {
      width: pieceSize,
      height: pieceSize,
      borderRadius: '50%',
      backgroundColor: color === 'white' ? '#F5F5F5' : '#1A1A1A',
      backgroundImage: `radial-gradient(circle at 30% 30%, ${color === 'white' ? '#FFFFFF' : '#333333'}, ${color === 'white' ? '#F5F5F5' : '#1A1A1A'})`,
      boxShadow: `0 4px 8px ${color === 'white' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)'}`,
      position: 'fixed',
      left: '-1000px', // Position off-screen
      top: '-1000px',
      zIndex: '-1',
      opacity: '0.6',
      pointerEvents: 'none',
      transform: 'none'
    })
    
    document.body.appendChild(dragImage)
    
    // Get the initial click position relative to the piece
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    // Set the drag image with the proper offset
    e.dataTransfer.setDragImage(dragImage, offsetX, offsetY)

    // Remove the temporary drag image after a short delay
    requestAnimationFrame(() => {
      document.body.removeChild(dragImage)
    })

    e.dataTransfer.setData('text/plain', JSON.stringify({
      color,
      fromPoint: pointNumber
    }))
    if (onDragStart) onDragStart(e)
  }

  const handleDragEnd = () => {
    if (onDragEnd) onDragEnd()
  }

  // Calculate piece size as 6% of board width
  const pieceSize = `${boardWidth * 0.06}px`

  return (
    <Box
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sx={{
        width: pieceSize,
        height: pieceSize,
        borderRadius: '50%',
        backgroundColor: color === 'white' ? '#F5F5F5' : '#1A1A1A',
        backgroundImage: `radial-gradient(circle at 30% 30%, ${color === 'white' ? '#FFFFFF' : '#333333'}, ${color === 'white' ? '#F5F5F5' : '#1A1A1A'})`,
        boxShadow: `0 4px 8px ${color === 'white' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)'}`,
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        cursor: hasValidMoves ? 'grab' : 'not-allowed',
        transition: 'all 0.2s ease-in-out',
        '&:active': {
          cursor: hasValidMoves ? 'grabbing' : 'not-allowed',
        },
        '@keyframes shake': {
          '0%, 100%': {
            transform: 'translateX(-50%)',
          },
          '25%': {
            transform: 'translateX(calc(-50% - 5px))',
          },
          '75%': {
            transform: 'translateX(calc(-50% + 5px))',
          },
        },
        ...(isTopPiece && {
          '[data-point]:hover &': hasValidMoves ? {
            transform: `translateX(-50%) translateY(${isTopRow ? '8px' : '-8px'})`,
            boxShadow: `0 ${isTopRow ? '-8px' : '8px'} 16px ${color === 'white' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.6)'}`,
          } : {
            animation: 'shake 0.4s ease-in-out',
          }
        }),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx // Merge in any additional styles
      }}
    >
      {children}
    </Box>
  )
}

export default Piece 