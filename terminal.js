'use strict';
(function(){
  const SIGNATURE = '154-TA-site-24au guest % ';

  const COMMANDS = {
    'help': () => help(),
    'clear': () => clear(),
    'vim': () => 'why use vim? try \'emacs\'',
    'emacs': () => 'why use emacs? try \'vim\'',
    'whoami': () => 'guest',
    'about': () => about(),
    'generate': () => ascii(),
    'cse': () => tips(),
    'past': () => classes(),
    'snake': () => snake(),
    'resources': () => resources(),
    'cd': (e) => cd(e),
  }

  window.addEventListener('load', init);

  function init() {
    qs('form p').textContent = SIGNATURE
    qs('form').addEventListener('submit', terminalInput);
    const input = qs('form input');
    input.focus();
    input.addEventListener('blur', () => input.focus());
  }

  function terminalInput(event) {
    event.preventDefault();
    const input = qs('form input');
    const command = input.value;
    if (!command) {
      return;
    }
    input.value = '';
    const output = gen('p');
    const form = qs('form');
    const processedCommand = processCommand(command);
    if (processedCommand) {
      const p = gen('p');
      p.textContent = processedCommand;
      const span = gen('span');
      span.textContent =  command;
      span.classList.add('white');
      output.textContent = SIGNATURE;
      output.appendChild(span);
      form.before(output);
      form.before(p);
    }
  }

  function processCommand(command) {
    const arr = command.split(' ');
    const first = arr[0];
    const query = arr.slice(1).join(' ');
    if (first in COMMANDS) {
      return COMMANDS[first](query);
    }
    return `${first}: command not found`;
  }

  function clear() {
    const ps = qsa('#terminal-output > p');
    for (const p of ps) {
      p.remove();
    }

  }

  function help() {
    return 'Available commands: ' + Object.keys(COMMANDS).join(', ');
  }

  function cd(e) {
    if (e.includes('..')) {
      return 'there is no escape ;-)';
    }
    return `cd: ${e} not found`;
  }

  function about() {
    return 'I am a student at the University of Washington studying Computer Science.';
  }

  function ascii() {
    return ':-)';
  }

  function tips() {
    return 'Check out the CSE 154 course website for tips and resources!';
  }

  function classes() {
    return 'CSE 154';
  }

  function snake() {
    return '🐍';
  }

  function resources() {
    return 'Check out the CSE 154 course website for resources!';
  }


  /**
   * Helper functions
   */

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  function gen(tag) {
    return document.createElement(tag);
  }

  function id (id) {
    return document.getElementById(id);
  }
})()