import mitt from 'mitt';
import type { RaidTweetMini } from 'gbs-open-lib';
import { ClientMessage, zServerMessage } from './schema';
import { createSignal } from 'solid-js';
import { addToast } from '@gbs/Store/toast';
import { text } from '@gbs/Text';
export let ws: WebSocket | null = null;

type GbsWsEvents = {
  tweet: RaidTweetMini;
  time: number;
  message: string;
  ping: number;

  open: Event;
  close: CloseEvent;
  error: string | undefined;
};
export const gbsWs = mitt<GbsWsEvents>();

export function sendMessage(clientMsg: ClientMessage) {
  try {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const msg = JSON.stringify(clientMsg);
      ws.send(msg);
    }
  } catch {
    /* */
  }
}

let startPingTime = Date.now();
let prevMessageTime = Date.now();
const [ping, setPing] = createSignal(0);
export { ping };

let isStart = false;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const timer = setInterval(() => {
  if (Date.now() - prevMessageTime > 8000) {
    return connect();
  }
  if (
    isStart &&
    ws &&
    ws.readyState !== WebSocket.OPEN &&
    ws.readyState !== WebSocket.CONNECTING &&
    ws.readyState !== WebSocket.CLOSING
  ) {
    return connect();
  }
}, 2000);

export function connect() {
  isStart = false;
  if (ws) {
    ws.close();
    ws = null;
  }
  isStart = true;
  try {
    // ws = new WebSocket(`ws://${location.hostname}:10510/ws/`);
    ws = new WebSocket(`wss://gbs-open.eriri.net/private/api/stream/ws/`);

    ws.addEventListener('message', (event) => {
      prevMessageTime = Date.now();
      try {
        // console.log(JSON.parse(event.data));
        const msg = zServerMessage.parse(JSON.parse(event.data));
        switch (msg.type) {
          case 't': {
            gbsWs.emit('tweet', msg.data);
            break;
          }
          case 'time': {
            gbsWs.emit('time', msg.data);
            break;
          }
          case 'message': {
            gbsWs.emit('message', msg.message);
            break;
          }
          case 'pong': {
            gbsWs.emit('ping', Math.floor((Date.now() - startPingTime) / 2));
            setPing(Math.floor((Date.now() - startPingTime) / 2));
            setTimeout(() => {
              startPingTime = Date.now();
              sendMessage({ type: 'ping' });
            }, 3000);
            break;
          }
        }
      } catch (err) {
        console.error(err);
      }
    });

    ws.addEventListener('open', (event) => {
      gbsWs.emit('open', event);
      startPingTime = Date.now();
      sendMessage({ type: 'ping' });
    });
    ws.addEventListener('close', (event) => {
      gbsWs.emit('close', event);
    });
    ws.addEventListener('error', () => {
      // gbsWs.emit('error', 'サーバー接続エラー');
      addToast({
        type: 'error',
        duration: 3000,
        message: text('サーバー接続に失敗'),
      });
    });
  } catch {
    gbsWs.emit('error', 'サーバーに接続できませんでした');
  }
}
