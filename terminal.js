'use strict';

import { smartAddTypingEffect } from "./helpers.js";

(function(){
  const SIGNATURE = '154-TA-site-24au guest % ';

  const COMMANDS = {
    'help': () => help(),
    'clear': () => clear(),
    'whoami': () => 'rotter',
    'vim': () => 'why use vim? try \'emacs\'',
    'emacs': () => 'why use emacs? try \'vim\'',
    'ping': () => 'pong',
    'about': () => about(),
    'generate': () => ascii(),
    'cse': () => tips(),
    'snake': () => snake(),
    'resources': () => resources(),
    'cd': (e) => cd(e),
  }

  window.addEventListener('load', init);

  function init() {
    qs('form p').textContent = SIGNATURE;
    qs('form').addEventListener('submit', terminalInput);
    const input = qs('form input');
    input.focus();
    input.addEventListener('blur', () => input.focus());
  }

  async function terminalInput(event) {
    event.preventDefault();
    const input = qs('form input');
    const command = input.value;
    if (!command) {
      return;
    }
    input.value = '';
    const signature = gen('p');
    const form = qs('form');
    const processedCommand = processCommand(command);
    if (processedCommand) {
      const p = gen('p');
      const span = gen('span');
      span.textContent =  command;
      span.classList.add('white');
      signature.textContent = SIGNATURE;
      signature.appendChild(span);
      form.before(signature);
      form.before(p);
      scrollToBottom();
      await smartAddTypingEffect(p, processedCommand, 11, true);
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

  function scrollToBottom() {
    const terminalOutput = id('terminal-output');
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
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