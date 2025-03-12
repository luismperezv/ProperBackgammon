import { Box } from '@mui/material'

export interface HomePieceProps {
  color: 'white' | 'black'
  boardWidth: number
  pointNumber: number
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnd?: () => void
  isTopPiece?: boolean
  sx?: any // Allow additional styles to be passed in
}

export const HomePiece = ({ color, boardWidth, pointNumber, onDragStart, onDragEnd, isTopPiece = false, sx }: HomePieceProps) => {
  // Calculate piece width to match regular pieces (6% of board width)
  const pieceWidth = `${boardWidth * 0.06}px`
  // Make the piece height thicker (12px instead of 8px)
  const pieceHeight = `${boardWidth * 0.01}px`

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Create a div element for the drag image
    const dragImage = document.createElement('div')
    
    // Apply styles directly to ensure no clipping contexts
    Object.assign(dragImage.style, {
      width: pieceWidth,
      height: pieceHeight,
      backgroundColor: color === 'white' ? '#F5F5F5' : '#1A1A1A',
      backgroundImage: `linear-gradient(to bottom, ${color === 'white' ? '#FFFFFF' : '#333333'}, ${color === 'white' ? '#F5F5F5' : '#1A1A1A'})`,
      boxShadow: `0 2px 4px ${color === 'white' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)'}`,
      position: 'fixed',
      left: '-1000px', // Position off-screen
      top: '-1000px',
      zIndex: '-1',
      opacity: '0.6',
      pointerEvents: 'none',
      transform: 'none',
      borderRadius: '4px'
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

  return (
    <Box
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sx={{
        width: pieceWidth,
        height: pieceHeight,
        backgroundColor: color === 'white' ? '#F5F5F5' : '#1A1A1A',
        backgroundImage: `linear-gradient(to bottom, ${color === 'white' ? '#FFFFFF' : '#333333'}, ${color === 'white' ? '#F5F5F5' : '#1A1A1A'})`,
        boxShadow: `0 2px 4px ${color === 'white' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)'}`,
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: '4px',
        cursor: 'grab',
        transition: 'all 0.2s ease-in-out',
        '&:active': {
          cursor: 'grabbing',
        },
        ...(isTopPiece && {
          '&:hover': {
            boxShadow: `0 4px 8px ${color === 'white' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.6)'}`,
          }
        }),
        ...sx // Merge in any additional styles
      }}
    />
  )
}

export default HomePiece 