import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField'

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    borderRight: "1px solid #ccc"
  },
}))(TableCell);

const styles = theme => ({
  table: {
    borderLeft: "1px solid #ccc"
  },
  row: {
    height: 35,
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  headerRow: {
    height: 35
  },
  cellText: {
    width: "100%"
  }
});

class EditableGrid extends React.Component {
  state = {
    type: 'array', //array,object
    itemType: 'object' //object,value
  }

  componentWillReceiveProps() {

  }

  render() {
    const { classes, schema, value } = this.props;

    if (schema && value) {
      let headers = []
      let headerKeys = Object.keys(schema)
      headerKeys.forEach((key,i) => {
        headers.push(<CustomTableCell key={"header" + i}>{key}</CustomTableCell>)
      })

      let rows = []
      let iterator = null
      if (Array.isArray(value)) {
        iterator = value
      } else {
        iterator = Object.keys(value)        
      }

      iterator.forEach((item, ind) => {
        let cells = []
        headerKeys.forEach((k,i) => {
          cells.push(<CustomTableCell>
            <TextField
              key={"cell" + i}
              className={classes.cellText}
              InputProps={{
                disableUnderline: true
              }}
              value={item[k]}
            ></TextField>
          </CustomTableCell>)
        })
        rows.push(<TableRow key={"row" + ind} className={classes.row}>
          {cells}
        </TableRow>)
      })

      return <div className={this.props.className}><Table className={classes.table}>
      <TableHead>
        <TableRow className={classes.headerRow}>
          {headers}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows}
      </TableBody>
    </Table></div>
    } else {
      return ""
    }
  }
}

export default withStyles(styles)(EditableGrid);