import React from 'react';
import SideMenu from './components/SideMenu';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <SideMenu />
      <MainContent />
    </div>
  );
}

export default App;
