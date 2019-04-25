import React, { Component } from 'react';
import './App.css';
import Menu from './menu/Menu'
import MainTabs from './tabs/MainTabs'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Menu></Menu>
        <MainTabs></MainTabs>
      </div>
    );
  }
}

export default App;
