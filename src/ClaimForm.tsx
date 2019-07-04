/// <reference path="dns-packet.d.ts" />
import { ethers } from 'ethers';
import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { encode as encodePacket, decode as decodePacket, Packet, RECURSION_DESIRED } from 'dns-packet';

import DNSProofInfo from './DNSProofInfo';

const NAME_RE = /^([^.]{3,6}\.[^.]+|[^.]{3,6}eth\.[^.]+|[^.]{1,4}\.[^.]{2}|[^.]{1,3}\.[^.]{3}|[^.]{1,2}\.[^.]{4}|[^.]{1}\.[^.]{5})$/;
const EMAIL_RE = /^[^@]+@[^.]+\..+$/;
const DNS_URL = 'https://cloudflare-dns.com/dns-query?ct=application/dns-udpwireformat&dns=';

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '100%',
    },
    button: {
      margin: theme.spacing(1),
      width: "40%",
    },
    progress: {
      margin: theme.spacing(2),
    },
  });

async function dnsQuery(qtype: string, name: string): Promise<Packet> {
  let q = {
    type: 'query',
    id: Date.now() % 65536,
    flags: RECURSION_DESIRED,
    questions: [
      {
        type: qtype,
        class: 'IN',
        name: name,
      },
    ],
    answers: [],
    authorities: [],
    additionals: [],
  };
  return await getDNS(q);
}

async function getDNS(query: Packet): Promise<Packet> {
  let response = await fetch(DNS_URL + encodePacket(query).toString('base64'));
  let decoded = decodePacket(new Buffer(await response.arrayBuffer()));
  return decoded;
}

enum Status {
  Initial = 1,
  Loading,
  Loaded
}

interface State {
  status: Status;
  name: string;
  email: string;
  result?: Packet;
}

interface Props extends WithStyles<typeof styles> {
  claimer: ethers.Contract;
}

class ClaimForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      status: Status.Initial,
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.id === 'email') {
      this.setState({ email: event.target.value.toLowerCase(), status: Status.Initial });
    } else if(event.target.id === 'name') {
      this.setState({ name: event.target.value, status: Status.Initial });
    }
  }

  handleCheck = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    return this.doCheck();
  }

  doCheck = async () => {
    this.setState({ status: Status.Loading });

    const result = await dnsQuery("TXT", "_ens." + this.state.name);

    this.setState({
      status: Status.Loaded,
      result: result,
    });
  }

  handleClear = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({
      status: Status.Initial,
      name: '',
    })
  }

  render() {
    const { classes } = this.props;
    const { name, email, status, result } = this.state;

    return (
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            autoFocus={true}
            label="DNS domain"
            className={classes.textField}
            value={name}
            onChange={this.handleChange}
            id="name"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Email Address"
            className={classes.textField}
            value={email}
            onKeyPress={(ev) => (ev.key === 'Enter' && this.doCheck())}
            onChange={this.handleChange}
            id="email"
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.handleCheck}
            disabled={!NAME_RE.test(name) || !EMAIL_RE.test(email)}
          >Check</Button>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            onClick={this.handleClear}
          >Clear</Button>
        </Grid>
        {status === Status.Loading && <Grid item xs={12}><CircularProgress className={classes.progress} /></Grid>}
        {status === Status.Loaded && result && this.props.claimer && <DNSProofInfo name={name} email={email} claimer={this.props.claimer} result={result} />}
      </Grid>
    );
  }
}

export default withStyles(styles)(ClaimForm);
