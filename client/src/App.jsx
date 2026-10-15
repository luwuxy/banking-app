import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [array, setArray] = useState([]);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.blogPost);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      <h1>Backend with Express & Node</h1>
      <ul>
        {
          array.map((blog, index) => (
            <li key={index}>
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
            </li>
          ))
        }
      </ul>
    </>
  )
}

export default App
