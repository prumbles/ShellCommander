import data from './data'
const _N = null

const defaultConfig = {
    contextItems: [
        {
            text: 'us-east-1',
            variables: {
                region: 'us-east-1'
            }
        },
        {
            text: 'us-west-2',
            variables: {
                region: 'us-west-2'
            }
        },
        {
            text: 'eu-west-2',
            variables: {
                region: 'eu-west-2'
            }
        }
    ],
    tabs: [
        {
            text: 'Sample Commands',
            items: [
                {
                    text: 'ls',
                    action: 'ls'
                },
                {
                    text: 'ls Plus',
                    action: 'lsPlus'
                },
                {
                    text: 'top',
                    action: 'top'
                },
                {
                    text: 'top (Enhanced)',
                    action: 'topEnhanced'
                },
                {
                    text: 'Songs',
                    action: 'songs'
                },
                {
                    text: 'MLB Data',
                    action: 'mlbData'
                },
                {
                    text: 'MLB Data (Modified)',
                    action: 'mlbData2'
                },
                {
                    text: 'Admin Information',
                    action: 'getAdmin'
                }
            ]
        }
    ],
    actions: {
        "process": {
            text: "Process {{pid}}",
            shell: `
                ps -Flww -p {{pid}}
            `,
            type: 'raw'
        },
        "top": {
            text: 'Resource Usage',
            shell: `
                top -b -n1
            `,
            type: 'raw'
        },
        "topEnhanced": {
            text: "Resource Usage",
            shell: `
                top -b -n1 | grep 'PID USER' -A 200
            `,
            delimiter: "\\s+",
            variables: [_N,'pid',_N,_N,_N,_N,_N,_N,_N,_N,_N,_N],
            clicks: [_N,'process',_N,_N,_N,_N,_N,_N,_N,_N,_N,_N]
        },
        "catFromLs": {
            text: '{{filename}}',
            shell: `
                path="{{path}}"

                if [ -z $path ]; then
                    path="./"
                fi
                cat \${path}/"{{filename}}"
            `,
            type: 'raw'
        },
        "ls": {
            text: 'ls',
            inputs: ['path'],
            shell: `
                ls {{path}}
            `,
            delimiter: null,
            variables: ['filename'],
            clicks: ['catFromLs']
        },
        "lsPlus": {
            text: 'ls',
            inputs: ['path'],
            shell: `
                ls -ltra {{path}}
            `,
            delimiter: "\\s+",
            variables: [_N,_N,_N,_N,_N,_N,_N,_N,'filename'],
            clicks: [_N,_N,_N,_N,_N,_N,_N,_N,'catFromLs']
        },
        "songs" : {
            text: 'Songs',
            shell: `
                cat cli-samples/aws/dynamodb/dynamodb-songs-{{region}}
            `,
            type: 'json',
            arrays: {
                "Items": {
                    clicks: {
                        'Artist': 'artist'
                    },
                    variables: {
                        'artist': 'Artist.S'
                    }
                }
            }
        },
        "artist" : {
            text: '{{artist}}',
            shell: `
                cat "cli-samples/text/{{artist}}.txt"
            `,
            type: 'raw'
        },
        "mlbData" : {
            text: 'MLB Data',
            shell: `
                cat cli-samples/random/mlb.json
            `,
            type: 'json',
            arrays: {
                "result": { 
                    clicks: {
                        'name': 'teamWiki'
                    },
                    variables: {
                        'team': 'name',
                        'manager': 'current_manager.name'
                    },
                    omit: ['/common/topic/image','type','/sports/sports_team/team_mascot'],
                    add: {
                        'Manager': 'current_manager.name->managerWiki',
                        'Field': '/sports/sports_team/arena_stadium.1.name'
                    }
                }
            }
        },
        "mlbData2" : {
            text: 'MLB Data',
            shell: `
                cat cli-samples/random/mlb.json
            `,
            type: 'json',
            arrays: {
                "result": { 
                    clicks: {
                        'name': 'teamWiki'
                    },
                    variables: {
                        'team': 'name',
                        'manager': 'current_manager.name'
                    },
                    omit: ['*'],
                    add: {
                        'Manager': 'current_manager.name->managerWiki',
                        'Field': '/sports/sports_team/arena_stadium.1.name'
                    }
                }
            }
        },
        "teamWiki" : {
            text: '',
            url: 'https://en.wikipedia.org/wiki/{{team}}',
            type: 'url'
        },
        "managerWiki" : {
            text: '',
            url: 'https://en.wikipedia.org/wiki/{{manager}}',
            type: 'url'
        },
        "getAdmin" : {
            text: 'Admin info',
            shell: `
                cat cli-samples/random/getAdmin.json
            `,
            type: 'json',
            omit: ['age'],
            arrays: {
                "rights": { },
                "activity": { }
            }
        }
    }
};

class configuration {
    static get KEY() {
        return 'shellCommanderConfig'
    }

    constructor() {
        this._refreshConfig()
    }

    set(config) {
        if (typeof config === 'string') {
            config = JSON.parse(config)
        }

        data.setObject(configuration.KEY, config)
        this.config = config
    }

    getConfig() {
        return this.config
    }

    _refreshConfig() {
        this.config = (data.getObject(configuration.KEY)) || defaultConfig
    }
}

export default configuration