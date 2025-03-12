import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Stack from './Stack'
import { useGameStore } from '../../store/gameStore'
import { PointState } from '../../store/types'
import ActionBar from './ActionBar'

const GOLDEN_RATIO = 1.618033988749895

export const Board = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  // Get game state from store
  const gameState = useGameStore(state => state.gameState)
  const selectPoint = useGameStore(state => state.selectPoint)
  const updateGameState = useGameStore(state => state.updateGameState)
  const currentGameId = useGameStore(state => state.currentGameId)

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

  useEffect(() => {
    // Start a new game when component mounts if there isn't one
    const initGame = async () => {
      if (!currentGameId) {
        await useGameStore.getState().startNewGame();
      }
    };
    initGame();
  }, [currentGameId]);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, toPoint: number) => {
    e.preventDefault()
    const data = JSON.parse(e.dataTransfer.getData('text/plain'))
    const { color, fromPoint } = data as { color: 'white' | 'black', fromPoint: number }

    if (!currentGameId) {
      console.error('No active game');
      return;
    }

    try {
      // Call backend to validate and execute move
      const response = await fetch(`/api/game/${currentGameId}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_point: fromPoint,
          to_point: toPoint,
          color: color,
        }),
      })

      if (!response.ok) {
        // Handle invalid move
        console.error('Invalid move:', await response.text())
        return
      }

      // Update game state with the new state from backend
      const newGameState = await response.json()
      updateGameState(newGameState.state)
    } catch (error) {
      console.error('Error making move:', error)
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
      const triangleColor = isEven ? '#F4E4C1' : '#B98B50' // Lighter wood colors for triangles
      
      // Get point state from game state
      const pointState: PointState | null = gameState.points[pointNumber] || null

      return (
        <Box
          key={pointNumber}
          id={`point-${pointNumber}`}
          data-point={pointNumber}
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
              position: 'absolute',
              width: '100%',
              height: '80%',
              ...(isTopRow ? { top: 0 } : { bottom: 0 }),
              clipPath: isTopRow
                ? 'polygon(0% 0%, 50% 100%, 100% 0%)'
                : 'polygon(0% 100%, 50% 0%, 100% 100%)',
              backgroundColor: triangleColor,
              transition: 'background-color 0.3s ease',
            },
          }}
        >
          {/* Render pieces if there are any on this point */}
          {pointState && (
            <Stack
              count={pointState.count}
              color={pointState.color}
              isTopRow={isTopRow}
              pointNumber={pointNumber}
              boardWidth={dimensions.width}
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
    bgcolor: '#D4A76A', // Lighter wood color for bar and homes
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
      {/* Border element */}
      <Box
        sx={{
          position: 'absolute',
          width: `${dimensions.width * 1.06}px`, // Add 6% (3% on each side)
          height: `${dimensions.height + (dimensions.width * 0.06)}px`, // Add 3% of width to top and bottom
          backgroundColor: '#8B4513', // Darker wood color for border
          borderRadius: 2,
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
        }}
      />
      <Box
        sx={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          bgcolor: '#DEB887', // Lighter burlywood color for the main board
          borderRadius: 1,
          boxShadow: 3,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // Clip the board corners
          zIndex: 1,
        }}
      >
        {/* Top row (13-24) */}
        <Box
          id="13-24"
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            zIndex: 0,
          }}
        >
          <Box
            id="13-18"
            sx={{
              width: '42%',
              height: '100%',
              display: 'flex',
              position: 'relative',
              zIndex: 0,
            }}
          >
            {createPointColumns(13, 6, false, true)}
          </Box>
          <Box
            id="white-bar"
            sx={{
              ...barAndHomeStyle,
              position: 'relative',
              zIndex: 0,
            }}
            onDrop={(e) => handleDrop(e, -1)}
            onDragOver={handleDragOver}
          >
            {/* Render white pieces on the bar */}
            {gameState.bar.white > 0 && (
              <Stack
                count={gameState.bar.white}
                color="white"
                isTopRow={true}
                pointNumber={-1}
                boardWidth={dimensions.width}
              />
            )}
          </Box>
          <Box
            id="19-24"
            sx={{
              width: '42%',
              height: '100%',
              display: 'flex',
              position: 'relative',
              zIndex: 0,
            }}
          >
            {createPointColumns(19, 6, false, true)}
          </Box>
          <Box
            id="black-home"
            sx={{
              ...barAndHomeStyle,
              position: 'relative',
              zIndex: 0,
            }}
            onDrop={(e) => handleDrop(e, 26)}
            onDragOver={handleDragOver}
          >
            {/* Render black pieces in home */}
            {gameState.home.black > 0 && (
              <Stack
                count={gameState.home.black}
                color="black"
                isTopRow={true}
                pointNumber={26}
                boardWidth={dimensions.width}
              />
            )}
          </Box>
        </Box>

        {/* Action Bar */}
        <Box
          id="action-bar"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            transform: 'translateY(-50%)',
            zIndex: 1
          }}
        >
          <ActionBar boardWidth={dimensions.width} />
        </Box>

        {/* Bottom row (01-12) */}
        <Box
          id="01-12"
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            zIndex: 0,
          }}
        >
          <Box
            id="07-12"
            sx={{
              width: '42%',
              height: '100%',
              display: 'flex',
              position: 'relative',
              zIndex: 0,
            }}
          >
            {createPointColumns(7, 6, true, false)}
          </Box>
          <Box
            id="black-bar"
            sx={{
              ...barAndHomeStyle,
              position: 'relative',
              zIndex: 0,
            }}
            onDrop={(e) => handleDrop(e, -1)}
            onDragOver={handleDragOver}
          >
            {/* Render black pieces on the bar */}
            {gameState.bar.black > 0 && (
              <Stack
                count={gameState.bar.black}
                color="black"
                isTopRow={false}
                pointNumber={-1}
                boardWidth={dimensions.width}
              />
            )}
          </Box>
          <Box
            id="01-06"
            sx={{
              width: '42%',
              height: '100%',
              display: 'flex',
              position: 'relative',
              zIndex: 0,
            }}
          >
            {createPointColumns(1, 6, true, false)}
          </Box>
          <Box
            id="white-home"
            sx={{
              ...barAndHomeStyle,
              position: 'relative',
              zIndex: 0,
            }}
            onDrop={(e) => handleDrop(e, 25)}
            onDragOver={handleDragOver}
          >
            {/* Render white pieces in home */}
            {gameState.home.white > 0 && (
              <Stack
                count={gameState.home.white}
                color="white"
                isTopRow={false}
                pointNumber={25}
                boardWidth={dimensions.width}
              />
            )}
          </Box>
        </Box>

        {/* Overlay for pieces that need to overflow */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            '& > *': {
              pointerEvents: 'auto'
            }
          }}
        >
          {/* Re-render stacks that need to overflow here */}
        </Box>
      </Box>
    </Box>
  )
}

export default Board
