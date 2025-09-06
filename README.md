# Canvas App - Real-time Collaboration Board

A lightweight collaborative board where multiple users can add sticky notes and drawings in real time, no login required.

## Features

- 🎯 **Real-time Collaboration**: See changes instantly across all connected users
- 📝 **Sticky Notes**: Add, edit, move, and delete sticky notes with drag-and-drop
- 🎨 **Drawing Canvas**: Freehand drawing with multiple colors
- 🎨 **Color Customization**: Choose from multiple colors for both notes and drawings
- 🚀 **No Login Required**: Just share the board URL to collaborate
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast & Lightweight**: Built with Next.js and optimized for performance

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, ShadCN UI
- **Backend**: Convex (real-time database)
- **Drawing**: Konva.js with React Konva
- **Drag & Drop**: @dnd-kit
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd canvas-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Create a Board**: Click "Create New Board" to generate a new collaborative board
2. **Join a Board**: Enter a board ID to join an existing board
3. **Add Sticky Notes**: Click "Add Note" to create a new sticky note
4. **Edit Notes**: Click on any note to edit its text
5. **Move Notes**: Drag and drop notes to reposition them
6. **Change Colors**: Use the color picker to change note colors
7. **Draw**: Toggle drawing mode to draw on the canvas
8. **Share**: Share the board URL with others to collaborate in real-time

## Board Management

- Boards are automatically created when accessed
- Boards expire after 24 hours of inactivity (automatically cleaned up)
- No user accounts or authentication required
- All data is stored in Convex real-time database

## Development

### Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── board/[id]/        # Dynamic board pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with Convex provider
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   ├── BoardCanvas.tsx   # Main canvas component
│   ├── StickyNote.tsx    # Sticky note component
│   ├── Toolbar.tsx       # Top toolbar
│   └── DrawingCanvas.tsx # Drawing canvas
└── lib/                  # Utility functions
convex/                   # Convex backend
├── schema.ts            # Database schema
├── boards.ts            # Board operations
└── crons.ts             # Scheduled tasks
```

### Key Features Implementation

- **Real-time Sync**: Uses Convex queries and mutations for instant updates
- **Drag & Drop**: Implemented with @dnd-kit for smooth note movement
- **Drawing**: Konva.js canvas with stroke-based drawing system
- **Optimistic UI**: Changes appear instantly, sync in background
- **Auto-cleanup**: Cron job removes inactive boards after 24 hours

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings
4. Set up Convex production deployment
5. Update environment variables

### Environment Variables

- `NEXT_PUBLIC_CONVEX_URL`: Your Convex deployment URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Real-time database by [Convex](https://convex.dev/)
- UI components by [ShadCN](https://ui.shadcn.com/)
- Drawing powered by [Konva.js](https://konvajs.org/)