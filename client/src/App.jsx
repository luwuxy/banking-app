import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
import AdminDashboard from './AdminDashboard.jsx'

function App() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await axios.get("https://scaling-system-rwvg9vjrp54f465-8080.app.github.dev/testdata");
    setData(response.data);
  }

  useEffect(() => {
    fetchData();
  }, [])

  if (data) console.log(data);

  return (
    <>
      <AdminDashboard />
    </>
  )
}

export default App
