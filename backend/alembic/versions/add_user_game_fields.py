"""add user game fields

Revision ID: add_user_game_fields
Revises: 
Create Date: 2024-03-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_user_game_fields'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create PieceColor enum type
    op.execute("CREATE TYPE piece_color AS ENUM ('white', 'black')")
    
    # Add columns to users table
    op.add_column('users', sa.Column('current_game_id', sa.String(), nullable=True))
    op.add_column('users', sa.Column('piece_color', sa.Enum('white', 'black', name='piece_color'), nullable=True))
    
    # Add foreign key constraint
    op.create_foreign_key(
        'fk_users_current_game',
        'users', 'games',
        ['current_game_id'], ['id']
    )


def downgrade() -> None:
    # Remove foreign key constraint
    op.drop_constraint('fk_users_current_game', 'users', type_='foreignkey')
    
    # Remove columns
    op.drop_column('users', 'piece_color')
    op.drop_column('users', 'current_game_id')
    
    # Drop enum type
    op.execute("DROP TYPE piece_color") 