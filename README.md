# Setae

A lizard management sim. Get lizards, train their stickiness, and send them to compete in weight-clinging competitions.

Built with Electron, React, TypeScript, and Zustand.

## Getting Started

```bash
npm install
npm run dev
```

## Building

```bash
npm run build:win    # Windows installer (NSIS)
npm run build:mac    # macOS build
npm run build:linux  # Linux build
```

## How to Play

1. **Get a lizard** and give it a name
2. **Train** your lizard each week to increase its stickiness
3. **Enter competitions** — your lizard clings to increasing weights round by round
4. **Score points** based on how many rounds your lizard survives, multiplied by difficulty
5. Repeat — train harder, compete at higher difficulties

## Tech Stack

- **Electron** — cross-platform desktop app
- **React 19** — UI framework
- **TypeScript** — type safety throughout
- **Zustand** — state management (slices pattern)
- **Tailwind CSS v4** — styling
- **shadcn/ui** — UI components

## License

[CC0 1.0 Universal](LICENSE.md)
