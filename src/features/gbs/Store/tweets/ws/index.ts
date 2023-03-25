import mitt from 'mitt';
import type { RaidTweetMini } from 'gbs-open-lib';
import { ClientMessage, zServerMessage } from './schema';
import { createSignal } from 'solid-js';
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
const [ping, setPing] = createSignal(0);
export { ping };

let isStart = false;
let reconnectingCount = 0;

export function connect() {
  if (reconnectingCount > 5) return;
  reconnectingCount++;
  if (ws && ws.readyState !== WebSocket.CLOSED) {
    ws.close();
    ws = null;
  }
  isStart = true;
  try {
    // ws = new WebSocket(`ws://${location.hostname}:10510/ws/`);
    ws = new WebSocket(`wss://gbs-open.eriri.net/private/api/stream/ws/`);
    ws.addEventListener('message', (event) => {
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
      reconnectingCount = 0;
    });
    ws.addEventListener('close', (event) => {
      gbsWs.emit('close', event);
      if (isStart) {
        // 再接続チャレンジ
        setTimeout(() => {
          connect();
        }, 2000);
      }
    });
    ws.addEventListener('error', () => {
      gbsWs.emit('error', 'サーバー接続エラー');
      ws?.close();
    });
  } catch {
    gbsWs.emit('error', 'サーバーに接続できませんでした');
  }
}
