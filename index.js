document.addEventListener('DOMContentLoaded', () => {

  const snowPerson = document.querySelector('.wrapper');
  const arms = document.querySelectorAll('.arms');
  // this is for modifying css variables
  const elm = document.documentElement;

  // how far snowperson moves
  const increment = parseInt(getComputedStyle(elm)
    .getPropertyValue('--increment'));

  // this is for alternating arms to wave
  let waveBool = false;
  // snowperson position relative to starting point (center)
  let position = 0;
  // for mouse only interaction it will cycle through basic animations
  let clickCounter = 0;

  (function snowflakeInit() {
    const snowflakes = document.querySelectorAll('.snowflake');
    const halfNumOfFlakes = snowflakes.length / 2;

    // helper function, shuffles arrays
    function shuffle(array) {
      let m = array.length, t, i;
      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    }

    // generate array of delay times, while spacing snowflakes
    const snowflakesDelay = [];
    for (let i = 0; i < halfNumOfFlakes; i++) {
      const dly = i / halfNumOfFlakes;
      snowflakesDelay.push(dly);
      var leftAmt = ((i + 1) * 5) + '%';
      snowflakes[i].style.left = leftAmt;
    }
    // shuffle delay array and then set delay times
    const shuffledArray = shuffle(snowflakesDelay);
    for (let i = 0; i < shuffledArray.length; i++) {
      let dly = shuffledArray[i];
      if (i % 2) {
        dly += 1;
      }
      dly += 's';
      snowflakes[i].style.animationDelay = dly;
    }
    // this is for the second wave of snowflakes
    for (let i = halfNumOfFlakes; i < snowflakes.length; i++) {
      // grab snow flakes 'duplicate' (approx same position)
      // find animation delay length, parse float, add a few seconds
      dly = snowflakes[i - halfNumOfFlakes].style.animationDelay;
      dly = parseFloat(dly);
      if (i % 3 == 1) {
        dly += 4;
      } else if (i % 3 == 2) {
        dly += 3;
      } else {
        dly += 5;
      }
      var leftAmt = ((i - 19) * 5) + '%';
      snowflakes[i].style.left = leftAmt;
      dly += 's';
      snowflakes[i].style.animationDelay = dly;
    }
  })();

  // snowperson animations

  function bounce() {
    snowPerson.classList.add('bounce');
    function endStep() {
      snowPerson.classList.remove('bounce');
      snowPerson.removeEventListener('animationend', endStep);
    }
    snowPerson.addEventListener('animationend', endStep);
  }

  function wave(cb) {
    var arm = waveBool ? 0 : 1;
    waveBool = !waveBool;
    arms[arm].classList.add('wave');

    function endStep() {
      arms[arm].classList.remove('wave');
      arms[arm].removeEventListener('animationend', endStep);
      cb();
    }
    arms[arm].addEventListener('animationend', endStep);
  }

  function moveLeft() {
    const rect = snowPerson.getBoundingClientRect();
    const left = rect.left;
    const width = rect.width;

    if (left - width/2 > 0) {
      snowPerson.classList.add('moveLeft');
      position -= increment;
      function endStep() {
        elm.style.setProperty('--position', position + 'rem');
        snowPerson.classList.remove('moveLeft');
        document.addEventListener('keydown', keyboardEvents);
        document.addEventListener('touchstart', touchEvents);
        document.removeEventListener('animationend', endStep);
      }
      snowPerson.addEventListener('animationend', endStep);

    } else {
      document.addEventListener('keydown', keyboardEvents);
    }
  }
  function moveRight() {
    const right = snowPerson.getBoundingClientRect().right;
    const rightBound = window.innerWidth;

    if (rightBound > right) {
      snowPerson.classList.add('moveRight');
      position += increment;

      function endStep() {
        elm.style.setProperty('--position', position + 'rem');
        snowPerson.classList.remove('moveRight')
        document.addEventListener('keydown', keyboardEvents);
        document.addEventListener('touchstart', touchEvents);
        snowPerson.removeEventListener('animationend', endStep);
      }

      snowPerson.addEventListener('animationend', endStep);
    } else {
      document.addEventListener('keydown', keyboardEvents);
    }
  }
  function slide() {
    var armL = snowPerson.querySelector('.armL');
    var armR = snowPerson.querySelector('.armR');
    snowPerson.addEventListener('animationend', () => {
      snowPerson.classList.remove('slideBody');
      armL.classList.remove('slideArm');
      armL.classList.add('rotateArmL');
      armR.classList.add('rotateArmR');
    });
    snowPerson.classList.add('slideBody');
    armL.classList.remove('rotateArmL');
    armR.classList.remove('rotateArmR');
    armL.classList.add('slideArm');
  }
  function turnHead() {
    document.querySelector('.eyesWrapper').classList.add('rotateEyes');
    document.querySelector('.carrot').classList.add('rotateCarrot');
    document.querySelector('.armR').classList.add('rotateArmR');
    document.querySelector('.armL').classList.add('rotateArmL');
  }
  function hideHowTo() {
    document.querySelector('.howTo').style.display = 'none';
    wave(turnHead);
    document.body.removeEventListener('click', hideHowTo);
  }
  document.body.addEventListener('click', hideHowTo);

  function toggleAnimation() {
    console.log('triggered')
    const animatedElems = document.querySelectorAll('.tree, .snowflake, .rotateArmL, .rotateArmR');
    animatedElems.forEach(({ style }) => {
      console.log(style.webkitAnimationPlayState)
      if (style.webkitAnimationPlayState !== 'paused') {
        style.webkitAnimationPlayState = 'paused'
      } else {
        style.webkitAnimationPlayState = 'running'
      }
    })
  }

  // event listeners and delegation
  function keyboardEvents(e) {
    document.removeEventListener('keydown', keyboardEvents);
    var keyName = e.key;
    if (keyName == 'a' || keyName == 'ArrowLeft') {
      moveLeft();
    } else if (keyName == 'd' || keyName == 'ArrowRight') {
      moveRight();
    } else if (keyName == 'w' || keyName == 'ArrowUp') {
      bounce();
      document.addEventListener('keydown', keyboardEvents);
    } else if (keyName == 's' || keyName == 'ArrowDown') {
      slide();
      document.addEventListener('keydown', keyboardEvents);
    } else if (keyName == 'p') {
      toggleAnimation();
      document.addEventListener('keydown', keyboardEvents);
    } else {
      document.addEventListener('keydown', keyboardEvents);
    }
  }

  document.addEventListener('keydown', keyboardEvents);

  function touchEvents(e) {
    document.removeEventListener('touchstart', touchEvents);

    const touchPos = e.touches[0].clientX;;
    const snowPersonPos = snowPerson.getBoundingClientRect().x;

    if (e.target.closest('.wrapper') === snowPerson) {
      document.addEventListener('touchstart', touchEvents);
      return;
    } else if (touchPos > snowPersonPos) {
      moveRight();
    } else if (touchPos < snowPersonPos) {
      moveLeft();
    } else {
      document.addEventListener('touchstart', touchEvents);
    }
  }

  document.addEventListener('touchstart', touchEvents)

  snowPerson.addEventListener('click', function() {
    if (clickCounter == 0) {
      bounce();
    } else if (clickCounter == 1) {
      wave();
    }
    clickCounter = clickCounter ? 0 : 1;
  });
});


var snowPerson = document.querySelector('.wrapper');
function freakOut() {
  var notHat = document.querySelectorAll('.wrapper > div:not(.hat)');
  notHat.forEach(elem => {
    elem.classList.add('freakOut')
  })
}
