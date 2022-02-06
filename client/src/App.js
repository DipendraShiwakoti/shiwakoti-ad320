import React from 'react';
import './App.css';
import Topbar from './components/Topbar/Topbar';
import FlashCard from './components/FlashCard/flashCard';
import CardNavigation from './components/CardNavigation/CardNavigation';


function App() {
  return (
    <React.Fragment>
      <Topbar />
      <div className = "container">
      <CardNavigation/>
      <FlashCard/>
      </div>
      
    </React.Fragment>
  );
}

export default App;
