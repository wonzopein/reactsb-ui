import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import {Switch, Route, BrowserRouter, Link} from 'react-router-dom';
import Home from "./pages";
import Sorter from "./pages/sorter";
import Eequipment from "./pages/equipment";

function App() {
  return (
      <BrowserRouter>
        <div>
            <ul>
                <li><Link to={"/"}>Home</Link></li>
                <li><Link to={"/sorter"}>Sorter</Link></li>
                <li><Link to={"/equipment"}>Equipment</Link></li>
            </ul>
        </div>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/sorter" component={Sorter} />
            <Route path="/equipment" component={Eequipment} />
            <Route path="*" to="/" />
        </Switch>
      </BrowserRouter>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
