import { Box, Typography } from '@mui/material'
import Piece from './Piece'
import HomePiece from './HomePiece'
import { useState, useEffect } from 'react'

export interface StackProps {
  count: number
  color: 'white' | 'black'
  isTopRow?: boolean
  pointNumber: number
  boardWidth: number
  hasValidMoves?: boolean
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
}

export const Stack = ({ 
  count, 
  color, 
  isTopRow = false, 
  pointNumber, 
  boardWidth, 
  hasValidMoves = true,
  onDragStart 
}: StackProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [tempCount, setTempCount] = useState(count)
  
  // Each piece will overlap the previous one by 30%
  const pieceHeight = 20 // Base height percentage
  const overlap = 0.3 // 30% overlap
  const effectiveHeight = pieceHeight * (1 - overlap) // Height after overlap
  const isBar = pointNumber === -1
  const isHome = pointNumber === 25 || pointNumber === 26
  const visibleCount = isBar 
    ? Math.min(2, count) // Show max 2 pieces for bar
    : isHome
      ? count // Show all pieces in home
      : Math.min(6, count) // Show max 6 pieces for regular points
  
  // For home pieces, use a smaller effective height since they're thinner
  const homeEffectiveHeight = 4 // Smaller height for home pieces to create tighter stacking

  // Reset dragging state and tempCount when count changes
  useEffect(() => {
    setIsDragging(false)
    setTempCount(count)
  }, [count])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setTempCount(count - 1)
    if (onDragStart) onDragStart(e)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setTempCount(count)
  }

  // Calculate if this stack needs to overflow the board
  const isEdgePoint = pointNumber === 1 || pointNumber === 6 || 
                     pointNumber === 7 || pointNumber === 12 ||
                     pointNumber === 13 || pointNumber === 18 ||
                     pointNumber === 19 || pointNumber === 24

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(isTopRow ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }),
        ...(isEdgePoint && {
          zIndex: 2,
          overflow: 'visible',
        }),
      }}
    >
      {Array.from({ length: visibleCount }, (_, index) => {
        const isTopPiece = index === visibleCount - 1
        const shouldHide = isDragging && isTopPiece && !isHome && (!isBar && count <= 6)

        // Position pieces starting from the edge (0%) and stack inward
        const position = isBar
          ? {
              top: '50%',
              transform: 'translateY(-50%)'
            }
          : isHome
            ? (pointNumber === 25)  // White home
              ? { bottom: `${3 + index * homeEffectiveHeight}%` }  // Stack from bottom up with offset
              : { top: `${3 + index * homeEffectiveHeight}%` }     // Stack from top for black home with offset
            : isTopRow
            ? { top: `${3 + index * effectiveHeight}%` }
            : { bottom: `${3 + index * effectiveHeight}%` }

        return isHome ? (
          <HomePiece 
            key={index}
            color={color}
            boardWidth={boardWidth}
            pointNumber={pointNumber}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isTopPiece={isTopPiece}
            hasValidMoves={hasValidMoves}
            sx={{
              position: 'absolute',
              ...position,
              visibility: shouldHide ? 'hidden' : 'visible',
              ...(isEdgePoint && {
                zIndex: 2,
              }),
            }}
          />
        ) : (
          <Piece 
            key={index}
            color={color} 
            pointNumber={pointNumber}
            boardWidth={boardWidth}
            onDragStart={isBar && index === 0 ? undefined : handleDragStart}
            onDragEnd={handleDragEnd}
            isTopPiece={isTopPiece}
            isTopRow={isTopRow}
            hasValidMoves={hasValidMoves}
            sx={{
              position: 'absolute',
              ...position,
              visibility: shouldHide ? 'hidden' : 'visible',
              ...(isBar && {
                left: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: index === 0 ? 'default' : 'grab'
              }),
              ...(isEdgePoint && {
                zIndex: 2,
              }),
            }}
          >
            {!isHome && (
              (!isBar && isTopPiece && tempCount > 6) || 
              (isBar && isTopPiece && (isDragging ? tempCount >= 2 : count >= 2))
            ) && (
              <Typography
                sx={{
                  color: color === 'white' ? '#1A1A1A' : '#F5F5F5',
                  fontWeight: 'bold',
                  fontSize: '1.4rem',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  textAlign: 'center',
                }}
              >
                {tempCount}
              </Typography>
            )}
          </Piece>
        )
      })}
      {/* Add total counter for home stacks */}
      {isHome && count > 0 && (
        <Typography
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            ...(pointNumber === 26
              ? { bottom: 0 }
              : { top: 0 }),
            color: color === 'white' ? '#1A1A1A' : '#F5F5F5',
            backgroundColor: color === 'white' ? '#F5F5F5' : '#1A1A1A',
            fontWeight: 'bold',
            fontSize: '1.8rem',
            userSelect: 'none',
            pointerEvents: 'none',
            width: `${boardWidth * 0.06}px`,
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: pointNumber === 26 
              ? '8px 8px 0 0'
              : '0 0 8px 8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 3,
          }}
        >
          {count}
        </Typography>
      )}
    </Box>
  )
}

export default Stack 