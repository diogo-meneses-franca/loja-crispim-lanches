import React from 'react';
import { BrowserRouter } from "react-router-dom";
import '/node_modules/primeflex/primeflex.css';
import MyAppBar from "./components/myAppBar/MyAppBar";
import AdministrativePanel from './components/administrativePanel/AdministrativePanel';
import Navigation from './components/navigation/Navigation';
import Footer from './components/footer/Footer';

function App() {
  return (
    <>
      <BrowserRouter>
        <div class='card min-h-screen flex-column bg-cover bg-white '>
          <MyAppBar />
          <div class="flex card-container min-h-screen">
            <AdministrativePanel />
            <Navigation />
          </div>
            <Footer/>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
