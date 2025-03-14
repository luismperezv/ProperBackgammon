"""add local games

Revision ID: add_local_games
Revises: ea83c7875760
Create Date: 2024-03-14 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_local_games'
down_revision: Union[str, None] = 'ea83c7875760'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create a new table with the new schema
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_local', sa.Boolean(), nullable=False, server_default='false'))
        batch_op.add_column(sa.Column('creator_id', sa.String(), nullable=True))
        batch_op.create_foreign_key('fk_games_creator_id_users', 'users', ['creator_id'], ['id'])


def downgrade() -> None:
    # Remove the new columns
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.drop_constraint('fk_games_creator_id_users', type_='foreignkey')
        batch_op.drop_column('creator_id')
        batch_op.drop_column('is_local') 