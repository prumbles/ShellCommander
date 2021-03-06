import data from './data'

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
            type: 'raw',
			"clicks": [
				{
					"regex": "(?<=\\n\\s*)\\d+",
					"action": "process(pid=selection)"
				}
			]
        },
        "topEnhanced": {
            text: "Resource Usage",
            shell: `
                top -b -n1
            `,
            transform: {
                start: 'PID USER ',
                end: 'null',
                replace: [{
                    text: '(\\n\\s+)',
                    with: '\n'
                }],
                rowDelimiter: '\\n',
                rowFilter: '^\\s+$',
                colDelimiter: '\\s+',
                hasHeaders: true
            },
            array: {
                clicks: {
                    'PID': 'process'
                },
                variables: {
                    'pid': 'PID'
                }
            }
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
            array: {
                clicks: {
                    'COL1': 'catFromLs'
                },
                variables: {
                    'filename': 'COL1'
                }
            }
        },
        "lsPlus": {
            text: 'ls',
            inputs: ['path=cli-samples/text/'],
            shell: `
                ls -ltra {{path}} | sed '/^total/d'
            `,
            array: {
                clicks: {
                    'COL9': 'catFromLs'
                },
                variables: {
                    'filename': 'COL9'
                }
            }
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
                        'name': 'wiki(term=team)'
                    },
                    variables: {
                        'team': 'name',
                        'manager': 'current_manager.name'
                    },
                    omit: ['/common/topic/image','type','/sports/sports_team/team_mascot'],
                    add: {
                        'Manager': 'current_manager.name->wiki(term=manager)',
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
                        'name': 'wiki(term=team)'
                    },
                    variables: {
                        'team': 'name',
                        'manager': 'current_manager.name'
                    },
                    omit: ['*'],
                    add: {
                        'Team': 'name',
                        'Manager': 'current_manager.name->wiki(term=manager),search(term=manager)',
                        'Field': '/sports/sports_team/arena_stadium.1.name',
                        'Wins': 'team_stats.0.wins'
                    }
                }
            }
        },
        "wiki" : {
            text: 'Wikipedia: {{term}}',
            url: 'https://en.wikipedia.org/wiki/{{term}}',
            type: 'url'
        },
        "definition" : {
            text: 'Dictionary: {{term}}',
            url: 'https://www.dictionary.com/browse/{{term}}',
            type: 'url'
        },
        "search" : {
            text: 'Search for "{{term}}"',
            url: 'https://www.google.com/search?q={{term}}',
            type: 'url'
        },
        "getAdmin" : {
            text: 'Admin info',
            shell: `
                cat cli-samples/random/getAdmin.json
            `,
            type: 'json',
            omit: ['age'],
            clicks: {
                'name': 'definition(term=name),wiki(term=name)'
            },
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