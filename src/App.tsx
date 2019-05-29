import ApolloClient from 'apollo-boost';
import { ethers } from 'ethers';
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { ApolloProvider } from 'react-apollo';

import ClaimForm from './ClaimForm';
import ClaimsList from './ClaimsList';
import './App.css';
import { ProviderContext } from './ProviderContext';

const networks : {[key: string]: {[key: string]: string}} = {
  3: { // Ropsten
    nameClaimAddress: '0xd5be10a138550bd8b53b986af2e45901f377e2bb',
    graphql: 'https://api.thegraph.com/subgraphs/name/ensdomains/shortnameclaims',
  },
  5: { // Goerli
    nameClaimAddress: '0x4ef2aadfda4f0e1f54752953f5f90010ac9e6e40',
  },
  1558996169577: {
    nameClaimAddress: '0x6eD79Aa1c71FD7BdBC515EfdA3Bd4e26394435cC',
  },
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
    },
    paper: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
    },
  });

interface Props extends WithStyles<typeof styles> {}

interface State {
  network?: ethers.utils.Network;
}

class App extends React.Component<Props, State> {
  static contextType = ProviderContext;

  constructor(props: Props) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    this.setState({
      network: await this.context.provider.getNetwork(),
    });
  }

  render() {
    const { classes } = this.props;
    const { network } = this.state;
    if(!network) {
      return (
        <Container maxWidth="md">
          <h1>ENS Short Name Claim Tool</h1>
          <CircularProgress />
        </Container>
      );
    }

    const networkInfo = network?networks[network.chainId]:null;
    if(!networkInfo) {
      return (
        <Container maxWidth="md">
          <h1>ENS Short Name Claim Tool</h1>
          <Paper>
            <Typography variant="h2" component="h1">Network Not Supported</Typography>
            <Typography variant="body1">
              The network your browser is connected to is not supported. Please
              connect to a supported network.
            </Typography>
          </Paper>
        </Container>
      );
    }

    const client = networkInfo.graphql?new ApolloClient({uri: networkInfo.graphql}):null;

    return (
      <Container maxWidth="md" className={classes.root}>
        <h1>ENS Short Name Claim Tool</h1>

        <Paper className={classes.paper}>
          <h2>Submit a claim</h2>
          <ClaimForm address={networkInfo.nameClaimAddress} />
        </Paper>

        {client && <Paper className={classes.paper}>
          <h2>Claims</h2>
          <ApolloProvider client={client}><ClaimsList address={networkInfo.nameClaimAddress} /></ApolloProvider>
        </Paper>}
      </Container>
    );
  }
}

export default withStyles(styles)(App);
