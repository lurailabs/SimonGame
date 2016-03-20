
/************ GUI ELEMENTS ************/

var $elements = {
    lights:         document.getElementById('lights'),
    count:          document.getElementById('count-number'),
    start:          document.getElementById('start'),
    strict:         document.getElementById('strict'),
    switch:         document.getElementById('switch'),
    switchInner:    document.getElementById('switch-inner')

};

var $colors = {
    green:          document.getElementById('green'),
    red:            document.getElementById('red'),
    blue:           document.getElementById('blue'),
    yellow:         document.getElementById('yellow')
};

var $sounds = {
    greenSound:     new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    redSound:       new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    blueSound:      new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    yellowSound:    new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
    failSound:      new Audio('http://soundbible.com/mp3/Computer%20Error-SoundBible.com-1655839472.mp3')
};

var game = new Game();


/************ GUI EVENTS ************/

/*
 *  MAIN ON/OFF SWITCH events:
 *  changes control position and turns on 'count' screen.
 */
$elements.switch.onclick = function() {

    if (!$elements.switchInner.classList.contains('on')) {
        $elements.count.innerHTML = '--';
        $elements.switchInner.classList.add('on');
        game.setSimonOn(true);
    } else {
        game.setSimonOn(false);
        $elements.start.classList.remove('on');
        $elements.strict.classList.remove('on');
        $elements.switchInner.classList.remove('on');
        $elements.count.innerHTML = '';
    }
};

/*
 *   LIGHT pushed event:
 *   turns on light, beeps and turns light back off.
 */
$elements.lights.onclick = function(e) {

    if (game.isSimonOn()) {

        // don't act on human clicks  when it's PC turn
        if(game.getTurn() === 'pc' && e.isTrusted) return;

        var $target = e.target;
        $target.classList.add('clicked');
        $elements.count.innerHTML = game.getCount();
        $sounds[$target.id + 'Sound'].play();
        setTimeout(function() {
            $target.classList.remove('clicked');
            game.manageEvent($target.id);
        }, 750);        // enough time for sound.
    }
};

/*
 *  START button event: turns on pilot and starts game.
 */
$elements.start.onclick = function() {

    if (game.isSimonOn()) {
        if (!$elements.start.classList.contains('on')) {
            $elements.start.classList.add('on');
        }
        game.start();
    }
};

/*
 *  STRICT button event: turns on pilot and sets strict mode.
 */
$elements.strict.onclick = function() {

    if (game.isSimonOn()) {
        if (!$elements.strict.classList.contains('on')) {
            game.setStrict(true);
            $elements.strict.classList.add('on');
        } else {
            game.setStrict(false);
            $elements.strict.classList.remove('on');
        }
    }
};