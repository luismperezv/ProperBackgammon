import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

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
        }}
      >
        {/* Board content will go here */}
      </Box>
    </Box>
  )
}

export default Board
