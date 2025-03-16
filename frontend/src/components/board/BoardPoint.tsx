import { Box } from '@mui/material';
import { PointState, PlayerColor } from '../../store/types';
import Stack from './Stack';
import { PhantomPiece } from './PhantomPiece';
import { ValidMove } from '../../utils/moveValidation';

interface BoardPointProps {
  pointNumber: number;
  isTopRow: boolean;
  pointState: PointState | null;
  currentPlayer: PlayerColor;
  isValidTarget: boolean;
  hoveredPoint: number | null;
  boardWidth: number;
  hasValidMoves: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const BoardPoint = ({
  pointNumber,
  isTopRow,
  pointState,
  currentPlayer,
  isValidTarget,
  hoveredPoint,
  boardWidth,
  hasValidMoves,
  onDrop,
  onDragOver,
  onClick,
  onMouseEnter,
  onMouseLeave
}: BoardPointProps) => {
  const isEven = pointNumber % 2 === 0;
  const triangleColor = isEven ? '#F4E4C1' : '#B98B50';

  return (
    <Box
      id={`point-${pointNumber}`}
      data-point={pointNumber}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
      {pointState && (
        <Stack
          count={pointState.count}
          color={pointState.color}
          isTopRow={isTopRow}
          pointNumber={pointNumber}
          boardWidth={boardWidth}
          hasValidMoves={pointState.color === currentPlayer && hasValidMoves}
        />
      )}
      {isValidTarget && hoveredPoint !== null && (
        <PhantomPiece
          color={currentPlayer}
          isTopRow={isTopRow}
          pointNumber={pointNumber}
          boardWidth={boardWidth}
        />
      )}
    </Box>
  );
}; 