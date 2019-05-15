import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import configurationStore from '../store/configurationStore'
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {

  }
});

class SettingsContext extends React.Component {
  state = {
  }

  handleItemClick = item => () => {

  }

  render() {
    const { classes } = this.props;
    const items = configurationStore.settings.contextItems

    let listItems = []
    items.forEach((item, i) => {
        listItems.push(<ListItem key={"contextItem" + i} role={undefined} dense button onClick={this.handleItemClick(item)}>
            <ListItemText primary={item.text} />
            <ListItemSecondaryAction>
            <IconButton aria-label="Comments">
                <CommentIcon />
            </IconButton>
            </ListItemSecondaryAction>
        </ListItem>)
        })

    return <div className={classes.root}>
        <Grid container spacing={24}>
            <Grid item xs={6}>
                <List>
                    {listItems}
                </List>
            </Grid>
            <Grid item xs={6}>
                Hello
            </Grid>
        </Grid>
      </div>
  }
}

export default withStyles(styles)(SettingsContext);