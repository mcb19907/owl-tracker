function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0e1a',
        color: '#e8ecf6',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        gap: 12,
      }}
    >
      <div style={{ fontSize: 48, color: '#c9a96e' }}>🦉</div>
      <div style={{ fontSize: 22 }}>Nocturnal</div>
      <div style={{ fontSize: 12, color: 'rgba(232,236,246,0.55)' }}>
        Hello world. Build pipeline OK.
      </div>
    </div>
  )
}

export default App
