'use strict';
(function() {
  const PROMPTS = ['About Me', 'Generate ascii art', 'CSE 154 Tips', 'Past Classes', 'Snake Game', 'Resources'];

  window.addEventListener('load', init);

  function init() {
    addTypingEffect(qs('h1'));
    setupPrompts();
  }

  async function setupPrompts() {
    const ul = gen('ul');
    const mainTerminal = id('main-terminal');
    mainTerminal.appendChild(ul);
    for (const prompt of PROMPTS) {
      const li = makePrompt(prompt);
      li.addEventListener('mouseover', swapSelectedPrompt);
      li.addEventListener('mouseout', clearSelectedPrompt);
      if (window.sessionStorage.getItem('animationPlayed') !== 'true') {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      ul.appendChild(li);
    }
    await window.sessionStorage.setItem('animationPlayed', 'true');
  }

  async function addTypingEffect(elm) {
    if (window.sessionStorage.getItem('animationPlayed') !== 'true') {
      elm.classList.add('typing');
    }
  }

  function swapSelectedPrompt(event) {
    clearSelectedPrompt();
    event.target.classList.add('selected');
  }

  function clearSelectedPrompt() {
    qsa('.selected').forEach(p => p.classList.remove('selected'));
  }

  function makePrompt(text) {
    const li = gen('li');
    const p = gen('p');
    addTypingEffect(p);
    p.textContent = text;
    li.appendChild(p);
    return li;
  }


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