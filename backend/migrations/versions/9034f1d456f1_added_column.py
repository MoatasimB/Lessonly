"""added column

Revision ID: 9034f1d456f1
Revises: dc377b6bcb44
Create Date: 2024-12-10 22:04:38.308294

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9034f1d456f1'
down_revision: Union[str, None] = 'dc377b6bcb44'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
