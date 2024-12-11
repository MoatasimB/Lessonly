"""Update User table

Revision ID: dc377b6bcb44
Revises: 385e671b1918
Create Date: 2024-12-10 22:02:52.162004

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dc377b6bcb44'
down_revision: Union[str, None] = '385e671b1918'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
