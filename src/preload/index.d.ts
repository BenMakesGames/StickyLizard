declare global {
  interface Window {
    api: {
      saveGame: (json: string) => Promise<boolean>
      loadGame: () => Promise<string | null>
    }
  }
}

export {}
