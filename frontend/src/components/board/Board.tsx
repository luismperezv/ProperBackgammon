import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Stack from './Stack'

const GOLDEN_RATIO = 1.618033988749895

export const Board = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

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

  // Helper function to create point columns with triangles
  const createPointColumns = (startNum: number, count: number, reverse = false, isTopRow = false) => {
    const points = Array.from({ length: count }, (_, index) => {
      const pointNumber = reverse 
        ? startNum + count - 1 - index 
        : startNum + index
      
      // Alternate colors based on point number
      const isEven = pointNumber % 2 === 0
      const triangleColor = isEven ? '#E8D0AA' : '#4A2511' // Light wood / Lighter dark wood

      // Calculate piece count for each point
      let pieceCount = 0
      let pieceColor: 'white' | 'black' = 'white'

      // Bottom row points 1-12: increasing white pieces
      if (pointNumber >= 1 && pointNumber <= 12) {
        pieceCount = pointNumber
        pieceColor = 'white'
      }
      // Top row points 13-24: decreasing black pieces
      else if (pointNumber >= 13 && pointNumber <= 24) {
        pieceCount = 24 - pointNumber + 13
        pieceColor = 'black'
      }

      return (
        <Box
          key={pointNumber}
          id={`point-${pointNumber}`}
          sx={{
            width: `${100 / 6}%`,
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
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
          }}
        >
          {pieceCount > 0 && (
            <Stack 
              count={pieceCount} 
              color={pieceColor} 
              isTopRow={isTopRow}
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
          />
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
          />
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
          />
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
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Board
