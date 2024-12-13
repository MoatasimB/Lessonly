"""updated models

Revision ID: 6916864bf2ba
Revises: fa4761d414da
Create Date: 2024-12-12 20:22:08.038437

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6916864bf2ba'
down_revision: Union[str, None] = 'fa4761d414da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
