class store {
    constructor() {
        this._nextId = 0;
        this._registries = {}
    }

    registerStoreChange = (comp, events) => {
        comp.storeId = "storeId" + this._nextId
        let eventObj = {
            comp: comp,
            events: {}
        }
        this._registries[comp.storeId] = eventObj

        events.forEach((e) => {
            if (typeof e === 'string') {
                eventObj.events[e] = true
            } else {
                eventObj.events[e.event] = e.callback
            }
            
        })

        this._nextId++;

        if (this._nextId > 999999) {
            this._nextId = 0;
        }
    }

    deregisterStoreChange = (comp) => {
        delete this._registries[comp.storeId]
    }

    get loading() {
        return this._loading || false
    }

    _emitChange = (evt) => {
        let uniqueComps = {}

        Object.keys(this._registries).forEach((r) => {
            let reg = this._registries[r]
            if(reg.events[evt]) {
                uniqueComps[r] = true

                if (reg.events[evt] !== true) {
                    //this must be a callback if not 'true'
                    reg.events[evt]()
                }
            }
        })

        Object.keys(uniqueComps).forEach(c => {
            this._registries[c].comp.forceUpdate()
        })
    }
}

export default store