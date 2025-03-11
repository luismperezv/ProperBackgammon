import { Box, Typography } from '@mui/material'
import Piece from './Piece'

export interface StackProps {
  count: number
  color: 'white' | 'black'
  isTopRow?: boolean
  pointNumber: number
  boardWidth: number
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
}

export const Stack = ({ count, color, isTopRow = false, pointNumber, boardWidth, onDragStart }: StackProps) => {
  // Each piece will overlap the previous one by 30%
  const pieceHeight = 20 // Base height percentage
  const overlap = 0.3 // 30% overlap
  const effectiveHeight = pieceHeight * (1 - overlap) // Height after overlap
  const visibleCount = Math.min(count, 6)
  
  // Add offset to prevent clipping at board edges
  const topEdgeOffset = 2 // percentage from edge for top row
  const bottomEdgeOffset = 3 // percentage from edge for bottom row

  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(isTopRow ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }),
      }}
    >
      {Array.from({ length: visibleCount }, (_, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: '100%',
            height: `${pieceHeight}%`,
            ...(isTopRow
              ? { top: `${index * effectiveHeight + topEdgeOffset}%` }
              : { bottom: `${index * effectiveHeight + bottomEdgeOffset}%` }),
          }}
        >
          <Piece 
            color={color} 
            pointNumber={pointNumber}
            boardWidth={boardWidth}
            onDragStart={onDragStart}
          />
          {/* Show count on the last visible piece if there are more pieces */}
          {index === visibleCount - 1 && count > 6 && (
            <>
              {/* Dark outline for visibility */}
              {[-1, 0, 1].map((offsetX) => (
                [-1, 0, 1].map((offsetY) => (
                  <Typography
                    key={`${offsetX}-${offsetY}`}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
                      color: color === 'white' ? '#1A1A1A' : '#F5F5F5',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      userSelect: 'none',
                      textShadow: color === 'white'
                        ? '1px 1px 0 #F5F5F5, -1px 1px 0 #F5F5F5, 1px -1px 0 #F5F5F5, -1px -1px 0 #F5F5F5'
                        : '1px 1px 0 #1A1A1A, -1px 1px 0 #1A1A1A, 1px -1px 0 #1A1A1A, -1px -1px 0 #1A1A1A',
                      zIndex: offsetX === 0 && offsetY === 0 ? 2 : 1,
                    }}
                  >
                    {count}
                  </Typography>
                ))
              ))}
            </>
          )}
        </Box>
      ))}
    </Box>
  )
}

export default Stack 