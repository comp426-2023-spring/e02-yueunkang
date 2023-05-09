/**
 * RULES[player][opponent] returns the result of player vs. opponent
 */
const RULES = {
    'rock': {
        'rock': 'tie',
        'paper': 'lose',
        'scissors': 'win',
        'lizard': 'win',
        'spock': 'lose'
    },
    'paper': {
        'rock': 'win',
        'paper': 'tie',
        'scissors': 'lose',
        'lizard': 'lose',
        'spock': 'win'
    },
    'scissors': {
        'rock': 'lose',
        'paper': 'win',
        'scissors': 'tie',
        'lizard': 'win',
        'spock': 'lose'
    },
    'lizard': {
        'rock': 'lose',
        'paper': 'win',
        'scissors': 'lose',
        'lizard': 'tie',
        'spock': 'win'
    },
    'spock': {
        'rock': 'win',
        'paper': 'lose',
        'scissors': 'win',
        'lizard': 'lose',
        'spock': 'tie'
    }
};

/**
 * @param {*} shot
 * @returns JSON {player: <shot>, opponent: <random_shot>, result: 'win'|'lose'|'tie'} if called with a shot, else {player: <random_shot>}
 * @throws `RangeError` if shot is out of range
 */
export function rps(shot) {
    const options = ['rock', 'paper', 'scissors'];
    // If there is no shot parameter, the function doesn't error. shot is just undefined
    if (shot === undefined)
        return {player: options[Math.floor(Math.random() * 3)]};

    shot = shot.toLowerCase();
    if (!options.includes(shot)) {
        console.error(`${shot} is out of range.`);
        throw new RangeError(`${shot} is out of range.`);
    }

    const opponent_str = options[Math.floor(Math.random() * 3)];
    return {player: shot, opponent: opponent_str, result: RULES[shot][opponent_str]}
}

/**
 * @param {*} shot
 * @returns JSON {player: <shot>, opponent: <random_shot>, result: 'win'|'lose'|'tie'} if called with a shot, else {player: <random_shot>}
 * @throws `RangeError` if shot is out of range
 */
export function rpsls(shot) {
    const options = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
    // If there is no shot parameter, the function doesn't error. shot is just undefined
    if (shot === undefined)
        return {player: options[Math.floor(Math.random() * 5)]};

    shot = shot.toLowerCase();
    if (!options.includes(shot)) {
        console.error(`${shot} is out of range.`);
        throw new RangeError(`${shot} is out of range.`);
    }

    const opponent_str = options[Math.floor(Math.random() * 5)];
    return {player: shot, opponent: opponent_str, result: RULES[shot][opponent_str]}
}