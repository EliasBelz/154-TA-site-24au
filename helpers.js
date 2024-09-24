
export const local = false;
export const API_ROOT = local? "http://localhost:3000":  "https://ebelz.vercel.app"

export function slowType(elm, text, speed = 50) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (!text) {
        clearInterval(interval);
        resolve();
      } else {
        elm.textContent += text[0];
        text = text.slice(1);
      }
    }, speed);
  });
}

export function slowTypeByLine(elm, text, speed = 500) {
  return new Promise(resolve => {
    const lines = text.split('\n');
    let lineIndex = 0;

    const interval = setInterval(() => {
      if (lineIndex >= lines.length) {
        clearInterval(interval);
        resolve();
      } else {
        elm.textContent += lines[lineIndex] + '\n';
        lineIndex++;
        scrollToBottom();
      }
    }, speed);
  });
}

export function scrollToBottom() {
  const terminalOutput = document.getElementById('terminal-output');
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}


export async function smartAddTypingEffect(elm, text, speed, doTyping, byLine = false) {
  if (doTyping) {
    if (byLine) {
       slowTypeByLine(elm, text, speed);
    } else {
      slowType(elm, text, speed);
    }
     await new Promise(resolve => setTimeout(resolve, byLine? text.split('\n').length : text.length * speed));
  } else {
    elm.textContent = text;
  }
}

export async function statusCheck(response) {
  if (!response.ok) {
    console.error(response);
    throw new Error(await response.text());
  }
  return response;
}

export function qs(selector) {
  return document.querySelector(selector);
}

export function qsa(selector) {
  return document.querySelectorAll(selector);
}

export function gen(tag) {
  return document.createElement(tag);
}

export function id (id) {
  return document.getElementById(id);
}