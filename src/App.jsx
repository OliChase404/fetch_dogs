import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from "react";

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


import Login from './pages/Login';
import DogSearch from './pages/DogSearch';

const baseUrl = 'https://frontend-take-home-service.fetch.com';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch(baseUrl + '/dogs/breeds').then((response) => {
      if (response.ok) {
        setIsAuthenticated(true);
      }
    })
  }, []);

  if (!isAuthenticated) {
    return (
      <Login baseUrl={baseUrl} setIsAuthenticated={setIsAuthenticated}/>
    )
  }

  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<DogSearch baseUrl={baseUrl} setIsAuthenticated={setIsAuthenticated}/>} />
        </Routes>
    </div>
  );
}

export default App;
