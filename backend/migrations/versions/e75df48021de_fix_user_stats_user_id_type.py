"""fix_user_stats_user_id_type

Revision ID: e75df48021de
Revises: add_local_games
Create Date: 2025-03-13 22:25:00.795750

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e75df48021de'
down_revision: Union[str, None] = 'add_local_games'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # SQLite doesn't support altering columns directly, so we need to recreate the table
    # Create new table
    op.create_table('user_stats_new',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('games_played', sa.Integer(), nullable=True),
        sa.Column('games_won', sa.Integer(), nullable=True),
        sa.Column('games_lost', sa.Integer(), nullable=True),
        sa.Column('elo_rating', sa.Float(), nullable=True),
        sa.Column('win_streak', sa.Integer(), nullable=True),
        sa.Column('join_date', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_user_stats_new_id', 'user_stats_new', ['id'], unique=False)

    # Copy data from old table to new table
    op.execute('INSERT INTO user_stats_new (id, user_id, games_played, games_won, games_lost, elo_rating, win_streak, join_date) '
               'SELECT id, CAST(user_id AS TEXT), games_played, games_won, games_lost, elo_rating, win_streak, join_date FROM user_stats')

    # Drop old table and rename new table
    op.drop_table('user_stats')
    op.rename_table('user_stats_new', 'user_stats')


def downgrade() -> None:
    # Create new table with integer user_id
    op.create_table('user_stats_new',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('games_played', sa.Integer(), nullable=True),
        sa.Column('games_won', sa.Integer(), nullable=True),
        sa.Column('games_lost', sa.Integer(), nullable=True),
        sa.Column('elo_rating', sa.Float(), nullable=True),
        sa.Column('win_streak', sa.Integer(), nullable=True),
        sa.Column('join_date', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_user_stats_new_id', 'user_stats_new', ['id'], unique=False)

    # Copy data from old table to new table
    op.execute('INSERT INTO user_stats_new (id, user_id, games_played, games_won, games_lost, elo_rating, win_streak, join_date) '
               'SELECT id, CAST(user_id AS INTEGER), games_played, games_won, games_lost, elo_rating, win_streak, join_date FROM user_stats')

    # Drop old table and rename new table
    op.drop_table('user_stats')
    op.rename_table('user_stats_new', 'user_stats')
