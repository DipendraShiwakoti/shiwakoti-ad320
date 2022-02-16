import React from 'react';
import './App.css';
import Topbar from './components/Topbar/Topbar';
import FlashCard from './components/FlashCard/flashCard';
import CardNavigation from './components/CardNavigation/CardNavigation';
import Button from './components/Button/button';


function App() {
  return (
    <React.Fragment>
      <Topbar />
      <div className = "container">
       <CardNavigation/>
       <div className = "card-container">
         <FlashCard/>
         <div className = "card-controls">
            <Button> Back</Button>
            <Button> Flip </Button>
            <Button> Next </Button>
          </div>
       </div>
      </div>
      
    </React.Fragment>
  );
}

export default App;
