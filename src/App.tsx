import ApolloClient from 'apollo-boost';
import { ethers } from 'ethers';
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { ApolloProvider } from 'react-apollo';

import ClaimForm from './ClaimForm';
import ClaimsList from './ClaimsList';
import './App.css';
import { ProviderContext } from './ProviderContext';

const networks : {[key: string]: {nameClaimAddress: string, graphql?: string, etherscan: string}} = {
  3: { // Ropsten
    nameClaimAddress: '0xd5be10a138550bd8b53b986af2e45901f377e2bb',
    graphql: 'https://api.thegraph.com/subgraphs/name/ensdomains/shortnameclaims',
    etherscan: 'https://ropsten.etherscan.io/address/',
  },
  1558996169577: {
    nameClaimAddress: '0xe982E462b094850F12AF94d21D470e21bE9D0E9C',
    etherscan: '',
  },
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
    },
    paper: {
      margin: theme.spacing(1),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(1),
    },
    h2: {
      marginTop: 0,
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

        {client && <Paper className={classes.paper}>
          <h2 className={classes.h2}>Claims</h2>
          <ApolloProvider client={client}><ClaimsList address={networkInfo.nameClaimAddress} exploreUrl={networkInfo.etherscan} /></ApolloProvider>
        </Paper>}

        <Paper className={classes.paper}>
          <h2 className={classes.h2}>Submit a claim</h2>
          <ClaimForm address={networkInfo.nameClaimAddress} />
        </Paper>

        <Paper className={classes.paper}>
          <h2 className={classes.h2}>About</h2>
          <p>
            <Link href="https://ens.domains/">ENS</Link> is making names shorter
            than 7 characters available for registration in the near future.
            Before they become generally available for registration, there will
            be a preregistration period, during which existing DNS domain owners
            can request ownership of the equivalent ENS domain, followed by an
            auction. Once both preregistration and auction are completed, names
            will be opened for general registration.
          </p>
          <p>
            This app allows owners of existing DNS domains to participate in the
            preregistration process. Anyone who owns an existing DNS second-level
            domain (2LD) may submit a claim. Successful claims will allow the
            claimant to register the corresponding .eth domain without having to
            engage in the auction process.
          </p>
          <p>
            To qualify, the domain being used to support the claim must meet the
            following criteria:
          </p>
          <ol>
            <li>Must be a DNS second-level domain (2LD)</li>
            <li>Must have been registered on or before January 1, 2019.</li>
            <li>Must have DNSSEC enabled, using the algorithm RSASHA256, RSASHA1 or P256SHA256.</li>
            <li>Must have whois information available that includes the domain's initial registration date.</li>
          </ol>
          <p>
            The ENS name being claimed must be one of:
          </p>
          <ol>
            <li>An exact match for the existing DNS domain (eg, foo.com -> foo.eth)</li>
            <li>The DNS domain with the suffix 'eth' removed (eg, asseth.fr -> ass.eth)</li>
            <li>The concatenation of domain and TLD (eg, foo.com -> foocom.eth)</li>
          </ol>
          <p>Domains being claimed must be 3-6 characters long.</p>
          <p>
            Each application must be accompanied by the fee for a year's
            registration ($5 in ETH for a 5-6 character name, $160 in ETH for a
            4 character name, and $640 in ETH for a 3 character name). If an
            application is successful, the claimant is issued the name with 365
            days' registration period (this can be extended as desired). If an
            application is unsuccessful, the fee will be returned to the claimant.
          </p>
          <p>
            In the event that multiple claims are submitted for the same ENS
            name, the name will be issued to the claimant whose DNS domain was
            registered the earliest, based on available whois data.
          </p>
          <p>
            All claims are decided based on the sole discretion of the ENS team.
            Decisions are final.
          </p>

          <h3>Submission Process</h3>
          <ol>
            <li>Enable DNSSEC on your domain. See your DNS provider or registrar's
            documentation for guidance. If offered a choice of algorithms, RSASHA256
            will offer substantial transaction cost savings over the other two
            supported algorithms, RSASHA1 and P256SHA256.</li>
            <li>Publish a TXT record on the '_ens' subdomain
            (eg, _ens.yourdomain.tld). The TXT record must be in the format
            'a=0x...'. The address provided in this TXT record is the address of
            the claimant, who will have control of the domain if the application
            is successful, and who will receive a refund if it is not.</li>
            <li>Enter your domain name (eg, yourdomain.tld) in the 'Submit a
            Claim' section on this page and click 'Check'.</li>
            <li>If all the checks pass, choose the name you wish to claim and
            click 'submit'.</li>
            <li>Approve the transaction request, for a year's registration fee
            plus gas costs for proving ownership of your domain.</li>
          </ol>
        </Paper>
      </Container>
    );
  }
}

export default withStyles(styles)(App);
