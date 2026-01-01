# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

- Initial release of Synapse
- Infinite canvas with pan and zoom capabilities
- Drag-and-drop node creation from icon library
- 60+ categorized icons for infrastructure components
- Custom node component with glassmorphism styling
- Node properties: label, icon, status, description, metadata
- Resizable nodes with visual handles
- Delete button on selected nodes
- Bidirectional connection handles on all sides
- Custom edge component with color support
- 9 edge color options
- Animated flow option for edges
- Edge labels
- Property panel for node and edge editing
- Icon picker with category filtering
- Status indicators with glow animation
- Zustand state management with Zundo undo/redo
- Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S, Ctrl+O, Delete)
- Auto-save to IndexedDB
- Export/Import of .syn files
- Empty state hints
- Zoom indicator
- Minimap navigation
- Grid snapping
- React Flow controls
- Dark theme with glassmorphism design
- TailwindCSS v4 styling system
- TypeScript strict mode
- Responsive layout

### Technical

- React 18 with TypeScript
- Vite build system
- @xyflow/react v12 for canvas
- Zustand with Zundo middleware
- idb-keyval for IndexedDB
- Lucide React icons
- TailwindCSS v4 with CSS-first approach
