import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Stack from './Stack'
import { useGameStore } from '../../store/gameStore'
import { PointState } from '../../store/types'

const GOLDEN_RATIO = 1.618033988749895

export const Board = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  // Get game state from store
  const gameState = useGameStore(state => state.gameState)
  const selectedPoint = useGameStore(state => state.selectedPoint)
  const selectPoint = useGameStore(state => state.selectPoint)
  const updatePoint = useGameStore(state => state.updatePoint)

  const updateDimensions = () => {
    if (!containerRef.current) return

    const container = containerRef.current
    const maxWidth = container.clientWidth
    const maxHeight = container.clientHeight
    
    // Calculate dimensions that maintain the golden ratio while fitting in the container
    let width, height
    
    if (maxWidth / maxHeight > GOLDEN_RATIO) {
      // Container is wider than golden ratio, height is the constraint
      height = maxHeight
      width = height * GOLDEN_RATIO
    } else {
      // Container is taller than golden ratio, width is the constraint
      width = maxWidth
      height = width / GOLDEN_RATIO
    }

    setDimensions({ width, height })
  }

  useEffect(() => {
    updateDimensions()
    
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toPoint: number) => {
    e.preventDefault()
    const data = JSON.parse(e.dataTransfer.getData('text/plain'))
    const { color, fromPoint } = data as { color: 'white' | 'black', fromPoint: number }

    // Handle dragging from regular points
    if (fromPoint >= 0) {
      // Get the source and target point states
      const sourcePoint = gameState.points[fromPoint]
      const targetPoint = gameState.points[toPoint]

      // Don't allow dropping if:
      // 1. Target point has pieces of different color
      // 2. Source point doesn't exist or has no pieces
      if (!sourcePoint || sourcePoint.count <= 0) return
      if (targetPoint && targetPoint.color !== color) return

      // Update the points
      updatePoint(fromPoint, {
        color: sourcePoint.color,
        count: sourcePoint.count - 1
      })

      updatePoint(toPoint, {
        color,
        count: (targetPoint?.count || 0) + 1
      })
    } 
    // Handle dragging from the bar
    else if (fromPoint === -1) {
      // Get the bar state for the color
      const barCount = gameState.bar[color]
      const targetPoint = gameState.points[toPoint]

      // Don't allow dropping if:
      // 1. No pieces of this color on the bar
      // 2. Target point has pieces of different color
      if (barCount <= 0) return
      if (targetPoint && targetPoint.color !== color) return

      // Update the bar and target point
      updatePoint(-1, {
        color,
        count: barCount - 1
      })

      updatePoint(toPoint, {
        color,
        count: (targetPoint?.count || 0) + 1
      })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault() // Required to allow dropping
  }

  // Helper function to create point columns with triangles and pieces
  const createPointColumns = (startNum: number, count: number, reverse = false, isTopRow = false) => {
    const points = Array.from({ length: count }, (_, index) => {
      const pointNumber = reverse 
        ? startNum + count - 1 - index 
        : startNum + index
      
      // Alternate colors based on point number
      const isEven = pointNumber % 2 === 0
      const triangleColor = isEven ? '#E8D0AA' : '#4A2511' // Light wood / Lighter dark wood
      
      // Get point state from game state
      const pointState: PointState | null = gameState.points[pointNumber] || null

      return (
        <Box
          key={pointNumber}
          id={`point-${pointNumber}`}
          onClick={() => selectPoint(pointNumber)}
          onDrop={(e) => handleDrop(e, pointNumber)}
          onDragOver={handleDragOver}
          sx={{
            width: `${100 / 6}%`,
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            ...(isTopRow ? { justifyContent: 'flex-start' } : { justifyContent: 'flex-end' }),
            '&::before': {
              content: '""',
              position: 'relative',
              width: '100%',
              height: '80%',
              clipPath: isTopRow
                ? 'polygon(0% 0%, 50% 100%, 100% 0%)'
                : 'polygon(0% 100%, 50% 0%, 100% 100%)',
              backgroundColor: triangleColor,
              transition: 'background-color 0.3s ease',
            },
            // Highlight selected point
            ...(selectedPoint === pointNumber && {
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 0, 0.3)',
                pointerEvents: 'none',
              }
            })
          }}
        >
          {/* Render pieces if there are any on this point */}
          {pointState && (
            <Stack
              count={pointState.count}
              color={pointState.color}
              isTopRow={isTopRow}
              pointNumber={pointNumber}
            />
          )}
        </Box>
      )
    })
    return points
  }

  const barAndHomeStyle = {
    width: '8%',
    height: '100%',
    bgcolor: '#3A1D0E', // Lighter dark wood color for bar and homes
    position: 'relative' as const,
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          bgcolor: '#8B4513', // Wood brown color
          borderRadius: 1,
          boxShadow: 3,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top row (13-24) */}
        <Box
          id="13-24"
          sx={{
            flex: 1,
            borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
          }}
        >
          <Box
            id="13-18"
            sx={{
              width: '42%',
              height: '100%',
              display: 'flex',
            }}
          >
            {createPointColumns(13, 6, false, true)}
          </Box>
          <Box
            id="black-bar"
            sx={barAndHomeStyle}
            onDrop={(e) => handleDrop(e, -1)} // -1 represents the bar
            onDragOver={handleDragOver}
          >
            {/* Render black pieces on the bar */}
            {gameState.bar.black > 0 && (
              <Stack
                count={gameState.bar.black}
                color="black"
                isTopRow={true}
                pointNumber={-1}
              />
            )}
          </Box>
          <Box
            id="19-24"
            sx={{
              width: '42%',
              height: '100%',
              display: 'flex',
            }}
          >
            {createPointColumns(19, 6, false, true)}
          </Box>
          <Box
            id="white-home"
            sx={barAndHomeStyle}
            onDrop={(e) => handleDrop(e, 25)} // 25 represents white home
            onDragOver={handleDragOver}
          >
            {/* Render white pieces in home */}
            {gameState.home.white > 0 && (
              <Stack
                count={gameState.home.white}
                color="white"
                isTopRow={true}
                pointNumber={25}
              />
            )}
          </Box>
        </Box>

        {/* Bottom row (01-12) */}
        <Box
          id="01-12"
          sx={{
            flex: 1,
            borderTop: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
          }}
        >
          <Box
            id="07-12"
            sx={{
              width: '42%',
              height: '100%',
              display: 'flex',
            }}
          >
            {createPointColumns(7, 6, true, false)}
          </Box>
          <Box
            id="white-bar"
            sx={barAndHomeStyle}
            onDrop={(e) => handleDrop(e, -1)} // -1 represents the bar
            onDragOver={handleDragOver}
          >
            {/* Render white pieces on the bar */}
            {gameState.bar.white > 0 && (
              <Stack
                count={gameState.bar.white}
                color="white"
                isTopRow={false}
                pointNumber={-1}
              />
            )}
          </Box>
          <Box
            id="01-06"
            sx={{
              width: '42%',
              height: '100%',
              display: 'flex',
            }}
          >
            {createPointColumns(1, 6, true, false)}
          </Box>
          <Box
            id="black-home"
            sx={barAndHomeStyle}
            onDrop={(e) => handleDrop(e, 26)} // 26 represents black home
            onDragOver={handleDragOver}
          >
            {/* Render black pieces in home */}
            {gameState.home.black > 0 && (
              <Stack
                count={gameState.home.black}
                color="black"
                isTopRow={false}
                pointNumber={26}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Board
