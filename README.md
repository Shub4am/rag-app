# RAG App

A Next.js-based Retrieval-Augmented Generation (RAG) application that allows users to upload, index, and chat with their documents (CSV, PDF, and URLs). The app provides a chat interface for querying indexed data and supports document management features.

## Features

- Upload and index documents (CSV, PDF, URLs)
- Chat interface for querying indexed data
- Document management panel
- Sidebar for navigation
- Modern UI built with Next.js and TypeScript
- API endpoints for chat and document operations

## Project Structure

```
├── app/
│   ├── api/                # API routes for chat, collections, and document ingestion
│   ├── components/         # React components (ChatInterface, DocumentPanel, etc.)
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # App layout
│   └── page.tsx            # Main page
├── lib/                    # Utility functions
├── public/                 # Static assets
├── types/                  # TypeScript types
├── uploads/                # Uploaded files
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
├── docker-compose.yml      # Docker setup (if used)
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
	```sh
	git clone <repo-url>
	cd rag-app
	```
2. Install dependencies:
	```sh
	npm install
	# or
	yarn install
	```
3. Start the development server:
	```sh
	npm run dev
	# or
	yarn dev
	```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker (Optional)
If you want to run the app with Docker:
```sh
docker-compose up --build
```

## Usage
- Upload documents via the interface.
- Use the chat to ask questions about your documents.
- Manage your documents in the document panel.

## Scripts
- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run start` — Start the production server
- `npm run lint` — Lint the codebase

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
