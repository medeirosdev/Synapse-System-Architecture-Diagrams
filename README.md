# Synapse

A modern, local-first React application for creating interactive system architecture diagrams. Built with a Sci-Fi/Glassmorphism aesthetic, Synapse provides an intuitive drag-and-drop interface for designing and visualizing complex system architectures.

## Features

- **Infinite Canvas**: Pan and zoom freely across an unlimited workspace
- **Drag-and-Drop Components**: 60+ categorized icons for common infrastructure components
- **Customizable Nodes**: Each node supports labels, descriptions, status indicators, and metadata
- **Flexible Connections**: Connect nodes from any direction with customizable edge colors
- **Real-time Editing**: Instant property editing through the side panel
- **Undo/Redo**: Full history management with keyboard shortcuts
- **Auto-save**: Automatic persistence to IndexedDB
- **Import/Export**: Save and load diagrams as `.syn` files
- **Dark Theme**: Sleek glassmorphism design with neon accents

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Flow** (@xyflow/react) for the canvas and node management
- **Zustand** for state management with Zundo for undo/redo
- **TailwindCSS v4** for styling
- **Lucide React** for icons
- **idb-keyval** for IndexedDB persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/synapse.git
cd synapse

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be output to the `dist` directory.

## Usage

### Creating Nodes

1. Browse the component library in the left sidebar
2. Drag any icon onto the canvas to create a node
3. Click on a node to select it and edit its properties in the right panel

### Connecting Nodes

1. Hover over a node to see connection handles (circles on each side)
2. Drag from one handle to another to create a connection
3. Click on a connection to edit its color and animation settings

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` or `Ctrl+Shift+Z` | Redo |
| `Ctrl+S` | Export to file |
| `Ctrl+O` | Import from file |
| `Delete` or `Backspace` | Delete selected node/edge |

### Node Properties

- **Label**: Display name for the node
- **Icon**: Visual representation from the icon library
- **Status**: Active, Warning, Error, or Idle (with visual indicators)
- **Description**: Additional notes or documentation
- **Metadata**: Key-value pairs for custom data

### Edge Properties

- **Color**: 9 color options (Cyan, Purple, Blue, Green, Yellow, Orange, Red, Pink, White)
- **Animated**: Toggle flow animation on/off
- **Label**: Optional text label for the connection

## Project Structure

```
src/
├── components/
│   ├── edges/
│   │   └── CustomEdge.tsx      # Custom edge component with colors
│   ├── nodes/
│   │   └── ServiceNode.tsx     # Main node component
│   ├── AssetsSidebar.tsx       # Left sidebar with icon library
│   ├── Canvas.tsx              # Main React Flow canvas
│   ├── PropertyPanel.tsx       # Right sidebar for editing
│   └── Toolbar.tsx             # Top toolbar with actions
├── config/
│   └── icons.ts                # Icon definitions and categories
├── hooks/
│   └── useAutoSave.ts          # Auto-save hook
├── lib/
│   ├── persistence.ts          # IndexedDB and file operations
│   └── utils.ts                # Utility functions
├── store/
│   └── useSynapseStore.ts      # Zustand store with Zundo
├── types.ts                    # TypeScript type definitions
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles and theme
```

## Data Persistence

Synapse uses a dual persistence strategy:

1. **IndexedDB**: Automatic background saving every second
2. **File Export**: Manual save/load of `.syn` files (JSON format)

The `.syn` file format includes:
- All nodes with positions, data, and styles
- All edges with connections and properties
- Current viewport state
- Version number and timestamp

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React Flow](https://reactflow.dev/) for the excellent canvas library
- [Lucide](https://lucide.dev/) for the beautiful icon set
- [Zustand](https://zustand-demo.pmnd.rs/) for simple state management
