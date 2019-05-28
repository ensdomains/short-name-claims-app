import { ethers } from 'ethers';
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ClaimForm from './ClaimForm';
import './App.css';
import { ProviderContext } from './ProviderContext';

const networks : {[key: string]: {[key: string]: string}} = {
  3: { // Ropsten
    nameClaimAddress: '0xd5be10a138550bd8b53b986af2e45901f377e2bb',
  },
  5: { // Goerli
    nameClaimAddress: '0x4ef2aadfda4f0e1f54752953f5f90010ac9e6e40',
  },
  1558996169577: {
    nameClaimAddress: '0x6eD79Aa1c71FD7BdBC515EfdA3Bd4e26394435cC',
  },
};

interface State {
  network?: ethers.utils.Network;
}

class App extends React.Component<{}, State> {
  static contextType = ProviderContext;

  constructor(props: {}) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    this.setState({
      network: await this.context.provider.getNetwork(),
    });
  }

  render() {
    const { network } = this.state;
    const networkInfo = network?networks[network.chainId]:null;

    return (
      <Container maxWidth="md">
        <h1>ENS Short Name Claim Tool</h1>
        {!network && <CircularProgress />}
        {network && !networkInfo && <Paper>
          <Typography variant="h2" component="h1">Network Not Supported</Typography>
          <Typography variant="body1">
            The network your browser is connected to is not supported. Please
            connect to a supported network.
          </Typography>
        </Paper>}
        {network && networkInfo && <Paper><ClaimForm address={networkInfo.nameClaimAddress} /></Paper>}
      </Container>
    );
  }
}

export default App;
