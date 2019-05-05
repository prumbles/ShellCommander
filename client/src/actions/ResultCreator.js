import React from 'react';
import TableResult from './TableResult'
import Typography from '@material-ui/core/Typography';
import StringUtils from '../utils/StringUtils'
import Query from '../utils/ObjectQuery'
import ActionLink from './ActionLink'

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
            let responseBaseVariables = Query.getObjectVariables(actionResponse.value)
            Object.keys(actionResponse.value).sort().forEach(k => {
                let val = actionResponse.value[k]
                ind++
                let isGrid = Array.isArray(val)

                //set isGrid to false if it is an array of primitives
                if (isGrid) {
                    if (val.length === 0 || (typeof val[0] !== 'object')) {
                        isGrid = false
                    }
                }

                if (isGrid && renderGrids) {
                    elements.push(this._getJsonArrayGrid(action, val, k, 'arrayGrid' + ind.toString()))
                } else if (!isGrid && !renderGrids) {
                    let omitMap = ResultCreator._getOmitMap(action.omit)

                    if (!omitMap[k]) {
                        let convertedVal = StringUtils.anyToString(val)
                        let key = 'plainval' + ind.toString()
                        let valueObject = null
                        if (action.clicks && action.clicks[k]) {
                            valueObject = <ActionLink style={styles.metaCont} variables={responseBaseVariables} nextActionName={action.clicks[k]}>{convertedVal}</ActionLink>
                        } else {
                            valueObject = <Typography  style={styles.metaCont} color="textPrimary" inline={true} variant="body1">{convertedVal}</Typography>
                        }

                        elements.push(<div style={styles.metaCont} key={key}>
                                <Typography color="secondary" inline={true} variant="subheading" style={styles.meta}>{k}</Typography>
                                {valueObject}
                            </div>)
                    }
                }
            })
        })

        return <div>
                {elements}
            </div>
    }

    static _getRowKeyValue(row, rowKey) {
        let keyValue = row[rowKey]

        return StringUtils.anyToString(keyValue)
    }

    static _getOmitMap(omitArray) {
        let omitMap = {}

        if (omitArray) {
            omitArray.forEach(o => {
                omitMap[o] = true
            })
        }

        return omitMap
    }

    static _getAddedColumnData(arrConfig) {
        if (arrConfig && arrConfig.add) {
            let data = []
            //Add the columns from the "add" parameter
            Object.keys(arrConfig.add).forEach((k) => {
                let addParts = arrConfig.add[k].split('->')
                let click = null

                if (addParts.length > 1) {
                    click = addParts[1]
                }

                let col = {
                    text: k,
                    path: addParts[0],
                    click: click
                }

                data.push(col)
            })

            return data
        }

        return []
    }

    static _getJsonArrayGrid = (action, rows, arrayName, gridKey) => {
        let arrConfig = action.arrays ? action.arrays[arrayName] : ( action.array || null )

        let data = {
            headers: [],
            rows: [],
            action: action,
            arrayName: arrayName,
            clicks:[]
        }

        let id = 0

        let headerIndexMap = {}

        let addedColumns = []

        if (rows.length > 0) {
            let headerInd = 0
            let omitMap = ResultCreator._getOmitMap(arrConfig ? arrConfig.omit : null)
            
            if (!omitMap['*']) { //if we have a * indicating to omit all columns, then skip all
                Object.keys(rows[0]).forEach((k) => {
                    if (!omitMap[k]) {
                        data.headers.push({
                            text: k
                        })
                        
                        data.clicks.push(null)

                        if (arrConfig && arrConfig.clicks && arrConfig.clicks[k]) {
                            data.clicks[headerInd] = arrConfig.clicks[k]
                        }

                        headerIndexMap[k] = headerInd
                        headerInd++
                    }
                })
            }

            addedColumns = ResultCreator._getAddedColumnData(arrConfig)

            addedColumns.forEach(c => {
                data.headers.push({
                    text: c.text
                })

                data.clicks.push(c.click)
            })
        }

        data.headerIndexMap = headerIndexMap

        rows.forEach(row => {
            let formattedRow = {
                _id: 'row' + id++,
                rawRow: row,
                values: []
            }

            //populate regular column cells (minus added columns)
            let regularColCnt = data.headers.length - addedColumns.length
            while(regularColCnt > 0) {
                formattedRow.values.push("")
                regularColCnt--
            }
            let keys = Object.keys(row)
            keys.forEach(rowKey => {
                let headerIndex = headerIndexMap[rowKey]
                if (typeof headerIndex !== 'undefined') {
                    formattedRow.values[headerIndex] = ResultCreator._getRowKeyValue(row, rowKey)
                }
            })

            addedColumns.forEach(c => {
                formattedRow.values.push(StringUtils.anyToString(Query.find(row, c.path)))
            })

            data.rows.push(formattedRow)
        })        

        return <TableResult data={data} key={gridKey}></TableResult>
    }

    static _getDelimitedTextGrid = (action, actionResponse) => {
        let value = actionResponse.value
        let transform = action.transform || {}
        transform.start = transform.start || 0
        transform.end = transform.end || value.length
        transform.replace = transform.replace || [{
            text: '\\n\\s+',
            with: '\n'
        }]
        transform.rowDelimiter = transform.rowDelimiter || '\\n'
        transform.rowFilter = transform.rowFilter || null
        transform.colDelimiter = transform.colDelimiter || '\\s+'
        transform.hasHeaders = (typeof transform.hasHeaders === 'undefined') ? false : transform.hasHeaders

        let matches = null

        //first keep only the text that is defined by the start and end properties
        let start = 0
        let end = value.length
        if (transform.start) {
            matches = value.match(new RegExp(transform.start))
            if (matches) {
                start = matches.index
            }
        }

        if (transform.end) {
            matches = value.match(new RegExp(transform.end))
            if (matches) {
                end = matches.index
            }
        }

        value = value.substring(start, end)

        //next, replace all text given by 'replace'
        if (transform.replace) {
            transform.replace.forEach(replace => {
                value = value.replace(new RegExp(replace.text, 'g'), replace.with)
            })
        }

        //get all rows using the row delimiter
        let valueRows = value.split(new RegExp(transform.rowDelimiter))

        //filter rows if row match 'filterRow'
        if (transform.rowFilter) {
            let filterRowRegex = new RegExp(transform.rowFilter)
            for (let i = valueRows.length-1; i>=0; i--) {
                let row = valueRows[i]

                if (row.match(filterRowRegex)) {
                    valueRows.splice(i, 1)
                }
            }
        }

        let delimiter = transform.colDelimiter ? (new RegExp(transform.colDelimiter)) : null
        let jsonRows = []
        let jsonColumnToKeyMap = []

        valueRows.forEach((row, rowIndex) => {
            let rowValues = []

            if (delimiter) {
                rowValues = row.split(delimiter)
            } else {
                rowValues = [row]
            }

            if (rowIndex === 0) {
                rowValues.forEach((rv, i) => {
                    jsonColumnToKeyMap.push(transform.hasHeaders ? rv : ('COL' + (i + 1).toString()))
                })
            }

            if (rowIndex > 0 || !transform.hasHeaders) {
                let jsonRow = {}

                rowValues.forEach((rv, i) => {
                    let key = jsonColumnToKeyMap[i]

                    if (key) {
                        jsonRow[key] = rv
                    }
                })

                jsonRows.push(jsonRow)
            }
            
        })

        return this._getJsonComponent(action, {
            value: {
                Items: jsonRows
            }
        })
    }

    static  _getRawText = (action, actionResponse) => {
        let style = {
            whiteSpace: "pre",
            fontFamily: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace'
        }

        actionResponse.value = actionResponse.value.split('\t').join('&nbsp;&nbsp;&nbsp;&nbsp;')

        return <p>
            <span style={style}>{actionResponse.value}</span>
        </p>
    }

    static  _getErrorText = (action, actionResponse) => {
        return <pre style={{color:'red'}}>
            {actionResponse.error}
        </pre>
    }
}

export default ResultCreator
