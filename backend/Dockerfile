FROM python:3.9-slim
LABEL authors="bauyrzhanzhonkebayev"

ENV PYTHONUNBUFFERED=1
WORKDIR app/

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "-c", "gunicorn.conf.py", "back.wsgi:application"]
