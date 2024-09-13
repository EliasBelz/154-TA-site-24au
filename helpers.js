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

export async function smartAddTypingEffect(elm, text, speed, doTyping) {
  if (doTyping) {
     slowType(elm, text, speed);
     await new Promise(resolve => setTimeout(resolve, text.length * speed));
  } else {
    elm.textContent = text;
  }
}