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
            text: 'Sample Bash Commands',
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
                }
            ]
        },
        {
            text: 'AWS CLI-style commands',
            items: [
                {
                    text: 'DynamoDB - Get list of songs',
                    action: 'songs'
                }
            ]
        },
        {
            text: 'Random',
            items: [
                {
                    text: 'MLB Data',
                    action: 'mlbData'
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
                        'team': 'name'
                    },
                    omit: ['/common/topic/image','type','/sports/sports_team/team_mascot']
                }
            }
        },
        "teamWiki" : {
            text: '',
            url: 'https://en.wikipedia.org/wiki/{{team}}',
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