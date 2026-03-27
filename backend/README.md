AMR-Predict Implementation Plan
This application provides a clinical decision support tool for predicting antibiotic resistance.

Architecture
Frontend: React, Vite, Tailwind CSS, Recharts, Lucide Icons. Structure standard components similar to shadcn/ui.
Backend: FastAPI (Python), Uvicorn. Mock machine learning logic built into API routes.
Proposed Changes
Backend Setup
[NEW] backend/requirements.txt
Dependencies: fastapi, uvicorn, pydantic.

[NEW] backend/main.py
FastAPI application with:

CORS middleware
POST /api/predict: Takes input fields and returns mocked Susceptibility Status, Predicted Resistant Agents, Recommended Susceptible Agents.
GET /api/analytics: Returns mocked Feature Importance data and Resistance Network graph edges/nodes.
Frontend Setup
[NEW] frontend/package.json
Generate via Vite. Dependencies: react, react-dom, tailwindcss, lucide-react, recharts, axios.

[NEW] frontend/tailwind.config.js
Configure Tailwind for modern soft-glassmorphism, using shades of slate gray, vivid azure blue, emerald green, and soft crimson.

[NEW] frontend/index.css
Include base Tailwind directives and theme variables.

Frontend Components
[MODIFY] frontend/src/App.tsx
Main application containing standard state management for a multi-step flow:

step state: 'landing' | 'input' | 'results'
AnimatePresence for smooth cross-fading and sliding between steps.
Landing Step: Hero header, aesthetic animated cards demonstrating use cases that lift/glow on hover.
Input Step: Centered, beautiful form entering parameters with staggered entrance animations.
Results Step: Split into Prediction summary and Visualizations displaying Recharts and Network seamlessly.
Dependencies
Addition of framer-motion for complex page transitions, staggered lists, and hover effects.
Verification Plan
Automated Tests
Run uvicorn and test backend endpoints manually using curl or browser.
Run npm run dev and ensure frontend renders correctly without console errors.
Manual Verification
Test input variations to ensure conditional outputs match the expected mock logic.
Ensure Recharts render correctly and dynamically update.
Ensure layouts are responsive across mobile and desktop breakpoints.
