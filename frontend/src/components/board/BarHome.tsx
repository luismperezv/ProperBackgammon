import { Box } from '@mui/material';
import { PlayerColor } from '../../store/types';
import Stack from './Stack';

interface BarHomeProps {
  type: 'bar' | 'home';
  color: PlayerColor;
  count: number;
  isTopRow: boolean;
  pointNumber: number;
  boardWidth: number;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

const barAndHomeStyle = {
  width: '8%',
  height: '100%',
  bgcolor: '#D4A76A', // Lighter wood color for bar and homes
  position: 'relative' as const,
  zIndex: 0,
};

export const BarHome = ({
  type,
  color,
  count,
  isTopRow,
  pointNumber,
  boardWidth,
  onDrop,
  onDragOver
}: BarHomeProps) => {
  return (
    <Box
      id={`${color}-${type}`}
      sx={barAndHomeStyle}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {count > 0 && (
        <Stack
          count={count}
          color={color}
          isTopRow={isTopRow}
          pointNumber={pointNumber}
          boardWidth={boardWidth}
        />
      )}
    </Box>
  );
}; 