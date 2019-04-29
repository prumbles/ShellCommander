import React from 'react';
import TableResult from './TableResult'
import Typography from '@material-ui/core/Typography';

const styles = {
    metaCont: {
        marginTop: '8px'
    },
    meta: {
        marginRight: '8px'
    }
}

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
        let ind = 0;

        [false,true].forEach(renderGrids => {
            Object.keys(actionResponse.value).forEach(k => {
                let val = actionResponse.value[k]
                ind++
                let isGrid = Array.isArray(val)

                if (isGrid && renderGrids) {
                    elements.push(this._getJsonArrayGrid(action, val, k, 'arrayGrid' + ind.toString()))
                } else if (!isGrid && !renderGrids) {
                    let convertedVal = ResultCreator._safeToString(val)
                    elements.push(<div style={styles.metaCont} key={'plainval' + ind.toString()}>
                        <Typography color="secondary" inline={true} variant="subheading" style={styles.meta}>{k}</Typography><Typography color="textPrimary" inline={true} variant="body1">{convertedVal}</Typography>
                        </div>)
                }
            })
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

    static _isPositiveInteger(s) {
        return /^\+?[1-9][\d]*$/.test(s);
    }

    static _queryObject(obj, query) {
        let items = query.split('.')
        let ptr = obj

        items.forEach(item => {
            let itm = item
            let next = null
            if (ResultCreator._isPositiveInteger(itm)) {
                next = parseInt(itm)
            } else {
                next = ptr[itm]
            }

            if (next) {
                ptr = next
            } else {
                return ptr
            }
        })

        return ptr
    }


    static _getRowKeyValue(row, rowKey) {
        let keyValue = row[rowKey]

        return ResultCreator._safeToString(keyValue)
    }

    static _getJsonArrayGrid = (action, rows, arrayName, gridKey) => {
        let data = {
            headers: [],
            rows: [],
            rawRows: [],
            action: action,
            arrayName: arrayName,
            clicks:[]
        }

        let id = 0

        let headerIndexMap = {}

        if (rows.length > 0) {
            Object.keys(rows[0]).forEach((k,i) => {
                data.headers.push({
                    text: k
                })
                data.clicks.push(null)

                headerIndexMap[k] = i
            })
        }

        data.headerIndexMap = headerIndexMap

        rows.forEach(row => {
            let formattedRow = {
                _id: 'row' + id++,
                values: []
            }

            let keys = Object.keys(row)
            for(let i=0;i<keys.length;i++) {
                formattedRow.values.push("")
            }

            keys.forEach(rowKey => {
                let headerIndex = headerIndexMap[rowKey]
                if (typeof headerIndex !== 'undefined') {
                    formattedRow.values[headerIndex] = ResultCreator._getRowKeyValue(row, rowKey)
                    let arrConfig = action.arrays[arrayName]
                    if (arrConfig) {
                        if (arrConfig.clicks[rowKey]) {
                            data.clicks[headerIndex] = arrConfig.clicks[rowKey]
                        }
                    }
                }
            })

            data.rows.push(formattedRow)
            data.rawRows.push(row)
        })        

        return <TableResult data={data} key={gridKey}></TableResult>
    }

    static _getDelimitedTextGrid = (action, actionResponse) => {
        let data = {
            rows: [],
            clicks: action.clicks,
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
        return <p>
            {actionResponse.value}
        </p>
    }

    static  _getErrorText = (action, actionResponse) => {
        return <pre style={{color:'red'}}>
            {actionResponse.error}
        </pre>
    }
}

export default ResultCreator