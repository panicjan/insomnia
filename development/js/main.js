'use strict';

function switchMyth() {
  const switchers = Array.from(document.querySelectorAll('.myth-show'));

  switchers.map(switcher => {
    const mythElement = switcher.parentElement;

    switcher.addEventListener('click', () => {
      mythElement.classList.toggle('active');
    })
  });
}

switchMyth();