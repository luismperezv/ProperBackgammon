from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.game import Game
from app.schemas.game import GameCreate, MoveRequest
from typing import Optional


class GameService:
    def __init__(self, db: Session):
        self.db = db

    def create_game(self, game_data: GameCreate, game_id: Optional[str] = None) -> Game:
        """Create a new game with initial state."""
        # Convert GameState to dict before saving
        state_dict = game_data.state.model_dump()
        game = Game(id=game_id, state=state_dict) if game_id else Game(state=state_dict)
        self.db.add(game)
        self.db.commit()
        self.db.refresh(game)
        return game

    def get_game(self, game_id: str) -> Game | None:
        """Get a game by its ID."""
        return self.db.query(Game).filter(Game.id == game_id).first()

    def make_move(self, game_id: str, move: MoveRequest) -> Game | None:
        """Validate and execute a move in the game."""
        game = self.get_game(game_id)
        if not game:
            return None

        # Get current game state
        state = game.state
        points = state.get("points", {})
        bar = state.get("bar", {"white": 0, "black": 0})
        home = state.get("home", {"white": 0, "black": 0})
        
        # Check if it's the player's turn
        if move.color != state["current_turn"]:
            raise HTTPException(status_code=400, detail="Not your turn")
            
        # Check if dice have been rolled
        if not state["dice_state"]["values"]:
            raise HTTPException(status_code=400, detail="Must roll dice before moving")

        # Validate move based on game rules
        if not self._is_valid_move(move, state):
            raise HTTPException(status_code=400, detail="Invalid move")

        # Execute the move
        new_state = self._execute_move(state, move)
        
        # Update used dice values
        dice_values = state["dice_state"]["values"]
        move_distance = abs(move.to_point - move.from_point)
        if move_distance in dice_values and move_distance not in state["dice_state"]["used_values"]:
            state["dice_state"]["used_values"].append(move_distance)
        
        # Check if turn is complete
        if len(state["dice_state"]["used_values"]) == len(dice_values):
            # Reset dice state and switch turns
            new_state["dice_state"]["values"] = None
            new_state["dice_state"]["used_values"] = []
            new_state["current_turn"] = "black" if state["current_turn"] == "white" else "white"
        
        game.state = new_state
        self.db.commit()
        self.db.refresh(game)
        return game

    def _is_valid_move(
        self, move: MoveRequest, state: dict
    ) -> bool:
        """Validate if a move is legal according to backgammon rules."""
        points = state.get("points", {})
        bar = state.get("bar", {"white": 0, "black": 0})
        home = state.get("home", {"white": 0, "black": 0})
        dice_state = state.get("dice_state", {})
        
        from_point = move.from_point
        to_point = move.to_point
        color = move.color
        
        # Validate move distance against dice roll
        move_distance = abs(to_point - from_point)
        dice_values = dice_state.get("values", ())
        used_values = dice_state.get("used_values", [])
        if move_distance not in dice_values or move_distance in used_values:
            return False

        # Basic validation
        if from_point == to_point:
            return False

        # Validate moving from points
        if from_point >= 0 and from_point <= 24:
            source_point = points.get(str(from_point))
            if (
                not source_point
                or source_point.get("count", 0) <= 0
                or source_point.get("color") != color
            ):
                return False

            # If moving to another point
            if to_point >= 0 and to_point <= 24:
                target_point = points.get(str(to_point))
                # Can't move to a point with 2 or more opponent pieces
                if (
                    target_point
                    and target_point.get("count", 0) > 1
                    and target_point.get("color") != color
                ):
                    return False

            # If moving to home
            elif to_point == 25 or to_point == 26:
                # White can only move to white home (25) and black to black home (26)
                if (color == "white" and to_point == 26) or (
                    color == "black" and to_point == 25
                ):
                    return False

        # Validate moving from bar
        elif from_point == -1:
            if bar[color] <= 0:
                return False

            # Can't move from bar to home
            if to_point == 25 or to_point == 26:
                return False

            target_point = points.get(str(to_point))
            if (
                target_point
                and target_point.get("count", 0) > 1
                and target_point.get("color") != color
            ):
                return False

        # Validate moving from home
        elif from_point == 25 or from_point == 26:
            home_count = home["white"] if from_point == 25 else home["black"]
            if home_count <= 0:
                return False

            # Can't move between homes
            if to_point == 25 or to_point == 26:
                return False

            if to_point >= 0 and to_point <= 24:
                target_point = points.get(str(to_point))
                if (
                    target_point
                    and target_point.get("count", 0) > 1
                    and target_point.get("color") != color
                ):
                    return False

        return True

    def _execute_move(self, state: dict, move: MoveRequest) -> dict:
        """Execute a validated move and return the new game state."""
        new_state = state.copy()
        points = new_state.get("points", {}).copy()
        bar = new_state.get("bar", {"white": 0, "black": 0}).copy()
        home = new_state.get("home", {"white": 0, "black": 0}).copy()

        from_point = move.from_point
        to_point = move.to_point
        color = move.color
        opponent_color = "black" if color == "white" else "white"

        # Handle moving from points
        if from_point >= 0 and from_point <= 24:
            source_point = points.get(str(from_point), {"color": color, "count": 0})
            points[str(from_point)] = {
                "color": source_point["color"],
                "count": source_point["count"] - 1,
            }

            if to_point == -1:  # Moving to bar
                bar[color] = bar.get(color, 0) + 1
            elif to_point == 25 or to_point == 26:  # Moving to home
                home_color = "white" if to_point == 25 else "black"
                home[home_color] = home.get(home_color, 0) + 1
            else:  # Moving to another point
                target_point = points.get(str(to_point), {"color": color, "count": 0})
                
                # Check if there's a single opponent piece to capture
                if target_point.get("color") == opponent_color and target_point.get("count") == 1:
                    # Move opponent piece to the bar
                    bar[opponent_color] = bar.get(opponent_color, 0) + 1
                    # Place our piece on the point
                    points[str(to_point)] = {"color": color, "count": 1}
                else:
                    # Normal move - add our piece to existing pieces
                    points[str(to_point)] = {
                        "color": color,
                        "count": target_point["count"] + 1 if target_point["color"] == color else 1,
                    }

        # Handle moving from bar
        elif from_point == -1:
            bar[color] = bar[color] - 1
            target_point = points.get(str(to_point), {"color": color, "count": 0})
            
            # Check if there's a single opponent piece to capture
            if target_point.get("color") == opponent_color and target_point.get("count") == 1:
                # Move opponent piece to the bar
                bar[opponent_color] = bar.get(opponent_color, 0) + 1
                # Place our piece on the point
                points[str(to_point)] = {"color": color, "count": 1}
            else:
                # Normal move - add our piece to existing pieces
                points[str(to_point)] = {"color": color, "count": target_point["count"] + 1 if target_point["color"] == color else 1}

        # Handle moving from home
        elif from_point == 25 or from_point == 26:
            home_color = "white" if from_point == 25 else "black"
            home[home_color] = home[home_color] - 1

            if to_point == -1:  # Moving to bar
                bar[color] = bar.get(color, 0) + 1
            else:  # Moving to a point
                target_point = points.get(str(to_point), {"color": color, "count": 0})
                
                # Check if there's a single opponent piece to capture
                if target_point.get("color") == opponent_color and target_point.get("count") == 1:
                    # Move opponent piece to the bar
                    bar[opponent_color] = bar.get(opponent_color, 0) + 1
                    # Place our piece on the point
                    points[str(to_point)] = {"color": color, "count": 1}
                else:
                    # Normal move - add our piece to existing pieces
                    points[str(to_point)] = {"color": color, "count": target_point["count"] + 1 if target_point["color"] == color else 1}

        # Clean up points with count 0
        points = {k: v for k, v in points.items() if v["count"] > 0}

        new_state["points"] = points
        new_state["bar"] = bar
        new_state["home"] = home
        return new_state

    def update_game_state(self, game_id: str, new_state: dict) -> Game | None:
        """Update the state of an existing game."""
        game = self.get_game(game_id)
        if game:
            game.state = new_state
            self.db.commit()
            self.db.refresh(game)
        return game
