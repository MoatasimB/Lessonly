"""added topic and grade columns

Revision ID: adccea42d7b6
Revises: 6916864bf2ba
Create Date: 2024-12-12 20:43:41.801345

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'adccea42d7b6'
down_revision: Union[str, None] = '6916864bf2ba'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
