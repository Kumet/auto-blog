FROM python:3.9-slim

WORKDIR /app

COPY ./pyproject.toml .
COPY ./poetry.lock .

RUN pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-dev

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
