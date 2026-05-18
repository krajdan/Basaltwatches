# BASALT - Fullstack Watch Configurator MVP

En modern, minimalistisk e-handels- och konfigurationssida för det konceptuella klockmärket BASALT. Projektet är byggt för att demonstrera modern frontend-arkitektur och sömlös molnintegration.

## ⚡ Funktioner
- **Live Data Streaming:** Beskrivningar och priser hämtas i realtid från Supabase (PostgreSQL).
- **Dynamisk Lagerhantering:** Systemet känner av varukorgens innehåll och låser köpknappen 자동으로 ("Out of Stock") när maxgränsen (3 st) har nåtts.
- **Micro-interactions:** Varukorgen öppnas direkt vid köp och har en "auto-dismiss"-funktion via React `useRef` och `setTimeout` som stänger panelen efter 3 sekunder.
- **Layout Stability:** Säkrad mot Layout Shifts (CLS) genom låsta komponenthöjder vid modellbyten.

## 🛠 Tech Stack
- React (Vite)
- Tailwind CSS
- Supabase (Backend-as-a-Service)