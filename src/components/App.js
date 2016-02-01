import React from 'react';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import AppBar from 'material-ui/lib/app-bar';
import './App.css';

function App ({ children }) {
  return (
    <div>
      <AppBar
        title="Alteration Summary Demo"
        showMenuIconButton={false}
      />
      <div className="app-container">{children}</div>
    </div>
  );
}

export default connect(
  null,
  routeActions
)(App);
