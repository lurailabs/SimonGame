
/************ GAME LOGIC ************/

Game = function() {

    var simonOn             = false;    // switch ON or OFF
    var strict              = false;    // strict mode ON or OFF
    var colors              = ['green', 'red', 'blue', 'yellow'];
    var turn                = null;
    var pcColorsStack       = [];       // Colors pressed by PC
    var eventsStack         = [];       // PC colors that still have to beep
    var checkStack          = [];       // helper array for checking human presses
    var count               = 0;
    var humanTimerId;                   // timer to control that human acts on time


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
        resetAll();
        simonOn = boolean;
    };

    /*
     *  Getter for strict.
     */
    var isStrict = function() {
        return strict;
    };

    /*
     *  Setter for strict.
     */
    var setStrict = function(boolean) {
        strict = boolean;
    };


    var resetAll = function() {

        clearTimeout(humanTimerId);
        count               = '--';
        turn                = null;
        pcColorsStack       = [];
        eventsStack         = [];
        checkStack          = [];
        humanTimerId        = null;
    };

    /*
     *  Starts a new game. Resets variables and gives turn to PC.
     */
    var start = function() {
        resetAll();
        count = 0;
        pcTurn();
    };


    /*
     *  A dispatcher of events:
     *  If it's PC turn and PC still has to beep, sends a new click event.
     *  If it's HUMAN turn, dispatches execution to humanTurn method.
     */
    var manageEvent = function(colorClicked) {

        if (!simonOn) return;

        if (turn === 'pc') {
            if (eventsStack.length > 0) {
                $colors[eventsStack.shift()].click();
            } else humanTurn();
        } else {
            humanTurn(colorClicked);
        }
    };


    var humanError = function() {

        turn = null;
        $sounds.failSound.play();
        $elements.count.innerHTML = '!!';
        clearTimeout(humanTimerId);
        humanTimerId = null;

        setTimeout(function() {
            if(!strict) {
                turn = 'pc';
                eventsStack = pcColorsStack.slice();
                checkStack  = pcColorsStack.slice();
                manageEvent();
            } else {
                resetAll();
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
        resetAll();
        $elements.count.innerHTML = '♥♥';
    };

    var startTimeout = function() {
        return setTimeout(function() {
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
            humanError();
        }
    };


    /*
     *  Public methods.
     */
    return {
        isSimonOn:          isSimonOn,
        setSimonOn:         setSimonOn,
        isStrict:           isStrict,
        setStrict:          setStrict,
        getTurn:            getTurn,
        start:              start,
        getCount:           getCount,
        manageEvent:        manageEvent
    }

};  // Game()