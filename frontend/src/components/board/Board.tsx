import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { getValidMoves, ValidMove } from '../../utils/moveValidation'
import ActionBar from './ActionBar'
import { BoardPoint } from './BoardPoint'
import { BarHome } from './BarHome'
import { createNewGameState, copyPoints, removePieceFromPoint, addPieceToPoint, updateDiceState } from '../../utils/gameStateUtils'
import { GameState, PointState } from '../../store/types'

const GOLDEN_RATIO = 1.618033988749895

export const Board = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [validMoves, setValidMoves] = useState<ValidMove[]>([])
  
  // Get game state from store
  const gameState = useGameStore(state => state.gameState) as GameState
  const selectPoint = useGameStore(state => state.selectPoint)
  const updateGameState = useGameStore(state => state.updateGameState)
  const currentGameId = useGameStore(state => state.currentGameId)
  const currentPlayer = useGameStore(state => state.currentPlayer)

  const updateDimensions = () => {
    if (!containerRef.current) return

    const container = containerRef.current
    const maxWidth = container.clientWidth
    const maxHeight = container.clientHeight
    
    let width, height
    
    if (maxWidth / maxHeight > GOLDEN_RATIO) {
      height = maxHeight
      width = height * GOLDEN_RATIO
    } else {
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
    const initGame = async () => {
      if (!currentGameId) {
        await useGameStore.getState().startNewGame();
      }
    };
    initGame();
  }, [currentGameId]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toPoint: number) => {
    e.preventDefault()
    const data = JSON.parse(e.dataTransfer.getData('text/plain'))
    const { color, fromPoint } = data as { color: 'white' | 'black', fromPoint: number }

    const newGameState = createNewGameState(gameState)
    copyPoints(newGameState, gameState)
    removePieceFromPoint(newGameState, fromPoint, color)
    addPieceToPoint(newGameState, toPoint, color)
    updateGameState(newGameState)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handlePointHover = (pointNumber: number) => {
    const point = gameState.points[pointNumber]
    if (point?.color === currentPlayer) {
      const moves = getValidMoves(gameState, pointNumber, currentPlayer)
      setValidMoves(moves)
      setHoveredPoint(pointNumber)
    } else {
      setValidMoves([])
      setHoveredPoint(null)
    }
  }

  const handlePointLeave = () => {
    setValidMoves([])
    setHoveredPoint(null)
  }

  const handlePointClick = (pointNumber: number) => {
    const point = gameState.points[pointNumber]
    if (point?.color === currentPlayer) {
      const moves = getValidMoves(gameState, pointNumber, currentPlayer)
      if (moves.length > 0) {
        const firstMove = moves[0]
        const newGameState = createNewGameState(gameState)
        copyPoints(newGameState, gameState)
        removePieceFromPoint(newGameState, pointNumber, currentPlayer)
        addPieceToPoint(newGameState, firstMove.toPoint, currentPlayer)
        updateDiceState(newGameState, firstMove.usedValues)
        updateGameState(newGameState)
      }
    }
    selectPoint(pointNumber)
  }

  const createPointColumns = (startNum: number, count: number, reverse = false, isTopRow = false) => {
    const points = Array.from({ length: count }, (_, index) => {
      const pointNumber = reverse 
        ? startNum + count - 1 - index 
        : startNum + index
      
      const pointState = gameState.points[pointNumber] || null
      const isValidTarget = validMoves.some(move => move.toPoint === pointNumber)
      const hasValidMoves = pointState?.color === currentPlayer && 
                          getValidMoves(gameState, pointNumber, currentPlayer).length > 0

      return (
        <BoardPoint
          key={pointNumber}
          pointNumber={pointNumber}
          isTopRow={isTopRow}
          pointState={pointState}
          currentPlayer={currentPlayer}
          isValidTarget={isValidTarget}
          hoveredPoint={hoveredPoint}
          boardWidth={dimensions.width}
          hasValidMoves={hasValidMoves}
          onDrop={(e) => handleDrop(e, pointNumber)}
          onDragOver={handleDragOver}
          onClick={() => handlePointClick(pointNumber)}
          onMouseEnter={() => handlePointHover(pointNumber)}
          onMouseLeave={handlePointLeave}
        />
      )
    })
    return points
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
          position: 'absolute',
          width: `${dimensions.width * 1.06}px`,
          height: `${dimensions.height + (dimensions.width * 0.06)}px`,
          backgroundColor: '#8B4513',
          borderRadius: 2,
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
        }}
      />
      <Box
        sx={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          bgcolor: '#DEB887',
          borderRadius: 1,
          boxShadow: 3,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Top row (13-24) */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            zIndex: 0,
          }}
        >
          <Box sx={{ width: '42%', height: '100%', display: 'flex' }}>
            {createPointColumns(13, 6, false, true)}
          </Box>
          <BarHome
            type="bar"
            color="white"
            count={gameState.bar.white}
            isTopRow={true}
            pointNumber={-1}
            boardWidth={dimensions.width}
            onDrop={(e) => handleDrop(e, -1)}
            onDragOver={handleDragOver}
          />
          <Box sx={{ width: '42%', height: '100%', display: 'flex' }}>
            {createPointColumns(19, 6, false, true)}
          </Box>
          <BarHome
            type="home"
            color="black"
            count={gameState.home.black}
            isTopRow={true}
            pointNumber={26}
            boardWidth={dimensions.width}
            onDrop={(e) => handleDrop(e, 26)}
            onDragOver={handleDragOver}
          />
        </Box>

        {/* Action Bar */}
        <Box
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
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            zIndex: 0,
          }}
        >
          <Box sx={{ width: '42%', height: '100%', display: 'flex' }}>
            {createPointColumns(7, 6, true, false)}
          </Box>
          <BarHome
            type="bar"
            color="black"
            count={gameState.bar.black}
            isTopRow={false}
            pointNumber={-1}
            boardWidth={dimensions.width}
            onDrop={(e) => handleDrop(e, -1)}
            onDragOver={handleDragOver}
          />
          <Box sx={{ width: '42%', height: '100%', display: 'flex' }}>
            {createPointColumns(1, 6, true, false)}
          </Box>
          <BarHome
            type="home"
            color="white"
            count={gameState.home.white}
            isTopRow={false}
            pointNumber={25}
            boardWidth={dimensions.width}
            onDrop={(e) => handleDrop(e, 25)}
            onDragOver={handleDragOver}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Board
