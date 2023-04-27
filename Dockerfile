FROM python:3.9-slim

WORKDIR /auto-blog/app

COPY ./pyproject.toml ./poetry.lock ./
COPY ./.flake8 ./

RUN pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-dev


EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
