import { useState } from 'react';
import { VideoRoom } from './components/VideoRoom';
import './App.css'

function App() {
  const [joined, setJoined] = useState(false);

  return (
    <div className='App'>
      <h1>Omegle Video Call</h1>

      {!joined && (
      <button onClick={()=> setJoined(true)}>Join Me</button>
      )}

      {joined && (
        <VideoRoom />
      )}
    </div>
  )
}

export default App
