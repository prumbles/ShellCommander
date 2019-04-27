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
            text: 'General Bash Commands',
            items: [
                {
                    text: 'ls',
                    action: 'ls'
                },
                {
                    text: 'ls Plus',
                    action: 'lsPlus'
                }
            ]
        },
        {
            text: 'AWS CLI (JSON Response)',
            items: [
                {
                    text: 'DynamoDB - Get list of songs',
                    action: 'songs'
                }
            ]
        }
    ],
    actions: {
        "catFromLs": {
            shell: `
            path="{{path}}"

            if [ -z $path ]; then
                path="./"
            fi
            cat \${path}/{{filename}}
            `,
            type: 'raw'
        },
        "ls": {
            inputs: ['path'],
            shell: `
                ls {{path}}
            `,
            delimiter: null,
            variables: ['filename'],
            clicks: ['catFromLs']
        },
        "lsPlus": {
            inputs: ['path'],
            shell: `
                ls -ltra {{path}}
            `,
            delimiter: "\\s+",
            variables: [_N,_N,_N,_N,_N,_N,_N,_N,'filename'],
            clicks: [_N,_N,_N,_N,_N,_N,_N,_N,'catFromLs']
        },
        "songs" : {
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
            shell: `
                cat "cli-samples/text/{{artist}}.txt"
            `,
            type: 'raw'
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