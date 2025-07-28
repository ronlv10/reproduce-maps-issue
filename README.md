# Google Maps - Reproduce issue 563

A reproduction repository for the Google Maps clustering issue described in [react-google-maps issue #563](https://github.com/visgl/react-google-maps/issues/563#issuecomment-3128047435).

I patched @googlemaps/markerclusterer to run every bound_changed to increase the likelihood of this issue to occur.

## Issue Description

This repository reproduces a bug where **fast zooming on mobile devices** causes the map to become stuck and unresponsive. The issue occurs when:

- Using advanced markers with clustering
- zoom out fast while keeping the fingers for long after zoom out (mobile only)
- The map gets stuck in an unusable state
- Sometimes requires a full page reload to recover

Example video:   
https://github.com/user-attachments/assets/ac565308-cb4b-41b2-bd8d-a56e7a74d6de


### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and add your Google Maps API key and map ID:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
VITE_GOOGLE_MAPS_MAP_ID=your_map_id_here
```

**Note:** The `.env` file is already in `.gitignore` to keep your API key secure.

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd reproduce-maps
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`
