import { Query, QueryResult } from 'react-apollo';
import { gql } from 'apollo-boost';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    },
  }),
);

interface Props {
  address: string;
  exploreUrl: string;
}

const query = gql`
  {
    claims(orderBy: name) {
      id
      name
      dnsName
      owner
      approved
      submittedAt
    }
  }
`;

export const ClaimsList: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { exploreUrl } = props;

  return (
    <Query query={query}>
      {(result:QueryResult) => {
        if(result.loading) return <CircularProgress />;
        if(result.error) return <div>Error loading list of claims.</div>;

        return (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>DNS Domain</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Account</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.data.claims.map((claim:any) => (
                <TableRow>
                  <TableCell>{claim.name}.eth</TableCell>
                  <TableCell>{claim.dnsName}</TableCell>
                  <TableCell>{new Date(claim.submittedAt * 1000).toLocaleDateString()}</TableCell>
                  <TableCell><Link href={exploreUrl + claim.owner}>{claim.owner.slice(0, 6) + '…' + claim.owner.slice(38)}</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      }}
    </Query>
  )
}

export default ClaimsList;
