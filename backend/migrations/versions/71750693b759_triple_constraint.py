"""triple constraint

Revision ID: 71750693b759
Revises: 5f12a500e7b0
Create Date: 2024-12-14 00:06:51.077035

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '71750693b759'
down_revision: Union[str, None] = '5f12a500e7b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    with op.batch_alter_table("lessonplans") as batch_op:
        # Drop the old unique constraint
        batch_op.drop_constraint("uix_teacher_topic", type_="unique")

        # Create the new unique constraint
        batch_op.create_unique_constraint("uix_teacher_topic_date", ["teacher_id", "topic", "datekey"])


def downgrade() -> None:
    with op.batch_alter_table("lessonplans") as batch_op:
        # Drop the new unique constraint
        batch_op.drop_constraint("uix_teacher_topic_date", type_="unique")

        # Recreate the old unique constraint
        batch_op.create_unique_constraint("uix_teacher_topic", ["teacher_id", "topic"])
