import packet from 'dns-packet';
import { ethers } from 'ethers';
import { BigNumber, bigNumberify } from 'ethers/utils';
import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
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
  email: string;
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
  claim?: ClaimData;
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
    const { claimer, name, email } = this.props;

    const priceOracleAddress = await claimer.priceOracle();
    const priceOracle = new ethers.Contract(priceOracleAddress, priceOracleABI, this.context.provider);
    const registrationPeriod = await claimer.REGISTRATION_PERIOD();
    const claimant = this.getClaimantAddress();
    const dnsName = "0x" + packet.name.encode(name).toString('hex');

    const claims = (await Promise.all(claimTypes.map(async (ct) => {
      const matches = name.match(ct.re);
      if(!matches) return undefined;

      const claimed = matches.slice(1).join('');
      const cost = bigNumberify(await priceOracle.price(claimed, 0, registrationPeriod));

      let submitted = false;
      if(claimant) {
        const claimId = await claimer.computeClaimId(claimed, dnsName, claimant, email);
        const claimInfo = await claimer.claims(claimId);
        submitted = !bigNumberify(claimInfo[2]).isZero();
      }

      return {
        claimed: claimed,
        cost: cost,
        method: ct.method,
        submitted: submitted,
      };
    }))).filter((c) => c !== undefined) as Array<ClaimData>;
    this.setState({
      claims: claims,
    });
  }

  claimName = (claim?: ClaimData) => async () => {
    if(claim === undefined) return;

    // Trigger ethereum.enable
    await this.context.account();

    const { claimer, name, email } = this.props;
    const writeClaimer = claimer.connect(this.context.provider.getSigner());

    const dnsName = "0x" + packet.name.encode(name).toString('hex');
    const claimant = this.getClaimantAddress();
    const cost = claim.cost.add(claim.cost.div(10));
    const tx = await writeClaimer[claim.method](dnsName, claimant, email, {value: cost});
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
    const { claims, message, claim } = this.state;

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
                {claim.submitted?'':<Button variant="contained" color="primary" className={classes.button} onClick={() => this.setState({claim: claim})} disabled={!match}>Claim</Button>}
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Dialog open={claim !== undefined} onClose={() => this.setState({claim: undefined})} aria-labelledby="dialog-title" aria-describedby="dialog-description">
          <DialogTitle id="dialog-title">Terms and Conditions</DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-description">
              <p>These terms and conditions (“Terms”) constitute a legal agreement between True Names Ltd. (“True Names”, “us”, or “we”) and the entity or person (“you”, “your”, or “user”) who uses these services to apply to reserve an ENS short name under the Ethereum Name System (the “Services”). These Terms describe the terms and conditions that apply to your use of the Services. </p>
              <p>If you do not understand any of these Terms, please contact us before using the Services. You may not access or use the Services unless you agree to abide by all of the terms and conditions in these Terms.  You warrant that you are at least 18-years-old and you are legally capable of entering into binding contracts. If you are under 18-years-old, you warrant that you have obtained consent from your parent or guardian and they agree to be bound by these Terms on your behalf.</p>
              <h3>1.	SOLE AND ABSOLUTE DISCRETION</h3>
              <p>You acknowledge and understand that the provision/allocation of reserved ENS short names is entirely within our sole and absolute discretion, and that we will make such allocation on any basis that we determine. </p>
              <p>In the event that your application for a reserved ENS short name is unsuccessful, your sole remedy shall be a refund of any amounts paid by you to us in connection with such application through the Services. </p>
              <h3>2.	PROVISION OF INFORMATION</h3>
              <p>When you use the Services, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your application.</p>
              <p>When you use the Services, you may be asked to supply certain personal information relevant to your application including, without limitation, your email addresses and your ETH addresses. BY SUBMITTING THAT INFORMATION, YOU (A) REPRESENT AND WARRANT THAT THE INFORMATION YOU SUPPLY TO US IS TRUE, CORRECT AND COMPLETE, (B) YOU GRANT US THE RIGHT TO PROVIDE YOUR INFORMATION TO THIRD PARTIES FOR PURPOSES OF FACILITATING YOUR APPLICATION, AND (C) YOU CONSENT TO YOUR INFORMATION (INCLUDING EMAIL ADDRESS IN PLAINTEXT) BEING RECORDED ON THE ETHEREUM BLOCKCHAIN. </p>
              <h3>3.	INTELLECTUAL PROPERTY</h3>
              <p>The Ethereum Name System is protected by copyright, trademark, and other laws of both Singapore and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of True Names. Nothing in these Terms constitutes a transfer of any intellectual property rights from us to you.</p>
              <h3>4.	DISCLAIMER</h3>
              <p>THE SERVICES AND ALL CONTENT AND MATERIALS INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THE SITE ARE PROVIDED BY US ON AN “AS IS” AND “AS AVAILABLE” BASIS, UNLESS OTHERWISE SPECIFIED IN WRITING.</p>
              <p>WE MAKE NO REPRESENTATION OR WARRANTIES, EXPRESS OR IMPLIED, STATUTORY OR OTHERWISE, REGARDING ANY MATTER, INCLUDING THE MERCHANTABILITY, SUITABILITY, ORIGINALITY, OR FITNESS FOR A PARTICULAR USE OR PURPOSE, NON-INFRINGEMENT OR RESULTS TO BE DERIVED FROM THE USE OF THE SERVICES, OR CONTENT AND MATERIALS INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THE SITE, OR THAT THE OPERATION OF ANY SUCH SERVICES OR CONTENT OR MATERIALS WILL BE UNINTERRUPTED OR FREE OF ERROR, VIRUSES OR OTHER HARMFUL COMPONENTS. YOU EXPRESSLY AGREE THAT YOUR USE OF THE SITE IS AT YOUR SOLE RISK.</p>
              <p>IN NO EVENT SHALL WE BE LIABLE TO YOU FOR SPECIAL, INCIDENTAL, INDIRECT OR CONSEQUENTIAL DAMAGES, DAMAGES FROM LOSS OF USE, DATA, PROFITS, OR BUSINESS OPPORTUNITIES, OR FAILURE TO ACHIEVE COST SAVINGS, IN CONTRACT, TORT OR OTHERWISE, EVEN IF WE MAY HAVE BEEN ADVISED IN ADVANCE OF THE POSSIBILITY OF SUCH LOSS, COST OR DAMAGES, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS.</p>
              <h3>5.	LIMITATION OF LIABILITY</h3>
              <p>TO THE EXTENT PERMITTED BY LAW AND UNLESS OTHERWISE EXCLUDED IN THE PRECEDING PARAGRAPH, OUR AGGREGATE LIABILITY FOR ANY LOSS OR DAMAGE SUSTAINED BY YOU ARISING OUT OF OR IN CONNECTION WITH DEFAULT UNDER THIS AGREEMENT SHALL BE LIMITED TO THE SUM WE HAVE RECEIVED FROM YOU UNDER THE SERVICES.</p>
              <h3>6.	GENERAL </h3>
              <p>You may not assign your rights under these Terms without our prior written consent. We may assign our rights under these Terms to any third party, or delegate or subcontract the performance of any of our functions under these Terms.</p>
              <p>These Terms constitute the entire agreement and understanding between you and us and supersedes any prior agreements, arrangements or understandings or communications between the parties with respect to the subject matter hereof.</p>
              <p>If any provision of these Terms will be deemed illegal, invalid or unenforceable, such impaired provision will not affect the legality, validity and enforceability of the remaining provisions.</p>
              <p>We may, by notice through this site or by email or any other method of notification, vary any provisions of these Terms. Such variation will take effect on the date as specified through the above means. If you use the site or the Services after such date, you are deemed to have accepted such variation. If you do not accept the variation, you must stop access or using the site and the Services. The version of Terms applicable to any particular order is the latest version in force.</p>
              <p>Our failure or delay to exercise our rights under these Terms will not constitute a waiver of these Terms.</p>
              <h3>7.	GOVERNING LAW</h3>
              <p>These Terms are governed by and will be construed in accordance with the laws of Singapore and you agree to submit to the exclusive jurisdiction of the courts of Singapore.</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({claim: undefined})} color="primary">Reject</Button>
            <Button onClick={this.claimName(claim)} color="primary" autoFocus>Accept</Button>
          </DialogActions>
        </Dialog>
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
