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

  _extractActionName = (fullActionName) => {
    if (fullActionName.indexOf('(') > 0) {
      let parts = fullActionName.split('(')

      return parts[0]
    }

    return fullActionName
  }

  handleClick = event => {
    event.preventDefault()

    if(this.state.isMenu) {
        this.setState({
            isMenuOpen: true
        })
    } else {
        configurationStore.selectNextAction(this._addClickVariables(this.props.variables, this.props.nextActionName), 
          this._extractActionName(this.props.nextActionName))
    }
  }

  handleMenuItemClick = (event, actionName) => {
    this.setState({
        isMenuOpen: false
    })
    configurationStore.selectNextAction(this._addClickVariables(this.props.variables, actionName), 
      this._extractActionName(actionName))
  }

  _addClickVariables = (variables, fullActionName) => {
    let v = this._getClickVariables(fullActionName)

    return variables.slice(0).concat(v)
  }

  _getClickVariables = (fullActionName) => {
    let variables = []

    let parts = fullActionName.split('(')
    if (parts.length> 1) {
      let aliases = parts[1].split(')')[0].split('&') //fullActionName in format of: myAction(var1=othervariable1&var2=othervariable2)

      aliases.forEach(alias => {
        let aliasPair = alias.split('=')
        let existingVariable = this.props.variables.find(v => {
          return v.text === aliasPair[1] 
        })

        if (existingVariable) {
          variables.push({
            text: aliasPair[0],
            value: existingVariable.value
          })
        }
      })
    }

    return variables
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

        if (this.state.isMenuOpen) {
          let variables = this.props.variables
          
          this.state.actions.forEach(a => {
              ind++
              let actionName = a

              if (a.indexOf('(') > 0) {
                  let clickParts = a.split('(')
                  actionName = clickParts[0]
              }

              let title = StringUtils.replaceVariablesInText(this._addClickVariables(variables, a), configurationStore.configuration.actions[actionName].text || actionName)

              items.push(
                  <MenuItem key={"clickMenuItem" + ind} onClick={(e) => {this.handleMenuItemClick(e, a)}}>{title}</MenuItem>
              )
          })
        }

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
        actions: nextActionNames,
        variables: this.props.variables || []
    })
  }
}

export default withStyles(styles)(ActionLink);