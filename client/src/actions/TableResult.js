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
import configurationStore from '../store/configurationStore'
import ResultCreator from './ResultCreator';

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
  }
});

class TableResult extends React.Component {

  cellClick = (row, rowIndex, columnIndex, e) => {
    e.preventDefault()
    let data = this.props.data
    let prev = data.action
    let variables = []

    if (prev.inputs) {

    }

    if (prev.variables) {
      prev.variables.forEach((v,i) => {
        if (v) {
          variables.push({
            text: v,
            value: row.values[i]
          })
        }
      })
      configurationStore.selectNextAction(variables, prev.clicks[columnIndex])
    } else if (prev.arrays && prev.arrays[data.arrayName]) {
      let arrayData = prev.arrays[data.arrayName]

      if (arrayData.variables) {
        Object.keys(arrayData.variables).forEach(key => {
          variables.push({
            text: key,
            value: ResultCreator._safeToString(ResultCreator._queryObject(data.rawRows[rowIndex], arrayData.variables[key]))
          })
        })
      }

      configurationStore.selectNextAction(variables, data.clicks[columnIndex])
    }
    
  }

  render() {
    const { classes, data } = this.props;
    let dataInfo = this._getDataGridInfo(data)

    let headerComps = []

    if (data.headers) {
      let id = 0
      data.headers.forEach(h => {
        headerComps.push(
          <TableCell key={"cell" + id}>{h.text}</TableCell>
        )
        id++
      })
    }

    let rowComps = []

    data.rows.forEach((row, rowIndex) => {
      let cells = []

      for (let i=0;i<dataInfo.colCnt;i++) {
        let txt = ''
        if (i < row.values.length) {
          txt = row.values[i]
        } else {
          txt = ''
        }

        if (data.clicks && data.clicks[i]) {
          txt = <a className={classes.clickable} href="#/" onClick={(e) => this.cellClick(row, rowIndex, i, e)}>
            <span>{txt}</span>
          </a>
        }

        cells.push(
          <TableCell key={i.toString()}>
              {txt}
          </TableCell>
        )
      }

      rowComps.push(
        <TableRow key={row._id}>
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