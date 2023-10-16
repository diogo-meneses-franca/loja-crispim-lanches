import React from 'react';
import { BrowserRouter } from "react-router-dom";
import '/node_modules/primeflex/primeflex.css';
import MyAppBar from "./components/MyAppBar";
import AdministrativePanel from './components/administrativePanel';
import Navigation from './components/navigation';
import Footer from './components/footer';

function App() {
  return (
    <>
      <BrowserRouter>
        <div class='card min-h-screen flex-column bg-cover surface-ground '>
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
