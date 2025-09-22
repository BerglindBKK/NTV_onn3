import { useState } from 'react'
import smile from '/smile.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
          <img src={smile} className="logo" alt="smiley face" />
      </div>
      <h1>Hello world</h1>
      
    </>
  )
}

export default App
