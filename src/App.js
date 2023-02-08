import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Identifikacija from './Pages/Identifikacija';
import Home from './Pages/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ZakaziTermin from './Pages/ZakaziTermin';
import Select from 'react-select';
import React, { useState } from "react";
import ZubarHome from './Pages/ZubarHome';
import ZubarZakaziTermin from './Pages/ZubarZakaziTermin';

function App() {


  return (
    <div className="App">
      <Router>
        <Navbar/>
        
        <Routes>
          <Route exact path="/" element={<Identifikacija/>}/>
          <Route exact path="/pregled" element={<Home/>}/>
          <Route exact path="/zakazi" element={<ZakaziTermin/>}/>
          <Route exact path="/pregledZubar" element={<ZubarHome/>}/>
          <Route exact path="/zakaziZubar" element={<ZubarZakaziTermin/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
