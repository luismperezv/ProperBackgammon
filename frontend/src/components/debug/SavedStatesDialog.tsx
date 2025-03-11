import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getSavedStates, deleteSavedState } from '../../utils/debugStorage';
import { GameState } from '../../store/types';

interface SavedStatesDialogProps {
  open: boolean;
  onClose: () => void;
  onLoadState: (state: GameState) => void;
}

export const SavedStatesDialog = ({ open, onClose, onLoadState }: SavedStatesDialogProps) => {
  const [savedStates, setSavedStates] = useState<Array<{ timestamp: string; title: string; state: GameState }>>([]);

  useEffect(() => {
    if (open) {
      setSavedStates(getSavedStates());
    }
  }, [open]);

  const handleDelete = (timestamp: string) => {
    deleteSavedState(timestamp);
    setSavedStates(getSavedStates());
  };

  const handleLoad = (state: GameState) => {
    onLoadState(state);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Saved Debug States</DialogTitle>
      <DialogContent>
        {savedStates.length === 0 ? (
          <Box p={2} textAlign="center">
            No saved states found
          </Box>
        ) : (
          <List>
            {savedStates.map(({ timestamp, title, state }) => (
              <ListItem key={timestamp}>
                <ListItemText 
                  primary={title}
                />
                <ListItemSecondaryAction>
                  <Button
                    size="small"
                    onClick={() => handleLoad(state)}
                    sx={{ mr: 1 }}
                  >
                    Load
                  </Button>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(timestamp)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SavedStatesDialog; 