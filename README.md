# MOSA-Fall-Hackathon-2024

**Lessonly**

## Overview
### Project Summary
Lessonly is a virtual lesson planner for teachers. It features a calendar-based interface where educators can add daily notes, integrate AI-generated lesson plans, and track existing lessons for multiple grade levels. This tool is meant to help teachers save time and centralize teaching resources into one 

## Usage

## Prerequisites
Ensure you have the following installed:

### Node.js
Install the latest version of Node.js (recommended >= 16):
```bash
# On Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# On macOS (using Homebrew)
brew install node
```

### Python 3.x and pip

Install Python and pip (Python package manager):
```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# On macOS (using Homebrew)
brew install python
```


## Installation

### Clone the repository

```bash
git clone https://github.com/FarisKarim/teachingassistant.git
cd teachingassistant
```

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```
Populate environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate 
```
Install dependencies once you activate the venv:

```bash
pip install -r requirements.txt
```

Run the application:

```bash
uvicorn main:app --reload
```

To stop the server:

```bash
CTRL + C
```

To deactivate the venv run:

```bash
deactivate
```

## Client Setup

Navigate to the frontend directory:

```bash
cd frontend
cd clientui
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

> Note: Only need to do `npm install` the first time to install dependencies.

## Deployment

### Run locally

```bash
# Start the backend
uvicorn main:app --reload

# In another terminal, start the frontend
npm run dev
```

Once both are running, open your browser and go to http://localhost:5173

## Additional Information

### Tools Used
- **Vite & Tailwind CSS** – Frontend UI and styling.
- **Node.js** – For managing frontend dependencies and builds.
- **Python & FastAPI** – Backend for user authentication, note retrieval, and AI integration.
- **OpenAI API** – AI model to generate lesson plans based on teacher-supplied topics/grades.

### Resources Used
- **FastAPI Docs**
- **Tailwind CSS Docs** 
- **React, Vite Docs**
- **Stack Overflow**
