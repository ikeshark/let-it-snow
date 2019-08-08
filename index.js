document.addEventListener('DOMContentLoaded', () => {

  const snowPerson = document.querySelector('.wrapper');
  const arms = document.querySelectorAll('.arms');
  const snowflakes = document.querySelectorAll('.snowflake');
  // this is for alternating arms to wave
  let waveBool = false;
  let position = 0;
  // for mouse only interaction it will cycle through basic animations
  let clickCounter = 0;
  // this is for modifying css variables
  const elm = document.documentElement;
  const increment = parseInt(getComputedStyle(elm)
    .getPropertyValue('--increment'));

  function hideHowTo() {
    document.querySelector('.howTo').style.display = 'none';
    wave();
    document.body.removeEventListener('click', hideHowTo);
  }
  document.body.addEventListener('click', hideHowTo);

  (function snowflakeInit() {
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
    for (let i = 0; i < 20; i++) {
      const dly = i / 20;
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
    for (let i = 20; i < snowflakes.length; i++) {
      // grab snow flakes 'duplicate' (approx same position)
      // find animation delay length, parse float, add a few seconds
      dly = snowflakes[i - 20].style.animationDelay;
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
    window.setTimeout(() => {
      snowPerson.classList.remove('bounce');
    }, 600);
  }

  function wave() {
    var arm = waveBool ? 0 : 1;
    waveBool = !waveBool;
    arms[arm].classList.add('wave');

    window.setTimeout(() => {
      arms[arm].classList.remove('wave');
    }, 1100);
  }

  function moveLeft() {
    const rect = snowPerson.getBoundingClientRect();
    const left = rect.left;
    const width = rect.width;

    if (left - width/2 > 0) {
      snowPerson.classList.add('moveLeft');
      position -= increment;
      window.setTimeout(() => {
        elm.style.setProperty('--position', position + 'rem');
        snowPerson.classList.add('transformX');
        snowPerson.classList.remove('moveLeft');
        document.addEventListener('keydown', keyboardEvents);
        document.addEventListener('touchstart', touchEvents);
      }, 600);
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
      window.setTimeout(() => {
        elm.style.setProperty('--position', position + 'rem');
        snowPerson.classList.remove('moveRight')
        snowPerson.classList.add('transformX');
        document.addEventListener('keydown', keyboardEvents);
        document.addEventListener('touchstart', touchEvents);
      }, 600);
    } else {
      document.addEventListener('keydown', keyboardEvents);
    }
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
      wave();
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

    console.log(touchPos, snowPersonPos)

    if (e.target.closest('.wrapper') === snowPerson) {
      document.addEventListener('touchstart', touchEvents);
      return;
    } else if (touchPos > snowPersonPos) {
      moveRight();
    } else if (touchPos < snowPersonPos) {
      moveLeft();
    } else {
      document.addEventListener('touchstart', touchEvents);

      // remove in production
      alert('error');
    }
  }

  document.addEventListener('touchstart', touchEvents)

  snowPerson.addEventListener('click', function() {
    if (clickCounter == 0) {
      this.classList.add('bounce');
      window.setTimeout(() => {
        this.classList.remove('bounce')
      }, 600);
    } else if (clickCounter == 1) {
      var arm = waveBool ? 0 : 1;
      waveBool = !waveBool;
      arms[arm].classList.add('wave');
      window.setTimeout(() => {
        arms[arm].classList.remove('wave')
      }, 1100);
    }
    clickCounter = clickCounter ? 0 : 1;
  });
});
