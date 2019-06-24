import { Query, QueryResult } from 'react-apollo';
import { gql } from 'apollo-boost';
import debounce from 'lodash/debounce';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputBase from '@material-ui/core/InputBase';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

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
    toolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    spacer: {
      flex: '1 1 100%',
    },
    title: {
      flex: '0 0 auto',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
  }),
);

interface Props {
  address: string;
  exploreUrl: string;
  title: string;
}

const query = gql`
  query Claims($filter: Claim_filter, $skip: Int, $limit: Int) {
    claims(first: $limit, skip: $skip, orderBy: name, where: $filter) {
      id
      name
      dnsName
      owner
      status
      submittedAt
    }
  }
`;

interface Claims_filter {
  name_starts_with?: string;
  owner?: string;
}

export const ClaimsList: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { exploreUrl, title } = props;

  const [ skip, setSkip ] = React.useState(0);
  const [ limit, setLimit ] = React.useState(5);
  const [ nextSearch, setNextSearch ] = React.useState('');
  let [ search, setSearch ] = React.useState('');
  setSearch = debounce(setSearch, 500);

  function searchChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setNextSearch(e.target.value);
    setSearch(e.target.value);
  }

  let filter: Claims_filter = {};
  if(ADDRESS_RE.test(search)) {
    filter.owner = search;
  } else {
    filter.name_starts_with = search;
  }

  return <>
    <Toolbar className={classes.toolbar}>
      <Typography variant="h6" className={classes.title}>{title}</Typography>
      <div className={classes.spacer} />
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          onChange={searchChanged}
          value={nextSearch}
        />
      </div>
    </Toolbar>
    <Query query={query} variables={{ filter: filter, limit, skip: skip }}>
      {(result:QueryResult) => {
        if(result.loading) return <CircularProgress />;
        if(result.error) return <div>Error loading list of claims.</div>;

        return <>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>DNS Domain</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.data.claims.map((claim:any) => (
                <TableRow key="{claim.name}:{claim.dnsName}:{claim.owner}">
                  <TableCell>{claim.name}.eth</TableCell>
                  <TableCell>{claim.dnsName}</TableCell>
                  <TableCell>{new Date(claim.submittedAt * 1000).toLocaleDateString()}</TableCell>
                  <TableCell><Link href={exploreUrl + claim.owner}>{claim.owner.slice(0, 6) + '…' + claim.owner.slice(38)}</Link></TableCell>
                  <TableCell>{claim.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                rowsPerPage={limit}
                page={skip / limit}
                count={result.data.claims.length===limit ? skip+limit+1 : skip+result.data.claims.length}
                onChangePage={(e: any, page: number) => setSkip(Math.max(limit * page, 0))}
                onChangeRowsPerPage={(e: React.ChangeEvent<HTMLInputElement>) => setLimit(parseInt(e.target.value))}
              />
            </TableFooter>
          </Table>
        </>
      }}
    </Query>
  </>
}

export default ClaimsList;
