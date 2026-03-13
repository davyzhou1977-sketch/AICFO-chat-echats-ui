import React from 'react';
import SideMenu from './components/SideMenu';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SideMenu />
      <MainContent />
    </div>
  );
}

export default App;
