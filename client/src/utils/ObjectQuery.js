import StringUtils from './StringUtils'

class ObjectQuery {
    static find(obj, query) {
        let items = query.split('.')
        let ptr = obj

        for (let i=0;i< items.length; i++) {
            let item = items[i]
            let next = null
            if (ObjectQuery._isPositiveInteger(item)) {
                next = ptr[parseInt(item)]
            } else {
                next = ptr[item]
            }

            if ( (typeof next !== 'undefined') && next !== null) {
                ptr = next
            } else {
                return ""
            }
        }

        return ptr
    }

    static getObjectVariables(obj) {
        let variables = []

        if (typeof obj === 'object') {
            Object.keys(obj).forEach(k => {
                if (!Array.isArray(obj[k])) {
                    variables.push({
                        text: k,
                        value: StringUtils.anyToString(obj[k])
                    })
                }
            })
        }

        return variables
    }

    static _isPositiveInteger(s) {
        return /^\+?[0-9][\d]*$/.test(s);
    }
}

export default ObjectQuery