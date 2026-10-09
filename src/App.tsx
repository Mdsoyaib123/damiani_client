import Layout from './Layout/Layout'
import { useEffect } from 'react'
import { connectSocket } from './utils/socket'

function App() {

  // Auto-reconnect socket on page refresh if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      connectSocket(token);
    }
  }, [])

  return (
    <>
      <Layout></Layout>
    </>
  )
}

export default App
