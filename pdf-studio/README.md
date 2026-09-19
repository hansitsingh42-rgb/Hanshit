# PDF Studio

A browser-first PDF creation and editing workspace inside the Hanshit portfolio. It is designed as a local-first editor: documents are processed in the browser, with no application backend required for the core editing workflow.

## Current capabilities

### Document editing
- Multi-page document editing
- Rich text formatting, headings, lists and basic layout
- Tables, dividers and links
- Image insertion and client-side image optimization
- Zoom, undo/redo and keyboard shortcuts
- Search and replace across document pages

### Page management
- Add, duplicate, delete and reorder pages
- Multi-select with Shift/Ctrl/Cmd
- Drag-and-drop group reordering
- Real PDF page thumbnails
- Page rotation and per-page crop
- Visual crop editing
- Custom page size, orientation, units and margins

### PDF operations
- Import existing PDFs
- Export edited PDFs
- Export selected pages
- Merge PDFs
- Split PDFs with page ranges
- PDF compression by lossless rebuild or image flattening
- Watermarks, headers, footers and page numbers
- PDF metadata editing

### Templates and projects
- Assignment, report, lab report, study notes, resume and cover templates
- Save/load project files
- Imported PDF bytes can be persisted inside project files
- Dark/light-ready responsive interface
- Mobile page-panel navigation

## Security and reliability

- Imported project HTML is sanitized before restoration.
- Browser-side CSP and strict referrer policy are included.
- PDF.js and pdf-lib versions are pinned to known CDN versions.
- HTTP(S)-only link validation is used for inserted links.
- Core PDF processing remains client-side.

## Known limitations

- Existing PDF pages are currently treated primarily as page-level objects. Full object-level editing of arbitrary imported PDF text/vector objects is not implemented.
- Rich HTML layouts are not guaranteed to reproduce pixel-perfectly in exported PDFs.
- Lossless rebuild mode is not guaranteed to produce a smaller file.
- Flatten compression converts pages to images, so selectable text and vector structure are lost in that mode.
- Core browser runtime QA still needs to be performed in an actual browser environment before production claims are made.
- External CDN dependencies are pinned but not vendored.

## Roadmap

1. Browser runtime and regression QA
2. Improve imported-PDF fidelity and rich-layout export
3. Replace remaining prompt-style workflows with dedicated UI
4. Vendor external PDF dependencies for a more controlled deployment
5. Evaluate deeper object-level PDF editing
6. Final accessibility, security and performance audit

No existing Hanshit projects are removed or replaced.
