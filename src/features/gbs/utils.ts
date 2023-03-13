let __num = 0;
export function uid() {
  return ++__num + '-' + Math.random().toString(16).slice(2);
}

export function getUserLanguage() {
  try {
    return /^ja\b/.test(window.navigator.language) ? 'ja' : 'en';
  } catch {
    return 'ja';
  }
}

export function getUserDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getTimeStr(date: Date = new Date()) {
  const hh = `00${date.getHours()}`.slice(-2);
  const mm = `00${date.getMinutes()}`.slice(-2);
  const ss = `00${date.getSeconds()}`.slice(-2);
  const ms = `00${date.getMilliseconds().toString().slice(0, 2)}`.slice(-2);
  return `${hh}:${mm}:${ss}.${ms}`;
}

let prevCopyText = '';
let prevCopyTime = Date.now();
export async function copyText(str: string) {
  if (prevCopyText === str && Date.now() - prevCopyTime < 100)
    return Promise.resolve(false);
  prevCopyTime = Date.now();
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(str);
      prevCopyText = str;
      return true;
    } catch {
      return Promise.resolve(copyTextLegacy(str));
    }
  } else {
    return Promise.resolve(copyTextLegacy(str));
  }
}

export function copyTextLegacy(str: string) {
  try {
    const $p = document.createElement('p');
    $p.textContent = str;
    document.body.append($p);
    const range = document.createRange();
    range.selectNode($p);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    const res = document.execCommand('copy');
    $p.remove();
    prevCopyText = str;
    return res;
  } catch {
    return false;
  }
}
