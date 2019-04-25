class data {
    static setObject(key, obj) {
        localStorage.setItem(key, JSON.stringify(obj))
    }

    static getObject(key) {
        let item = localStorage.getItem(key)

        if (item) {
            return JSON.parse(item)
        }

        return null
    }

    static runShellAction(action, cb) {
        let shell = action.shell

        fetch('api/shell', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shell: shell
            })
        })
        .then(response => response.json())
        .then(response => cb(response));
    }
}

export default data