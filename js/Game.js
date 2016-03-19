
/************ GAME LOGIC ************/

Game = function() {

    var simonOn             = false;    // switch ON or OFF
    var strict              = false;    // strict mode ON or OFF
    var colors              = ['green', 'red', 'blue', 'yellow'];
    var turn                = 'pc';
    var pcColorsStack       = [];       // Colors pressed by PC
    var eventsStack         = [];       // PC colors that still have to beep
    var checkStack          = [];       // helper array for checking human presses
    var count               = 0;
    var humanTimerId;                   // timer to control that human acts on time
    var festivalMode        = false;    // activate round of beeps when turn on, win or loose


    /*
     * Getter for count.
     * Returns number as string properly formatted.
     */
    var getCount = function() {
        return ('0' + count).slice(-2);
    };

    /*
     *  Getter for turn.
     */
    var getTurn = function() {
        return turn;
    };

    /*
     *  Getter for simonOn.
     */
    var isSimonOn = function() {
        return simonOn;
    };

    /*
     *  Setter for simonOn.
     */
    var setSimonOn = function(boolean) {
        simonOn = boolean;
        count = '--';
        if (boolean) triggerFestivalMode();
    };

    /*
     *  Setter for strict.
     */
    var setStrict = function(boolean) {
        strict = boolean;
    };

    var getFestivalMode = function() {
        return festivalMode;
    };


    /*
     *  Starts a new game. Resets variables and gives turn to PC.
     */
    var start = function() {

        festivalMode        = false;
        strict              = false;
        count               = 0;
        turn                = 'pc';
        pcColorsStack       = [];
        eventsStack         = [];
        checkStack          = [];
        pcTurn();
    };

    /**
     * Festival mode is a round of colors and beeps when starting Simon, winning or loosing.
     */
    var triggerFestivalMode = function() {
        eventsStack = ['green', 'red', 'blue', 'yellow', 'green', 'red', 'blue'];
        festivalMode = true;
        manageEvent();
        //$elements.lights.click();
    };


    /*
     *  A dispatcher of events:
     *  If it's PC turn and PC still has to beep, sends a new click event.
     *  If it's HUMAN turn, dispatches execution to humanTurn method.
     */
    var manageEvent = function(colorClicked) {

        if (festivalMode) {
            if (eventsStack.length > 0) {
                $colors[eventsStack.shift()].click();
            } festivalMode = 'false';
        }

        else if (turn === 'pc') {
            if (eventsStack.length > 0) {
                $colors[eventsStack.shift()].click();
            } else humanTurn();
        } else {
            //humanColorsStack.push(colorClicked);
            humanTurn(colorClicked);
        }
    };


    var humanError = function() {
        $elements.count.innerHTML = '!!';
        clearTimeout(humanTimerId);
        setTimeout(function() {
            if (strict) {
                console.log('Strict mode : starting again');

            } else {
                turn = 'pc';
                eventsStack = pcColorsStack.slice();
                checkStack  = pcColorsStack.slice();
                manageEvent();
            }
        }, 2000);

    };

    /*
     *  Starts a new PC turn, adding a new random color to PC stack
     *  and triggers a new beep event chain for PC.
     */
    var pcTurn = function() {

        turn    = 'pc';
        count++;
        if (count > 20) humanWins();

        pcColorsStack.push( colors[Math.floor(Math.random() * 4)] );
        eventsStack = pcColorsStack.slice();
        checkStack = pcColorsStack.slice();
        manageEvent();
    };


    var humanWins = function() {
        triggerFestivalMode();
        console.log('HUMAN WINS');
        start();
    };

    var startTimeout = function() {
        return setTimeout(function() {
            console.log('human timeout');
            humanError();
        }, 3000);
    };


    /*
     *  Controls that human clicks a color, putting it in HUMAN stack,
     *  and manages a timeout to make sure human acts on time.
     */
    var humanTurn = function(color) {

        turn = 'human';
        if(!color) humanTimerId = startTimeout();

        else if (color === checkStack.shift()) {
            clearTimeout(humanTimerId);
            if (checkStack.length === 0) pcTurn();
            else humanTimerId = startTimeout();
        } else {
            clearTimeout(humanTimerId);
            console.log('HUMAN ERROR');
            humanError();
        }
    };


    /*
     *  Public methods.
     */
    return {
        isSimonOn:          isSimonOn,
        setSimonOn:         setSimonOn,
        setStrict:          setStrict,
        getFestivalMode:    getFestivalMode,
        getTurn:            getTurn,
        start:              start,
        getCount:           getCount,
        manageEvent:        manageEvent
    }

};  // Game()