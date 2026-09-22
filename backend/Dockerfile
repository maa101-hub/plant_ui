# PlantVision AI — Backend (FastAPI + PyTorch, CPU)
FROM python:3.11-slim

# System deps for Pillow/torch runtime
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir torch==2.5.1 torchvision==0.20.1 --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r requirements.txt

# App code (model weight folders are mounted/added separately; see README)
COPY . .

EXPOSE 8000

# CORS_ORIGINS can be overridden at runtime (comma-separated, or "*")
ENV CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD curl -fsS http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
