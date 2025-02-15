# Next.js Project with Docker

## Getting Started

### Prerequisites
- Node.js 20+
- NPM package manager
- Docker (if running via Docker)

### Installation & Running Locally
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

### Running in Production
1. Build the application:
   ```sh
   npm run build
   ```
2. Start the production server:
   ```sh
   npm start
   ```

## Running with Docker

### Building the Docker Image
```sh
docker build -t nextjs-app .
```

### Running the Container
```sh
docker run -p 3000:3000 nextjs-app
```

The application will be accessible at `http://localhost:3000`.

## Folder Structure
```
/project-root
│── /src
│   │── /app
│   │── /assets
│   │── /components
│   │── /feature
│   │── /hooks
│   │── /lib
│   │── /redux
│   │── /test
│   │── /types
│   │── /utils
│── /public
│── package.json
│── package-lock.json
│── Dockerfile
│── README.md
│── eslint.config.mjs
│── next-env.d.ts
│── next.config.ts
│── node_modules
│── postcss.config.mjs
│── tailwind.config.ts
│── tsconfig.json
``` 

## Environment Variables
Create a `.env` file and add necessary environment variables:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/
```

## License
This project is licensed under the MIT License.

