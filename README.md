# Library Server

Library Server is a server application that integrates with Telegram API and Supabase for database operations.

## Docker Setup

### Development Mode

To run the application in development mode with live-reloading:

- **Build the Docker image:**

  ```bash
  docker build -t library-server-dev:latest .
  ```

- **Run the Docker container for development:**

  ```bash
  docker run --env-file .env -v "$(pwd)":/usr/src/app -d library-server-dev:latest bun --watch src/index.ts
  ```

- **Stop the Docker container for development:**

  ```bash
  docker ps  # Get the Container ID of the running container
  docker stop <container_id>
  ```

  Replace `<container_id>` with the actual Container ID retrieved from `docker ps`.

### Production Mode

To run the application in production mode:

- **Build the Docker image:**

  ```bash
  docker build -t library-server:latest .
  ```

- **Run the Docker container for production:**

  ```bash
  docker run --env-file .env -d library-server:latest
  ```

- **Stop the Docker container for production:**

  ```bash
  docker ps  # Get the Container ID of the running container
  docker stop <container_id>
  ```

  Replace `<container_id>` with the actual Container ID retrieved from `docker ps`.

## Environment Variables

Ensure you have the following environment variables set in a `.env` file in the root of your project:

```.env
BOT_TOKEN=your_telegram_api_key
SUPABASE_PROJECT_URL=your_supabase_url
SUPABASE_PUBLIC_ANON_KEY=your_supabase_anon_key
```

Replace `your_telegram_api_key`, `your_supabase_url`, and `your_supabase_anon_key` with your actual API keys and URL
