import React from 'react';
import { BrowserRouter } from "react-router-dom";
import '/node_modules/primeflex/primeflex.css';
import MyAppBar from "./components/MyAppBar";
import AdministrativePanel from './components/administrativePanel';
import Navigation from './components/navigation';

function App() {
  return (
    <>
      <BrowserRouter>
        <div class='card h-screen surface-ground '>
          <MyAppBar />
          <div class="flex card-container mt-5">
            <AdministrativePanel />
            <Navigation />
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
