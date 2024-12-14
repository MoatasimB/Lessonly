"""added unique topic

Revision ID: 5f12a500e7b0
Revises: 82102aa4f0da
Create Date: 2024-12-13 23:40:42.126089

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5f12a500e7b0'
down_revision: Union[str, None] = '82102aa4f0da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("lessonplans", schema=None) as batch_op:
        batch_op.create_unique_constraint("uix_teacher_topic", ["teacher_id", "topic"])


def downgrade() -> None:
    with op.batch_alter_table("lessonplans", schema=None) as batch_op:
        batch_op.drop_constraint("uix_teacher_topic", type_="unique")