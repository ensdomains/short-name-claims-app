import ApolloClient from 'apollo-boost';
import { ethers } from 'ethers';
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { ApolloProvider } from 'react-apollo';
import { abi as nameClaimsABI } from '@ensdomains/ethregistrar/build/contracts/ShortNameClaims.json';

import ClaimForm from './ClaimForm';
import ClaimsList from './ClaimsList';
import './App.css';
import { ProviderContext } from './ProviderContext';

const networks : {[key: string]: {nameClaimAddress: string, graphql?: string, etherscan: string}} = {
  1: { // Mainnet
    nameClaimAddress: '0xf7c83bd0c50e7a72b55a39fe0dabf5e3a330d749',
    graphql: 'https://api.thegraph.com/subgraphs/name/ensdomains/shortnameclaims',
    etherscan: 'https://etherscan.io/address/',
  },
  3: { // Ropsten
    nameClaimAddress: '0x178dc714ac0121577d025a0cf4dcd396f4f08ec3',
    graphql: 'https://api.thegraph.com/subgraphs/name/ensdomains/shortnameclaimsropsten',
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
      marginBottom: theme.spacing(3),
      padding: theme.spacing(3),
      '& p': {
        fontSize: '14pt',
        lineHeight: '1.5em',
      },
      '& li': {
        fontSize: '14pt',
        lineHeight: '1.5em',
      },
    },
    h2: {
      marginTop: 0,
    },
    h3: {
      marginTop: 0,
    },
    h4: {
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
              connect to Ropsten or Mainnet.
            </Typography>
          </Paper>
        </Container>
      );
    }

    const claimer = new ethers.Contract(networkInfo.nameClaimAddress, nameClaimsABI, this.context.provider);

    const client = networkInfo.graphql?new ApolloClient({uri: networkInfo.graphql}):null;

    return (
      <Container maxWidth="md" className={classes.root}>
        <h1>ENS Short Name Claim Tool</h1>

        {client && <ApolloProvider client={client}>
          <Paper className={classes.paper}>
            <ClaimsList title="All Claims" claimer={claimer} exploreUrl={networkInfo.etherscan} />
          </Paper>
        </ApolloProvider>}

        <Paper className={classes.paper}>
          <h2 className={classes.h2}>Submit a claim</h2>
          <p>The claims process is now closed.</p>
        </Paper>

        <Paper className={classes.paper}>
          <h2 className={classes.h2}>About</h2>
          <p>ENS is making names shorter than 7 characters available for registration in the near future. Before they become generally available for registration, there will be a preregistration period, followed by an auction. Once both the preregistration and auction are completed, remaining names will be available for general registration.</p>
          <h3 className={classes.h3}>The Short Name Reservation Process</h3>
          <p>A reservation process will be used during preregistration period. The basic premise behind using the reservation process is that ENS is more useful the less surprising it is.</p>
          <p>To a large part, being less surprising means that known projects in the crypto space can get the name that best represents them. Furthermore, the likelihood of projects adopting ENS is proportional to how well they can represent themselves with it.</p>
          <p>We hope the reservation process furthers this goal of meaningful representation, while increasing ENS adoption. </p>
          <p>After much discussion and debate, the ENS team feels that implementing the following process will be the most effective way to achieve these goals. </p>
          <p>(The topic’s been under discussion for some time. You can find related discussions <a href="https://discuss.ens.domains/tags/reservation-process">here</a>.)</p>
          <p>Any DNS domain owner may apply to reserve a short (3-6 character) ENS name ahead of the auction process.</p>
          <h3 className={classes.h3}>How It Works</h3>
          <p>Public applications must reference an existing DNS domain name, and specify the ENS domain they wish to claim. The DNS domain must have been registered prior to May 4, 2019.</p>
          <p>Applications may be submitted using this application. Note that application information, including your email address, is visible onchain in plain-text. If you are concerned about this, we recommend using a temporary email address.</p>
          <h4 className={classes.h4}>Reservation requests must be received during the reservation process window</h4>
          <p>The reservation process window opened at 00:00UTC 11 July 2019 and closed at 00:00 UTC 17 August 2019.</p>
          <h4 className={classes.h4}>Criteria to Quality for ENS Name Reservation</h4>
          <p>To qualify, the domain being used to support the claim must meet the following criteria:</p>
          <ul>
            <li>Must be a DNS second-level domain (2LD)</li>
            <li>Must have been registered on or before May 4, 2019</li>
          </ul>
          <p>And the ENS name being claimed must be one of:</p>
          <ul>
            <li>An exact match for the existing DNS domain (eg, foo.com -> foo.eth)</li>
            <li>The DNS domain with the suffix 'eth' removed (eg, asseth.fr -> ass.eth)</li>
            <li>The concatenation of domain and TLD (eg, foo.com -> foocom.eth)</li>
          </ul>
          <p>Domains being claimed must be 3-6 characters long</p>
          <p>Each application must be accompanied by the fee for a year's registration ($5 in ETH for a 5-6 character name, $160 in ETH for a 4 character name, and $640 in ETH for a 3 character name). </p>
          <p>Before the public application is submitted, the owner of the DNS domain must create a TXT record on a specific subdomain with a predetermined value to demonstrate their ownership of the DNS domain, to validate the claim. This record must remain in place at least until the claim is approved, declined, or withdrawn.</p>
          <p>If an application is successful, the claimant is issued the name with 365 days' registration period (this can be extended as desired). If an application is unsuccessful, the fee will be returned to the claimant.</p>
          <h4 className={classes.h4}>The ENS team will review each submission for validity.</h4>
          <p>Because this is a subjective process, we’re inclined to set quite a low bar to prove validity. For example, if the submitted DNS domain is only a domain parking page, we’ll reject the request.</p>
          <p>If the submitted DNS domain has any kind of web presence, and we can find anyone talking about it as a real project, we’ll probably approve the request.</p>
          <p>Our goal is to exclude low effort attempts to claim a name that’s not actually being used for anything.</p>
          <h4 className={classes.h4}>The submission that can demonstrate its been operating the longest wins.</h4>
          <p>If multiple valid claims are received for the same ENS domain, the project that can demonstrate it’s been operating the longest among the claimants, will be awarded the ENS name.</p>
          <p>All claims are decided based on the sole discretion of the ENS team. Decisions are final.</p>
          <p>The ENS team reserves the right to make individual exceptions to these rules - for example, to approve a name for a widely known project that lacks a matching DNS domain.</p>
          <p>Inquiries and requests for special consideration can be submitted by email to reserve@ens.domains.</p>
        </Paper>
      </Container>
    );
  }
}

export default withStyles(styles)(App);
