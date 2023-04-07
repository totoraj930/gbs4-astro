import { gbsList } from '@gbs/Store/gbsList';
import { loadGbsList } from '@gbs/Store/gbsList';
import type { GbsList } from 'gbs-open-lib';
import { For, Show, createSignal, onMount } from 'solid-js';
import { z } from 'zod';

type RankingItem = {
  count: number;
  enemy: GbsList[number];
};
const zRanking = z.array(
  z.object({
    id: z.number(),
    count: z.number(),
  })
);

export function GbsRanking() {
  const [ranking, setRanking] = createSignal<RankingItem[]>([]);
  const [time, setTime] = createSignal('');
  onMount(async () => {
    await loadGbsList();
    const url = 'https://gbs-open.eriri.net/private/api/monitor/ranking?';
    try {
      const res = await fetch(url);
      const dateStr = res.headers.get('last-modified');
      console.log(dateStr, [...res.headers.keys()]);
      const date = dateStr ? new Date(dateStr) : new Date();
      setTime(date.toLocaleString());
      const rawJson = await res.json();
      const tmp = zRanking.parse(rawJson).flatMap(({ id, count }) => {
        const enemy = gbsList().find((item) => item.id === id);
        if (enemy) {
          return [{ count, enemy }];
        } else {
          return [];
        }
      });
      setRanking(tmp);
    } catch (err) {
      console.error(err);
    }
  });
  return (
    <div class="h-full w-full overflow-auto p-[10px]">
      <h1 class="my-[10px] text-[20px] font-bold">
        Granblue Search 待機人数ランキング
      </h1>
      <Show when={ranking().length > 0} fallback={<p>読み込み中</p>}>
        <p class="my-[10px]">更新: {time()}</p>
        <ol>
          <For each={ranking()}>
            {(item, index) => {
              return (
                <li class="border-b border-solid border-gray-200 px-[5px] py-[10px]">
                  <p class="inline-flex gap-[10px]">
                    <span class="min-w-[30px] text-right font-bold">
                      {index() + 1}
                    </span>
                    <span class="min-w-[60px] text-right">{item.count}人</span>
                    <span class="min-w-[50px] text-[14px]">
                      Lv.{item.enemy.level}
                    </span>
                    <span>{item.enemy.ja}</span>
                  </p>
                </li>
              );
            }}
          </For>
        </ol>
      </Show>
    </div>
  );
}
