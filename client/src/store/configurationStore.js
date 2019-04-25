import configurationData from '../data/configuration'
import store from './store'
import data from '../data/data'

class configurationStore extends store {
    constructor() {
        super()
        this._data = new configurationData()
        this._variables = []
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

    selectAction = (action) => {
        this._clearVariables()
        this._selectAction(action)
    }

    selectNextAction = (previousVariables, previousAction, nextActionName) => {
        this._variables = previousVariables
        if (this._previousInputValues) {
            this._previousInputValues.forEach(iv => {
                this._variables.push({
                    text: iv.text,
                    value: iv.value
                })
            }) 
        }

        let nextAction = this._configuration.actions[nextActionName]

        this._selectAction(nextAction)
    }

    _selectAction = (action) => {
        if (action.text && action.action) {
            //We are not in a real action, but a tab that points to an action

            action = this._configuration.actions[action.action]
        }
        
        this._actionResponse = null
        this._emitChange('actionResponse')
        this._selectedAction = action
        this._emitChange('selectedAction')
    }

    runSelectedAction = (inputValues) => {
        let action = this._selectedAction
        this._previousInputValues = inputValues

        if (action) {

            let copiedAction = this._copyAction(action)

            //Get all variables (including the context) and run shell action with replaced variables
            let allVariables = []

            if (this._actionRequiresInput(action)) {
                //get the variables from the input values for the selected action
                inputValues.forEach(iv => {
                    allVariables.push({
                        text: iv.text,
                        value: iv.value
                    })
                })               
            }

            if (this._variables) {
                this._variables.forEach(v => {
                    allVariables.push({
                        text: v.text,
                        value: v.value
                    })
                })
            }

            //get variables from the context object
            if (this.selectedContext) {
                Object.keys(this.selectedContext.variables).forEach(k => {
                    allVariables.push({
                        text: k,
                        value: this.selectedContext.variables[k]
                    })
                })
            }

            allVariables.forEach(v => {
                copiedAction.shell = copiedAction.shell.split("{{" + v.text + "}}").join(v.value)
            })
            
            this._loading = true
            this._emitChange('loading')
            data.runShellAction(copiedAction, (resp) => {
                this._actionResponse = {
                    value: copiedAction.type === 'json' ? JSON.parse(resp.text) : resp.text,
                    error: resp.error,
                    valueType: copiedAction.type
                }
                this._emitChange('actionResponse')
                this._loading = false
                this._emitChange('loading')
            })
        }
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

        this._clearVariables()

        this._loading = false
    }

    _clearVariables = () => {
        this._variables = []
        this._previousInputValues = []
    }
}

//There is only one global instance of configurationStore
export default new configurationStore()