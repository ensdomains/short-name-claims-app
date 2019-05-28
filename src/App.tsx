import React from 'react';
import Container from '@material-ui/core/Container';

import ClaimForm from './ClaimForm';
import './App.css';

const App: React.FC = () => {
  return (
    <Container maxWidth="md">
      <h1>Hello, world</h1>
      <ClaimForm />
    </Container>
  );
}

export default App;
