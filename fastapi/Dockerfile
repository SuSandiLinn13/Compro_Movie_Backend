# Use official Python 3 Alpine image
FROM python:3.12-alpine

# Set working directory
WORKDIR /app

# Install build dependencies (needed for some Python packages)
RUN apk add --no-cache gcc musl-dev libffi-dev

# Copy requirements first
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose FastAPI default port
EXPOSE 8000

# Run FastAPI with reload (for development)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8008", "--reload"]
