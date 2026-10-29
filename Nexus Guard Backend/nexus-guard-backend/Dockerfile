# Use an official lightweight Python image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies if your ML packages require them (e.g., build-essential, git-lfs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git-lfs \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first to leverage Docker caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose the port FastAPI runs on
EXPOSE 8000

# Command to run the FastAPI app using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]