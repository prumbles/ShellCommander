import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import configurationStore from '../store/configurationStore'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import StringUtils from '../utils/StringUtils'

const styles = theme => ({
  link: { },
  hasMenuRoot: {
      display: 'inline-block'
  }
});

class ActionLink extends React.Component {
  state = {
    isMenuOpen: false
  }

  anchorElRef = React.createRef();

  handleClick = event => {
    event.preventDefault()

    if(this.state.isMenu) {
        this.setState({
            isMenuOpen: true
        })
    } else {
        configurationStore.selectNextAction(this.props.variables, this.props.nextActionName)
    }
  }

  handleMenuItemClick = (event, actionName) => {
    this.setState({
        isMenuOpen: false
    })
    configurationStore.selectNextAction(this.props.variables, actionName)
  }

  getAnchorEl = () => {
      if (this.anchorElRef) {
        return this.anchorElRef.current
      }
      
      return null
  }

  handleMenuClose = () => {
    this.setState({
        isMenuOpen: false
    })
  }

  componentWillMount() {
      this._updateState()
  }

  componentWillReceiveProps() {
      this._updateState()
  }

  render() {
    const { classes } = this.props;
    
    if (this.state.isMenu) {
        let anchorEl = <a ref={this.anchorElRef} href="#/" className={classes.link} onClick={this.handleClick}>{this.props.children}</a>

        let ind = 0
        let items = []
        let variables = this.props.variables || []
        this.state.actions.forEach(a => {
            ind++


            let title = StringUtils.replaceVariablesInText(variables, configurationStore.configuration.actions[a].text || a)

            items.push(
                <MenuItem key={"clickMenuItem" + ind} onClick={(e) => {this.handleMenuItemClick(e, a)}}>{title}</MenuItem>
            )
        })

        return <div className={classes.hasMenuRoot}>
            {anchorEl}
            <Menu
            anchorEl={this.getAnchorEl}
            open={this.state.isMenuOpen}
            onClose={this.handleMenuClose}
            >
                {items}
            </Menu>
        </div>
    }

    return <a href="#/" className={classes.link} onClick={this.handleClick}>{this.props.children}</a>
  }

  _updateState() {
    let nextActionNames = (this.props.nextActionName || "").split(',')

    this.setState({
        isMenu: nextActionNames.length > 1,
        actions: nextActionNames
    })
  }
}

export default withStyles(styles)(ActionLink);