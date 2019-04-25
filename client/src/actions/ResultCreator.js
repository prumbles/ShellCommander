import React from 'react';
import TableResult from './TableResult'

class ResultCreator {
    static getComponent = (action, actionResponse) => {
        if (actionResponse.error) {
            return this._getErrorText (action, actionResponse)
        }

        if (action.type === 'json') {

        } else if (action.type === 'raw') {
            return this._getRawText (action, actionResponse)
        } else {
            return this._getDelimitedTextGrid (action, actionResponse)
        }
    }

    static _getJsonComponent = (action, actionResponse) => {
        return <pre>
            {JSON.stringify(actionResponse.value)}
        </pre>
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