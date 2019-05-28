import packet from 'dns-packet';
import { ethers } from 'ethers';
import { BigNumber, bigNumberify } from 'ethers/utils';
import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import DnsProver, { Result } from '@ensdomains/dnsprovejs';
import { abi as priceOracleABI } from '@ensdomains/ethregistrar/build/contracts/PriceOracle.json';
import { ProviderContext } from './ProviderContext';

const ADDRESS_TXT_RE = /^a=0x[0-9a-fA-F]{40}$/;

const claimTypes = [
  {
    re: /^([^.]{3,6})\.[^.]+$/,
    method: "submitExactClaim",
  },
  {
    re: /^([^.]{3,6})eth\.[^.]+$/,
    method: "submitPrefixClaim",
  },
  {
    re: /^([^.]{1,4})\.([^.]{2})$/,
    method: "submitCombinedClaim",
  },
  {
    re: /^([^.]{1,3})\.([^.]{3})$/,
    method: "submitCombinedClaim",
  },
  {
    re: /^([^.]{1,2})\.([^.]{4})$/,
    method: "submitCombinedClaim",
  },
  {
    re: /^([^.])\.([^.]{5})$/,
    method: "submitCombinedClaim",
  },
]

const styles = (theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    progress: {
      margin: theme.spacing(2),
    },
  });

interface Props extends WithStyles<typeof styles> {
  name: string;
  claimer: ethers.Contract;
  result: Result;
}

interface ClaimData {
  claimed: string;
  cost: BigNumber;
  method: string;
  submitted: boolean;
}

interface State {
  claims?: Array<ClaimData>;
  message?: string;
}

class DNSProofInfo extends React.Component<Props, State> {
  //oracle?: Oracle;

  static contextType = ProviderContext;

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
    await this.fetchClaims();
  }

  fetchClaims = async () => {
    const { claimer, name } = this.props;

    const priceOracleAddress = await claimer.priceOracle();
    const priceOracle = new ethers.Contract(priceOracleAddress, priceOracleABI, this.context.provider);
    const registrationPeriod = await claimer.REGISTRATION_PERIOD();

    const claims = (await Promise.all(claimTypes.map(async (ct) => {
      const matches = name.match(ct.re);
      if(!matches) return undefined;

      const claimed = matches.slice(1).join('');
      const cost = bigNumberify(await priceOracle.price(claimed, 0, registrationPeriod));

      const dnsName = "0x" + packet.name.encode(name).toString('hex');
      const claimId = await claimer.computeClaimId(claimed, dnsName);
      const claimInfo = await claimer.claims(claimId);

      return {
        claimed: claimed,
        cost: cost,
        method: ct.method,
        submitted: !bigNumberify(claimInfo[2]).isZero(),
      };
    }))).filter((c) => c !== undefined) as Array<ClaimData>;
    this.setState({
      claims: claims,
    });
  }

  claimName = (claim: ClaimData) => async () => {
    // Trigger ethereum.enable
    await this.context.account();

    const { claimer, name, result } = this.props;
    const prover = new DnsProver(this.context.provider._web3Provider);
    const oracle = prover.getOracle(await claimer.oracle());
    const [ data, witness ] = await oracle.getAllProofs(result);

    const dnsName = "0x" + packet.name.encode(name).toString('hex');
    const cost = claim.cost.add(claim.cost.div(10));
    const tx = await claimer[claim.method](dnsName, data, witness, {value: cost});
    const shortTxHash = tx.hash.slice(0, 6) + "…" + tx.hash.slice(62);
    this.setState({
      message: "Transaction " + shortTxHash + " submitted",
    });
    await tx.wait();
    this.setState({
      message: "Transaction " + shortTxHash + " mined!",
    });
    await this.fetchClaims();
  }

  handleClose = () => {
    this.setState({
      message: undefined,
    });
  }

  render() {
    const { name, result, classes } = this.props;
    const { claims, message } = this.state;

    let match = false;
    if(result.found) {
      const rrs = result.results[result.results.length - 1].rrs;
      match = rrs.some((rr) => (rr.type === "TXT" && rr.data.some((txt) => ADDRESS_TXT_RE.test(txt))));
    }

    return (
      <>
        <List component="ul">
          <ListItem>
            {result.found || result.nsec
              ?<ListItemIcon><CheckIcon/></ListItemIcon>
              :<ListItemIcon><CloseIcon/></ListItemIcon>
            }
            <ListItemText primary="DNSSEC enabled" secondary={!result.found && !result.nsec?"Your domain must be DNSSEC-enabled, using a supported algorithm. See this page for details.":''} />
          </ListItem>
          <ListItem>
            {result.found
              ?<ListItemIcon><CheckIcon/></ListItemIcon>
              :<ListItemIcon><CloseIcon/></ListItemIcon>
            }
            <ListItemText primary={"Text record on _ens." + name} secondary={!result.found?"You must publish a TXT record on _ens." + name + ", in the format 'a=0x...', specifying the address you want to own the ENS name.":''}/>
          </ListItem>
          <ListItem>
            {match
              ?<ListItemIcon><CheckIcon/></ListItemIcon>
              :<ListItemIcon><CloseIcon/></ListItemIcon>
            }
            <ListItemText>Text record in correct format (`a=0x...`)</ListItemText>
          </ListItem>
          {claims?'':<CircularProgress className={classes.progress} />}
          {claims && claims.map(claim => (
            <ListItem key={claim.claimed}>
              <ListItemIcon>{claim.submitted?<CheckIcon/>:<CloseIcon/>}</ListItemIcon>
              <ListItemText>
                Claimed {claim.claimed}.eth for {ethers.utils.formatEther(claim.cost)} ETH
                {claim.submitted?'':<Button variant="contained" color="primary" className={classes.button} onClick={this.claimName(claim)} disabled={!result.found}>Claim</Button>}
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={message !== undefined}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={message}
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          ]}
        />
      </>
    );
  }
}

export default withStyles(styles)(DNSProofInfo);
