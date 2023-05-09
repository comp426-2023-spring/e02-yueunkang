// If you would like to see some examples of similar code to make an interface interact with an API, 
// check out the coin-server example from a previous COMP 426 semester.
// https://github.com/jdmar3/coinserver

// Shot options

/**
 * Called when opponent checkbox is clicked.
 * Show or hide shot options depending on whether opponent is checked.
 * If opponent is checked but neither game is selected, assume RPS (click RPS).
 */
function displayShots() {
    let rps_checked = document.getElementById("rps").checked;
    let rpsls_checked = document.getElementById("rpsls").checked;
    if (!rps_checked && !rpsls_checked) {
        // If neither RPS nor RPSLS is checked, check RPS
        document.getElementById("rps").click();
    }
    let shot_options = document.getElementById("shot_options");
    let opponent_checked = document.getElementById("opponent").checked;
    shot_options.className = opponent_checked ? "active" : "inactive";
}

/** 
 * Called when RPS or RPSLS is clicked.
 * In either case, RPS shot options are set to active (but possibly not displayed since the shot_options
 * div may be inactive).
 * If RPSLS is checked, then RPSLS shot options are set to active and vice versa.
 */
function displayRPSLSOptions() {
    let rps_shot_options = document.getElementsByName("rps_shot_option");
    rps_shot_options.forEach(rps_shot_option => {
        rps_shot_option.className = "active"
    })

    let rpsls_checked = document.getElementById("rpsls").checked;
    let rpsls_shot_options = document.getElementsByName("rpsls_shot_option");
    rpsls_shot_options.forEach(rpsls_shot_option => {
        rpsls_shot_option.className = rpsls_checked ? "active" : "inactive";
    })
}

// Navigation buttons

/**
 * Play button
 * Hides everything except result.
 * Uses API endpoint to get result JSON and display in result element.
 */
async function play() {
    let rps_checked = document.getElementById("rps").checked;
    let rpsls_checked = document.getElementById("rpsls").checked;
    if (!rps_checked && !rpsls_checked) {
        alert("Please select a game mode.");
        throw new RangeError(`Must select game mode before playing.`);
    }
    document.getElementById("game_options").className = "inactive";
    document.getElementById("shot_options").className = "inactive";
    document.getElementById("result").className = "active";
    document.getElementById("play").className = "inactive";

    let game_mode = rps_checked ? "rps" : "rpsls";
    let opponent_checked = document.getElementById("opponent").checked;
    let shot = "";
    if (opponent_checked) {
        // name*="shot_option" means name contains "shot_option" as substring
        // i.e., both rps_shot_option and rpsls_shot_option
        // Source: https://api.jquery.com/attribute-contains-selector/
        shot = document.querySelector('input[type="radio"][name*="shot_option"]:checked').value;
    }

    let api_url = `${document.baseURI}app/${game_mode}/play/${shot}`;

    // Source: https://github.com/jdmar3/coinserver/blob/main/public/main.js line 13
    await fetch(api_url)
        .then(function(response) {
            return response.json();
        })
            .then(function(result) {
                console.log(result);
                let result_element = document.getElementById("result");
                if (opponent_checked) {
                    // NOTE: This does not render properly on GitHub.
                    // Click Raw (https://raw.githubusercontent.com/comp426-2023-spring/e02-jesse-wei/main/public/scripts.js)
                    // To see what the code actually is
                    result_element.innerHTML = `<p>You put ${capitalizeFirstLetter(result.player)}</p>
                    <p>Your opponent put ${capitalizeFirstLetter(result.opponent)}</p>
                    <p>Therefore you  ${result.result.toUpperCase()}</p>`;
                } else {
                    result_element.innerHTML = result.player.toUpperCase();
                }
            });
}

/**
 * Start over button.
 * Sets everything to default values (hardcoded).
 */
function startOver() {
    document.getElementById("game_options").className = "active";
    document.getElementById("shot_options").className = "inactive";
    document.getElementById("result").className = "inactive";
    document.getElementById("play").className = "active";
    
    // Uncheck all buttons
    document.getElementById("rps").checked = false;
    document.getElementById("rpsls").checked = false;
    document.getElementById("opponent").checked = false;
    document.getElementById("rock").checked = false;
    document.getElementById("paper").checked = false;
    document.getElementById("scissors").checked = false;
    document.getElementById("lizard").checked = false;
    document.getElementById("spock").checked = false;
}

/**
 * @param {*} string 
 * @returns string with first letter capitalized
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}