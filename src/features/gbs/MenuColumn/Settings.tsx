import { createMemo } from 'solid-js';
import { produce } from 'solid-js/store';
import { changeAndSave, globalSettings } from '@gbs/Store/globalSettings';
import { text } from '@gbs/Text';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { Select } from './Select';
import { deleteAds } from '@gbs/ads';
import { scrollToElm } from '..';

const c = /*tw*/ {
  wrap: 'px-[5px]',
  hr: 'border-b border-t-0 border-solid border-gray-200 dark:border-gray-700',
  title: 'mb-[5px] font-bold',
};

export function Settings() {
  const options = createMemo(() => {
    return {
      language: [
        { value: 'ja', name: '日本語' },
        { value: 'en', name: 'English' },
      ] as const,
      columnSize: [
        { value: 's', name: text('小') },
        { value: 'm', name: text('中') },
        { value: 'l', name: text('大') },
      ] as const,
      columnType: [
        { value: '1line', name: text('1段') },
        { value: '2lines', name: text('2段') },
      ] as const,
      clickAction: [
        { value: 'copy', name: text('コピーのみ') },
        { value: 'pc:browser', name: text('PC版を開く') },
        { value: 'mobile:mbga', name: text('スマホ版(モバゲー)を開く') },
        { value: 'mobile:app', name: text('スマホ版(アプリ)を開く') },
      ] as const,
      copyButton: [
        { value: 'none', name: text('なし') },
        { value: 'top', name: text('上') },
        { value: 'bottom', name: text('下') },
        { value: 'overlay', name: text('全面') },
      ] as const,
      menuPosition: [
        { value: 'left', name: text('左') },
        { value: 'right', name: text('右') },
        { value: 'overlay', name: text('全面') },
      ] as const,
    };
  });

  return (
    <div class="flex flex-col gap-[10px] text-sm">
      <div class={c.wrap}>
        <p class={c.title}>{text('カラムの移動')}</p>
        <Checkbox
          value={globalSettings.showMoveButton}
          onChange={(v) =>
            changeAndSave(produce((s) => (s.showMoveButton = v)))
          }
        >
          {text('移動ボタンを表示')}
        </Checkbox>
      </div>

      <hr class={c.hr} />

      <div class={c.wrap}>
        <p class={c.title}>{text('カラムの横幅')}</p>
        <Radio
          value={globalSettings.columnSize}
          options={options().columnSize}
          onChange={(v) => changeAndSave(produce((s) => (s.columnSize = v)))}
        />
      </div>

      <hr class={c.hr} />

      <div class={c.wrap}>
        <p class={c.title}>{text('カラムの配置')}</p>
        <Radio
          value={globalSettings.columnType}
          options={options().columnType}
          onChange={(v) => changeAndSave(produce((s) => (s.columnType = v)))}
        />
      </div>

      <hr class={c.hr} />

      <div class={c.wrap}>
        <p class={c.title}>{text('コピーボタン')}</p>
        <Radio
          value={globalSettings.copyButton}
          options={options().copyButton}
          onChange={(v) => changeAndSave(produce((s) => (s.copyButton = v)))}
        />
      </div>

      <hr class={c.hr} />

      <div class={c.wrap}>
        <p class={c.title}>{text('クリック時の動作')}</p>
        <Select
          value={globalSettings.clickAction}
          options={options().clickAction}
          onChange={(v) => changeAndSave(produce((s) => (s.clickAction = v)))}
        />
      </div>

      <hr class={c.hr} />

      <div class={c.wrap}>
        <p class={c.title}>{text('メニューの位置')}</p>
        <Radio
          value={globalSettings.menuPotision}
          options={options().menuPosition}
          onChange={(v) => {
            changeAndSave(produce((s) => (s.menuPotision = v)));
            // deleteAds();
            scrollToElm('#gbs-menu');
          }}
        />
      </div>

      <hr class={c.hr} />

      <div class={c.wrap}>
        <p class={c.title}>{text('軽量化')}</p>
        <ul class="flex flex-col justify-items-start gap-[10px]">
          <li>
            <Checkbox
              value={globalSettings.fewerTweets}
              onChange={(v) =>
                changeAndSave(produce((s) => (s.fewerTweets = v)))
              }
            >
              {text('表示ツイート数を減らす')}
            </Checkbox>
          </li>
          <li>
            <Checkbox
              value={globalSettings.noScroll}
              onChange={(v) => changeAndSave(produce((s) => (s.noScroll = v)))}
            >
              {text('カラムのスクロールを禁止')}
            </Checkbox>
          </li>
        </ul>
      </div>

      <hr class={c.hr} />

      <div class={c.wrap}>
        <p class={c.title}>{text('その他の設定')}</p>
        <ul class="flex flex-col justify-items-start gap-[10px]">
          {/* <li>
            <Checkbox
              value={globalSettings.darkMode}
              onChange={(v) => changeAndSave(produce((s) => (s.darkMode = v)))}
            >
              {text('ダークモード')}
            </Checkbox>
          </li> */}
          <li>
            <Checkbox
              value={globalSettings.focusOnlySound}
              onChange={(v) =>
                changeAndSave(produce((s) => (s.focusOnlySound = v)))
              }
            >
              {text('フォーカス時のみ音を鳴らす')}
            </Checkbox>
          </li>
          <li>
            <Checkbox
              value={globalSettings.orderByTweetTime}
              onChange={(v) =>
                changeAndSave(produce((s) => (s.orderByTweetTime = v)))
              }
            >
              {text('ツイート時間順で並べる')}
            </Checkbox>
          </li>
          <li>
            <Checkbox
              value={globalSettings.menuButton}
              onChange={(v) =>
                changeAndSave(produce((s) => (s.menuButton = v)))
              }
              disabled={globalSettings.menuPotision === 'overlay'}
            >
              {text('メニューボタンを表示')}
            </Checkbox>
          </li>
          <li>
            <Checkbox
              value={globalSettings.lockButton}
              onChange={(v) =>
                changeAndSave(produce((s) => (s.lockButton = v)))
              }
            >
              {text('画面ロックボタンを表示')}
            </Checkbox>
          </li>
          <li>
            <Checkbox
              value={globalSettings.showImage}
              onChange={(v) => changeAndSave(produce((s) => (s.showImage = v)))}
            >
              {text('画像を表示')}
            </Checkbox>
          </li>
          <li>
            <Checkbox
              value={globalSettings.date24}
              onChange={(v) => changeAndSave(produce((s) => (s.date24 = v)))}
            >
              {text('24時間表記にする')}
            </Checkbox>
          </li>
          <li>
            <Checkbox
              value={globalSettings.alwaysHeader}
              onChange={(v) =>
                changeAndSave(produce((s) => (s.alwaysHeader = v)))
              }
            >
              {text('カラムヘッダーを常に表示')}
            </Checkbox>
          </li>
          <li>
            <Checkbox
              value={globalSettings.log}
              onChange={(v) => changeAndSave(produce((s) => (s.log = v)))}
            >
              {text('ログを表示')}
            </Checkbox>
          </li>
        </ul>
      </div>
    </div>
  );
}
