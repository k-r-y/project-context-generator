/** Clean flat card for each wizard step — no glass, just subtle surface */
export default function QuestionCard({ children }) {
  return (
    <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      {children}
    </div>
  )
}
