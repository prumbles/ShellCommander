class StringUtils {
    static anyToString(x) {
        switch (typeof x) {
            case 'object':
                return JSON.stringify(x)
            case 'function':
                return 'function'
            default:
                return x + ''
        }
    }

    static replaceVariablesInText = (variables, text) => {
        variables.forEach(v => {
            text = text.split("{{" + v.text + "}}").join(v.value)
        })

        return text
    }
}

export default StringUtils