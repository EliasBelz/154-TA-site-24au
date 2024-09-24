'use strict';

import { smartAddTypingEffect, scrollToBottom, statusCheck, qsa, qs, gen, API_ROOT} from "./helpers.js";

(function(){
  const SIGNATURE = '154-TA-site-24au guest % ';
  const COMMANDS = {
    'help': () => help(),
    'clear': () => clear(),
    'whoami': () => pCommand('rotter'),
    'vim': () => pCommand('why use vim? try \'emacs\''),
    'emacs': () => pCommand('why use emacs? try \'vim\''),
    'ping': () => pCommand('pong'),
    'about': () => about(),
    'generate': (url) => ascii(url?.trim()),
    'cse': () => tips(),
    'snake': () => snake(),
    'resources': () => resources(),
    'cd': (e) => cd(e),
    'ls': () => ls(),
    'otters': () => otters(),
    "meow": () => pCommand('meow'),
  }

  const RANDOM_EXAMPLE_URLS = [
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.etsystatic.com%2F12194327%2Fr%2Fil%2Fd39ea6%2F4512338817%2Fil_fullxfull.4512338817_4r4p.jpg&f=1&nofb=1&ipt=bfd485dcede24a4e2cb0ef80b0e31db0d34d1e1ede473ab9440bf5604242e30b&ipo=images",
    "https://ih1.redbubble.net/image.2623073538.4684/st,small,845x845-pad,1000x1000,f8f8f8.jpg",
    "https://magazine.washington.edu/columns_wordpress/wp-content/uploads/2021/06/dubs3.jpg",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.mnuiP2LZE8xODI5ZC1CZXAHaGp%26pid%3DApi&f=1&ipt=8895ff5afe13ab3b0b7e15656456cd57507f379584a0245bafed3b4c38de0d97&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F39%2F85%2Ff9%2F3985f9c27f594871aaff1881a56b6f6f--university-of-washington-husky.jpg&f=1&nofb=1&ipt=666ee2a6aec8640fb4e2db39f219672cb389d2fff21a1b396a5dcb74366e41fb&ipo=images",
    "https://media.sproutsocial.com/uploads/meme-example.jpg",
    "https://www.theinterrobang.ca/images/interrobang/030819/B8QC6DAZ9PWRK7M2.jpg",
    "https://www.zelda.com/tears-of-the-kingdom/_images/game/logo-shadow.png",
    "https://alphagammadelta.org/wp-content/uploads/2017/01/U-Washington.jpg",
    "https://lazowska.cs.washington.edu/GatesCenter.jpg",
    "https://images.seattletimes.com/wp-content/uploads/2016/08/huskyheadlines_cover.jpg?d=780x520",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC0PR064Z1RtLDFB7MLtaz23bkUtosG74y2r7PU-O8tQ&usqp=CAU&ec=48665699"
  ];

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
    await executeCommand(command);
  }

  async function executeCommand(command) {
    const signature = gen('p');
    const form = qs('form');
    const input = qs('form input');
    let res;
    try {
      res = await processCommand(command);
    } catch (e) {
      console.error(e);
      res = pCommand('An error occurred. Please try a different option.');
    }
    input.value = '';
    const {elm, textContent, speed = 11, extra, byLine = false} = res || {};
    if (elm && textContent) {
      elm.classList.add('in-terminal');
      const span = gen('span');
      span.textContent =  command;
      span.classList.add('white');
      signature.textContent = SIGNATURE;
      signature.appendChild(span);
      signature.classList.add('in-terminal');
      form.before(signature);
      form.before(elm);
      scrollToBottom();
      await smartAddTypingEffect(elm, textContent, speed, true, byLine);
      if (extra) {
        extra.classList.add('in-terminal');
        elm.after(extra);
      }
      scrollToBottom();
    }

  }

  async function processCommand(command) {
    const arr = command.split(' ');
    const first = arr[0];
    const query = arr.slice(1).join(' ');
    if (first in COMMANDS) {
      const res = await COMMANDS[first](query);
      return res;
    }
    return pCommand(`${first}: command not found`);
  }

  function clear() {
    const it = qsa('.in-terminal');
    for (const e of it) {
      e.remove();
    }
  }



  function help() {
    return pCommand('Available commands: ' + Object.keys(COMMANDS).join(', '));
  }

  function ls() {
    return pCommand(`${Object.keys(COMMANDS).join('\t')} (and a few secrets)`);
  }

  async function cd(e) {
    if (e in COMMANDS) {
      return await executeCommand(e);
    }
    e = e.trim().toLowerCase();
    let msg = `cd: ${e} not found`
    // secrets don't tell anyone
    if (e.includes('..')) {
      msg = 'there is no escape ;-)';
    } else if (e === 'otter') {
      msg = "You found the otters section! Did you know otters hold hands while sleeping?";
    } else if (e === 'sandwich') {
      msg = "Best served with two slices of bread.";
    } else if (e === 'chatgpt') {
      msg = "Don't use this command.";
    } else if (e === 'cse154') {
      msg = "You found the CSE 154 section! Did you know that CSE 154 is the best course at the University of Washington?";
    } else if (e === 'cse331' || e === 'cse311' || e === 'cse312') {
      msg = `I cry every time I think about ${e.toUpperCase()}.`;
    } else if (e === 'notes') {
      msg =
     `$$$$ Ideas to make me a million dollars $$$$

      1. Create a website that generates random ASCII art.
      2. Eggs that come pre-cracked.
      3. Box that makes your food cold.
      4. Hover board.
      5. Radio for the internet.
      6. MLM for MLMs.`
      return {elm: gen('pre'), textContent: msg};
    } else if (e === 'secrets' || e === 'secret') {
      msg = 'Secret directories include: otter, sandwich, chatgpt, cse154, cse331, cse311, cse312, notes, chester, tal';
    } else if (e === 'chester' || e === 'tal') {
      msg = 'One time I showed Tal a picture of my cat, and she said \"yuck\".';
    }

    return pCommand(msg);
  }

  function about() {
    const textContent=
    `Hi! My name is Elias and this is my third time TAing CSE 154 (the best cse class). I am a senior and this is my last quarter at UW :-(.

Fun fact about me is I love to snowboard and worked at a ski shop for a few years. Snoqualmie pass is my local mountain but Mt. Baker is my favorite.
If you have any questions about the course or need help with anything, feel free to ask!`;
const a = gen('a');
a.href = 'mailto:ebelz@cs.washington.edu';
a.textContent = 'email me';
    return {elm: gen('pre'), textContent, extra: a};
  }

  async function ascii(imgUrl) {
    if (!imgUrl) {
      return pCommand('Usage: generate <image url>');
    }
    qs('form input').value += '... loading...';
    if (imgUrl === "ascii art") {
      imgUrl = RANDOM_EXAMPLE_URLS[incStorageIndex("ascii") % RANDOM_EXAMPLE_URLS.length];
    }
    const body = new FormData();
    body.append('url', imgUrl);
    body.append('inverted', 'true');
    const res = await fetch(`${API_ROOT}/ascii`, {method: 'POST', body});
    await statusCheck(res);
    const text = await res.text();
    const pre = gen('pre');
    pre.classList.add('ascii');
    const a = gen('a');
    a.href = imgUrl;
    a.target = '_blank';
    a.textContent = "Original Image";
    return {elm: pre, textContent: text, speed: 50, byLine:true, extra: a};
  }

  function tips() {
    const textContent =
    `1. Start your assignments early and ask questions on Ed.
2. Linters suck but there are a few things you can do to make them suck less.
  - Read the code quality guide and code with it in mind.
  - Set aside time to fix linter errors, no ones a perfect programmer.
  - Submit often. You can submit as many times as you want before the deadline.
3. Be creative and follow what makes you curious. If you are interested in a topic, explore it further.
4. Don't be afraid to ask questions. The course staff is here to help you.`
    const a = gen('a');
    a.href = 'https://courses.cs.washington.edu/courses/cse154/codequalityguide/';
    a.target = '_blank';
    a.textContent = 'Code Quality Guide';
    return {elm: gen('pre'), textContent, extra: a};
  }

  function snake() {
    if (isMobile()) {
      return pCommand('🐍🐍🐍 Snake is not supported on mobile devices.');
    }

    setTimeout(() => window.location.href = 'snake.html', 1000);
    return pCommand('navigating to snake 🐍🐍🐍');
  }

  function resources() {
    const a = gen('a');
    a.href = 'https://courses.cs.washington.edu/courses/cse154/24au/resources/index.html';
    a.target = '_blank';
    a.textContent = 'https://courses.cs.washington.edu/courses/cse154/24au/resources/index.html';
    return {...pCommand('The CSE 154 course website has a great list of resources!'), extra: a};
  }

  function otters() {
    const a = gen('a');
    a.href = 'https://homes.cs.washington.edu/~ebelz/otters/';
    a.target = '_blank';
    return {elm: a, textContent: 'https://homes.cs.washington.edu/~ebelz/otters/'};
  }

  /**
   * Helper functions
  */

  // from https://stackoverflow.com/questions/72502079/how-can-i-check-if-the-device-which-is-using-my-website-is-a-mobile-user-or-no
  function isMobile() {
      // User agent string method
      let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      // Screen resolution method
      if (!isMobile) {
          let screenWidth = window.screen.width;
          let screenHeight = window.screen.height;
          isMobile = (screenWidth < 768 || screenHeight < 768);
      }
      // Touch events method
      if (!isMobile) {
          isMobile = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
      }
      // CSS media queries method
      if (!isMobile) {
          let bodyElement = document.getElementsByTagName('body')[0];
          isMobile = window.getComputedStyle(bodyElement).getPropertyValue('content').indexOf('mobile') !== -1;
      }
      return isMobile
  }

  function incStorageIndex(key) {
    let idx = window.localStorage.getItem(key) || "0";
    idx = parseInt(idx);
    window.localStorage.setItem(key, idx + 1);
    return idx;
  }

 function pCommand (command) {
    return {elm: gen('p'), textContent: command};
  }
})();