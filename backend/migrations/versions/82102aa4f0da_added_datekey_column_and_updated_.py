"""added datekey column and updated nullable for grade

Revision ID: 82102aa4f0da
Revises: a85959325a38
Create Date: 2024-12-13 22:25:15.207152

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '82102aa4f0da'
down_revision: Union[str, None] = 'a85959325a38'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:

    # Workaround for altering 'grade' column to nullable
    if op.get_bind().dialect.name == "sqlite":
        # SQLite does not support ALTER COLUMN; recreate the table
        with op.batch_alter_table("lessonplans") as batch_op:
            batch_op.alter_column('grade', existing_type=sa.String(), nullable=True)
    else:
        # For databases that support ALTER COLUMN
        op.alter_column('lessonplans', 'grade', existing_type=sa.String(), nullable=True)

    # Remove 'month', 'year', and 'day' columns
    op.drop_column('lessonplans', 'month')
    op.drop_column('lessonplans', 'year')
    op.drop_column('lessonplans', 'day')


def downgrade() -> None:
    # Revert the 'datekey' addition
    op.drop_column('lessonplans', 'datekey')

    # Revert the 'grade' column to NOT NULL
    if op.get_bind().dialect.name == "sqlite":
        # SQLite does not support ALTER COLUMN; recreate the table
        with op.batch_alter_table("lessonplans") as batch_op:
            batch_op.alter_column('grade', existing_type=sa.String(), nullable=False)
    else:
        # For databases that support ALTER COLUMN
        op.alter_column('lessonplans', 'grade', existing_type=sa.String(), nullable=False)

    # Re-add the 'month', 'year', and 'day' columns
    op.add_column('lessonplans', sa.Column('month', sa.Integer(), nullable=False))
    op.add_column('lessonplans', sa.Column('year', sa.Integer(), nullable=False))
    op.add_column('lessonplans', sa.Column('day', sa.Integer(), nullable=False))

