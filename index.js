'use strict';
import { smartAddTypingEffect, qs, gen, id, qsa } from "./helpers.js";
export const PROMPTS = ['Help', 'About Me', 'Generate ascii art', 'CSE 154 Tips', 'Snake Game', 'Resources'];
(function() {
  window.addEventListener('load', init);

  function init() {
    setupPrompts();
  }

  async function setupPrompts() {
    const ul = gen('ul');
    const mainTerminal = id('terminal-nav');
    mainTerminal.appendChild(ul);
    const animationPlayed = window.sessionStorage.getItem('animationPlayed') === 'true';
    const speed = 50;
    const h1 = gen('h1');
    qs('main').firstElementChild.before(h1);
    const h1Text = 'Welcome to the Elias Net';
    await smartAddTypingEffect(h1, h1Text, speed, !animationPlayed);
    for (const prompt of PROMPTS) {
      const li = gen('li');
      li.addEventListener('mouseover', swapSelectedPrompt);
      li.addEventListener('mouseout', clearSelectedPrompt);
      li.addEventListener('click', clickPrompt);
      ul.appendChild(li);
      await makePrompt(li, prompt, !animationPlayed, speed)
    }
    window.sessionStorage.setItem('animationPlayed', 'true');
  }

  function swapSelectedPrompt(event) {
    clearSelectedPrompt();
    event.target.classList.add('selected');
  }

  function clearSelectedPrompt() {
    qsa('.selected').forEach(p => p.classList.remove('selected'));
  }

  async function makePrompt(parentElm, text, doTyping = false, speed = 50) {
    const p = gen('p');
    parentElm.appendChild(p);
    await smartAddTypingEffect(p, text, speed, doTyping);
  }

  async function clickPrompt(event) {
    const text = event.currentTarget.querySelector('p').textContent.toLowerCase();
    qs('form input').value = text;
    await new Promise(resolve => setTimeout(resolve, 100));
    qs('form').dispatchEvent(new Event('submit'));
  }
})()