import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography';
import StringUtils from '../utils/StringUtils'
import Query from '../utils/ObjectQuery'
import ActionLink from './ActionLink'
import TableSortLabel from '@material-ui/core/TableSortLabel'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700
  },
  clickable: {
    cursor: 'pointer'
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  }
});

class TableResult extends React.Component {

  constructor(props) {
    super(props)

    this.rows = this.props.data.rows
  }

  state = {
    direction: 'asc',
    orderBy: -1
  }

  sort = (ind) => {
    let dir = 'asc'
    if (ind === this.state.orderBy) {
      dir = (this.state.direction === 'asc') ? 'desc' : 'asc'
    }

    this.props.data.rows.sort((r1, r2) => {
      if (r1.values[ind] === r2.values[ind]) {
        return 0
      }

      let dirCompare = 'asc'
      if (r1.values[ind] < r2.values[ind]) {
        dirCompare = 'desc'
      }

      if (dir === dirCompare) {
        return 1
      }

      return -1
    })

    this.setState({
      direction: dir,
      orderBy: ind
    })
  }

  _getJsonRowVariables = (rowIndex) => {
    let data = this.props.data
    let prev = data.action
    let variables = []

    let arrayData = prev.arrays[data.arrayName]

    if (arrayData.variables) {
      Object.keys(arrayData.variables).forEach(key => {
        variables.push({
          text: key,
          value: StringUtils.anyToString(Query.find(data.rawRows[rowIndex], arrayData.variables[key]))
        })
      })
    }

    return variables
  }

  _getNonJsonRowVariables = (row) => {
    let data = this.props.data
    let prev = data.action
    let variables = []

    prev.variables.forEach((v,i) => {
      if (v) {
        variables.push({
          text: v,
          value: row.values[i]
        })
      }
    })

    return variables
  }

  render() {
    const { classes, data } = this.props;
    let dataInfo = this._getDataGridInfo(data)

    let headerComps = []

    if (data.headers) {
      let id = 0
      data.headers.forEach((h,i) => {
        headerComps.push(
          <TableCell key={"cell" + id}>
          <TableSortLabel
            active={this.state.orderBy === i}
            direction={this.state.direction}
            onClick={() => {this.sort(i)}}
          >
            {h.text}
          </TableSortLabel>
          </TableCell>
        )
        id++
      })
    }

    let rowComps = []

    data.rows.forEach((row, rowIndex) => {
      let cells = []

      let variables = []
      if (data.action.type !== 'json' && data.action.variables) {
        variables = this._getNonJsonRowVariables(row)
      } else if (data.action.arrays && data.action.arrays[data.arrayName]) {
        variables = this._getJsonRowVariables(rowIndex)
      }

      let clickVariableAliases = data.clickVariableAliases || []

      for (let i=0;i<dataInfo.colCnt;i++) {
        let txt = ''
        if (i < row.values.length) {
          txt = row.values[i]
        } else {
          txt = ''
        }

        if (data.clicks && data.clicks[i]) {
          let nextActionName = ''
          if (data.action.type === 'json') {
            nextActionName = data.clicks[i]
          } else {
            nextActionName = data.action.clicks[i]
          }

          let alias = clickVariableAliases[i]

          txt = <ActionLink variables={variables} clickVariableAlias={alias}  nextActionName={nextActionName}>{txt}</ActionLink>
        }

        cells.push(
          <TableCell key={i.toString()}>
              {txt}
          </TableCell>
        )
      }

      rowComps.push(
        <TableRow className={classes.row} key={row._id}>
            {cells}
        </TableRow>
      )
    })

    return (
      <Paper className={classes.root}>
      <Toolbar>
        <div>
          <Typography variant="h6">
              {data.arrayName}
          </Typography>
        </div>
      </Toolbar>
        <Table className={classes.table}>
          {headerComps.length > 0 &&
            <TableHead>
              <TableRow>
                {headerComps}
              </TableRow>
            </TableHead>
          }
          <TableBody>
            {rowComps}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  _getDataGridInfo (data) {
    let colCnt = 0

    data.rows.forEach(r => {
      if (r.values.length > colCnt) {
        colCnt = r.values.length
      }
    })

    return {
      colCnt: colCnt
    }
  }
}


TableResult.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableResult);