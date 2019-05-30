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
import { Packet } from 'dns-packet';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { abi as priceOracleABI } from '@ensdomains/ethregistrar/build/contracts/PriceOracle.json';
import { ProviderContext } from './ProviderContext';

const ADDRESS_TXT_RE = /^a=(0x[0-9a-fA-F]{40})$/;

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
  result: Packet;
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
  static contextType = ProviderContext;

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
    await this.fetchClaims();
  }

  getClaimantAddress = () => {
    for(let rr of this.props.result.answers) {
      if(rr.type !== 'TXT') continue;
      for(let data of rr.data) {
        const match = data.toString().match(ADDRESS_TXT_RE);
        if(match) {
          return match[1];
        }
      }
    }
    return null;
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

    const { claimer, name } = this.props;
    const writeClaimer = claimer.connect(this.context.provider.getSigner());

    const dnsName = "0x" + packet.name.encode(name).toString('hex');
    const claimant = this.getClaimantAddress();
    const cost = claim.cost.add(claim.cost.div(10));
    const tx = await writeClaimer[claim.method](dnsName, claimant, {value: cost});
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

    let found = result.rcode === 'NOERROR' && result.answers.length > 0;
    let match = false;
    if(found) {
      match = this.getClaimantAddress() != null;
    }

    return (
      <>
        <List component="ul">
          <ListItem>
            {found
              ?<ListItemIcon><CheckIcon/></ListItemIcon>
              :<ListItemIcon><CloseIcon/></ListItemIcon>
            }
            <ListItemText primary={"Text record on _ens." + name} secondary={!found?"You must publish a TXT record on _ens." + name + ", in the format 'a=0x...', specifying the address you want to own the ENS name.":''}/>
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
                {claim.submitted?'':<Button variant="contained" color="primary" className={classes.button} onClick={this.claimName(claim)} disabled={!match}>Claim</Button>}
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
