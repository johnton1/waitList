import React, { Component } from 'react';
import './App.css';
import SMSForm from './SMSForm';
import SnapshotFirebase from './SnapshotFirebase.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
       <SnapshotFirebase/>
        <SMSForm/>
          
        </header>
      </div>
    );
  }
}

export default App;
