const {program} = require('commander')
const jsTokens = require("js-tokens")
const fs = require('fs')

program
    .command('normalize:level-1')
    .argument('<filepath>')
    .action((filepath) => normalizeFileLevel1(filepath))

program
    .command('normalize:level-2')
    .argument('<filepath>')
    .action((filepath) => normalizeFileLevel2(filepath))

function normalizeFileLevel1(filepath) {
    fs.readFile(filepath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error(err)
            return
        }

        const tokens = jsTokens(fileContent);
        const normalizedTokens = normalizeTokensLevel1(tokens);

        let output = ''
        for (const token of normalizedTokens) {
            output += token.value + " "
        }

        console.log(output)
    })
}

function normalizeTokensLevel1(tokens) {
    const filteredTokens = []
    let lastToken = {'type': undefined}
    for (const token of tokens) {
        if (token.type === 'WhiteSpace') {
            continue
        }
        if (token.type === 'LineTerminatorSequence') {
            if (lastToken.type === 'LineTerminatorSequence') {
                continue
            }
            token.value = "\n"
        }
        if (token.type === 'SingleLineComment') {
            continue
        }
        if (token.type === 'MultiLineComment') {
            continue
        }
        if (token.value === "") {
            continue
        }

        lastToken = token
        filteredTokens.push(token)
    }

    return filteredTokens;
}

function normalizeFileLevel2(filepath) {
    fs.readFile(filepath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error(err)
            return
        }

        const tokens = jsTokens(fileContent);
        const level1NormalizedTokens = normalizeTokensLevel1(tokens)
        const level2NormalizedTokens = normalizeTokensLevel2(level1NormalizedTokens)

        let output = ''
        for (const token of level2NormalizedTokens) {
            output += token.value + " "
        }

        console.log(output)
    })
}

function normalizeTokensLevel2(tokens) {
    const identifierReplacementRegistry = new Map()

    const normalizedTokens = []
    for (const token of tokens) {
        let normalizedToken = token
        switch (token.type) {
            case 'NumericLiteral':
                normalizedToken = {
                    'type': token.type,
                    'value': '1',
                }
                break
            case 'StringLiteral':
                normalizedToken = {
                    'type': token.type,
                    'value': 'str',
                    'closed': token.closed
                }
                break
            case 'IdentifierName':
                const identifier = token.value

                if (identifier === 'const') {
                    break
                }

                if (identifierReplacementRegistry.get(identifier) === undefined) {
                    const replacement = "x"/* + (identifierReplacementRegistry.size)*/
                    identifierReplacementRegistry.set(identifier, replacement)
                }

                normalizedToken = {
                    'type': token.type,
                    'value': identifierReplacementRegistry.get(identifier)
                }
                break
        }

        normalizedTokens.push(normalizedToken)
    }

    return normalizedTokens;
}

program.parse()
