import configurationData from '../data/configuration'
import store from './store'
import data from '../data/data'
import StringUtils from '../utils/StringUtils'

class configurationStore extends store {
    constructor() {
        super()
        this._data = new configurationData()
        this._configuration = this._data.getConfig()
        this._refreshData()
    }

    get configuration() {
        return this._configuration
    }

    get selectedContext() {
        return this._selectedContext
    }

    get selectedTab() {
        return this._selectedTab
    }

    get selectedTabItem() {
        return this._selectedTabItem
    }

    get selectedAction() {
        return this._selectedAction
    }

    get actionResponse() {
        return this._actionResponse
    }

    get actionChain() {
        return this._actionChain
    }

    get loading() {
        return this._loading
    }

    get editingAction() {
        return this._editingAction
    }

    updateCurrentAction = () => {
        this._emitChange('calculateEditingAction')
        this.updateAction(this.selectedAction, this.editingAction)
    }

    setEditingAction = (action) => {
        this._editingAction = action
    }

    updateAction = (action, newAction) => {
        Object.keys(action).forEach(oldKey => {
            delete action[oldKey]
        })

        Object.keys(newAction).forEach(key => {
            action[key] = newAction[key]
        })

        this._data.set(this._configuration)
        this._emitChange('selectedActionUpdate')
    }


    
    updateConfiguration = (config) => {
        this._data.set(config)
        this._configuration = this._data.getConfig()
        this._refreshData()
        this._emitChange('configuration')
        this._emitChange('context')
        this._emitChange('selectedTab')
        this._emitChange('selectedTabItem')
        this._emitChange('selectedAction')
    }

    selectContext = (context) => {
        this._selectedContext = context
        this._emitChange('context')
    }

    selectContextByText = (contextText) => {
        this._selectedContext = this._configuration.contextItems.find((i) => {
            return i.text === contextText
        })
        this._emitChange('context')
        this._selectedTabItem = null
        this._emitChange('selectedTabItem')
        this._selectedAction = null
        this._actionChain = []
        this._emitChange('selectedAction')
        this._actionResponse = null
        this._emitChange('actionResponse')
    }

    selectTabByText = (tabText) => {
        this._selectedTab = this._configuration.tabs.find((t) => {
            return t.text === tabText
        })
        this._emitChange('selectedTab')
        this._selectedTabItem = null
        this._emitChange('selectedTabItem')
        this._selectedAction = null
        this._actionChain = []
        this._emitChange('selectedAction')
        this._actionResponse = null
        this._emitChange('actionResponse')
    }

    selectTabItemByText = (tabItemText) => {
        this._selectedTabItem = this._selectedTab.items.find((t) => {
            return t.text === tabItemText
        })
        this._emitChange('selectedTabItem')
        this.selectAction(this._selectedTabItem)
    }

    selectAction = (action, variables) => {
        this._clearVariables()
        this._selectAction(action, variables)
    }

    selectNextAction = (variables, nextActionName) => {
        let nextAction = this._configuration.actions[nextActionName]

        this._selectAction(nextAction, variables)
    }

    selectPreviousAction = (chainItem) => {
        for (let i=this._actionChain.length-1; i>=0; i--) {
            if (chainItem === this._actionChain[i]) {
                this._actionResponse = chainItem.response
                this._emitChange('actionResponse')
                this._selectedAction = chainItem.action
                this._emitChange('selectedPreviousAction')
                return
            }

            this._actionChain.pop()
        }
    }

    _selectAction = (action, variables) => {
        if (action.text && action.action) {
            //We are not in a real action, but a tab that points to an action

            action = this._configuration.actions[action.action]
        }

        if (action.type === 'url') {
            window.open(StringUtils.replaceVariablesInText(variables || [], action.url))
            return
        }

        let actionChainItem = {
            _id: 'chainItem' + this._actionChain.length,
            action: action,
            response: null,
            variables: variables || [],
            inputVariables: [],
            text: StringUtils.replaceVariablesInText(variables || [], action.text)
        }
        
        this._actionChain.push(actionChainItem)   
        
        this._actionResponse = null
        this._emitChange('actionResponse')
        this._selectedAction = action
        this._emitChange('selectedAction')     
    }

    _getPreviousVariables = (action) => {
        let variables = []
        for (let i=0;i<this._actionChain.length;i++) {
            let item = this._actionChain[i]

            if (item.action === action) {
                return variables
            }

            item.variables.forEach(v => {
                variables.push(v)
            })

            item.inputVariables.forEach(v => {
                variables.push(v)
            })
        }

        return variables
    }

    runSelectedAction = (inputValues) => {
        let action = this._selectedAction

        if (action) {
            let chainItem = this.getActionChainItem(action)
            let actionForShellExec = this._copyAction(action)

            //Get all variables (including the context) and run shell action with replaced variables
            let allVariables = []

            if (this._actionRequiresInput(action)) {
                //get the variables from the input values for the selected action
                chainItem.inputVariables = []
                inputValues.forEach(iv => {
                    let ivVariable = {
                        text: iv.text,
                        value: iv.value
                    }
                    allVariables.push(ivVariable)
                    chainItem.inputVariables.push(ivVariable)
                })               
            }

            // get the variables passed to the current action
            chainItem.variables.forEach(v => {
                allVariables.push(v)
            })

            // get variables from previous variables in action chain
            this._getPreviousVariables(action).forEach(v => {
                allVariables.push(v)
            })

            //get variables from the context object
            if (this.selectedContext) {
                Object.keys(this.selectedContext.variables).forEach(k => {
                    allVariables.push({
                        text: k,
                        value: this.selectedContext.variables[k]
                    })
                })
            }

            actionForShellExec.shell = StringUtils.replaceVariablesInText(allVariables, actionForShellExec.shell)
            chainItem.text = StringUtils.replaceVariablesInText(allVariables, action.text)
            
            this._loading = true
            this._emitChange('loading')
            data.runShellAction(actionForShellExec, (resp) => {

                let responseValue = resp.text

                if (!resp.error && actionForShellExec.type === 'json') {
                    responseValue = JSON.parse(resp.text)

                    if (Array.isArray(responseValue)) {
                        responseValue = {
                            Items: responseValue
                        }
                    }
                }

                this._actionResponse = {
                    value: responseValue,
                    error: resp.error,
                    valueType: actionForShellExec.type
                }
                if (chainItem) {
                    chainItem.response = this._actionResponse
                }

                this._emitChange('actionResponse')
                this._loading = false
                this._emitChange('loading')
            })
        }
    }

    getActionChainItem = action => {
        return this._actionChain.find(c => {
            return c.action === action
        })
    }

    _getActiveActionChainItem = () => {
        return this._actionChain.length > 0 ? this._actionChain[this._actionChain.length - 1] : null
    }

    _copyAction = action => {
        return {
            shell: action.shell,
            type: action.type
        }
    }

    _actionRequiresInput = (action) => {
        return action.inputs ? true : false
    }

    _refreshData = () => {
        this._selectedContext = (this._configuration.contextItems && this._configuration.contextItems.length > 0) 
            ? this._configuration.contextItems[0] : null

        this._selectedTab = (this._configuration.tabs && this._configuration.tabs.length > 0)
            ? this._configuration.tabs[0] : null

        this._selectedAction = null
        this._actionResponse = null

        this._clearVariables()

        this._loading = false
    }

    _clearVariables = () => {
        this._previousInputValues = []
        this._actionChain = []
    }
}

//There is only one global instance of configurationStore
export default new configurationStore()