import React from 'react';
import TableResult from './TableResult'

class ResultCreator {
    static getComponent = (action, actionResponse) => {
        if (actionResponse.error) {
            return this._getErrorText (action, actionResponse)
        }

        if (action.type === 'json') {
            return this._getJsonComponent (action, actionResponse)
        } else if (action.type === 'raw') {
            return this._getRawText (action, actionResponse)
        } else {
            return this._getDelimitedTextGrid (action, actionResponse)
        }
    }

    static _getJsonComponent = (action, actionResponse) => {
        let elements = []

        Object.keys(actionResponse.value).forEach(k => {
            let val = actionResponse.value[k]

            if (Array.isArray(val)) {
                elements.push(this._getJsonArrayGrid(action, actionResponse, val))
            } else {
                let convertedVal = ResultCreator._safeToString(val)
                elements.push(<div>
                    <span>{k}</span><span>{convertedVal}</span>
                    </div>)
            }
        })

        return <div>
                {elements}
            </div>
    }

    static _safeToString(x) {
        switch (typeof x) {
          case 'object':
            return JSON.stringify(x)
          case 'function':
            return 'function'
          default:
            return x + ''
        }
      }

    static _getJsonArrayGrid = (action, actionResponse, valueArray) => {
        let data = {
            rows: [],
            action: action
        }

        let id = 0

        valueArray.forEach(item => {
            let formattedRow = {
                _id: 'row' + id++,
                values: []
            }
            Object.keys(item).forEach(k => {
                formattedRow.values.push(ResultCreator._safeToString(item[k]))    
                data.rows.push(formattedRow)
            })

            data.rows.push(formattedRow)
        })        

        return <TableResult data={data}></TableResult>
    }

    static _getDelimitedTextGrid = (action, actionResponse) => {
        let data = {
            rows: [],
            action: action
        }

        let delimiter = action.delimiter ? new RegExp(action.delimiter) : null
        let id = 0
        actionResponse.value.split('\n').forEach(row => {

            let formattedRow = {
                _id: 'row' + id++,
                values: []
            }

            if (delimiter) {
                formattedRow.values = row.split(delimiter)
            } else {
                formattedRow.values = [row]
            }

            data.rows.push(formattedRow)
        })

        return <TableResult data={data}></TableResult>
    }

    static  _getRawText = (action, actionResponse) => {
        return <pre>
            {actionResponse.value}
        </pre>
    }

    static  _getErrorText = (action, actionResponse) => {
        return <pre style={{color:'red'}}>
            {actionResponse.error}
        </pre>
    }
}

export default ResultCreator