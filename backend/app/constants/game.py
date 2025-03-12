"""Game-related constants."""

# Initial position of checkers in backgammon
INITIAL_POSITION = {
    "points": {
        1: {"count": 2, "color": "black"},
        6: {"count": 5, "color": "white"},
        8: {"count": 3, "color": "white"},
        12: {"count": 5, "color": "black"},
        13: {"count": 5, "color": "white"},
        17: {"count": 3, "color": "black"},
        19: {"count": 5, "color": "black"},
        24: {"count": 2, "color": "white"},
    },
    "bar": {"white": 0, "black": 0},
    "home": {"white": 0, "black": 0},
}
