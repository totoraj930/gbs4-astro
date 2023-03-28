import { closeModal } from '@gbs/Column/Settings/SettingsModal';
import clsx from 'clsx';
import { For, Show } from 'solid-js';
import { MsClose } from 'solid-material-symbols/rounded/600';
import { infoRes, InfoView } from '.';

const c = /*tw*/ {
  wrap: 'border-b border-gray-200',
  title: clsx(
    'text-[18px] font-bold py-[10px]',
    'cursor-pointer align-middle px-[5px]'
  ),
  body: clsx('normal-html p-[10px] text-[15px]'),
};

type Props = {
  onClose?: () => void;
};
export function Warn(props: Props) {
  function close() {
    props.onClose?.();
  }
  return (
    <div
      class={clsx(
        'fixed top-0 left-0 h-full w-full',
        'z-[300] flex flex-col items-center justify-center p-[10px]',
        'bg-[rgba(0,0,0,0.8)] dark:text-white'
      )}
    >
      <section
        class={clsx(
          'flex-1 overflow-auto',
          'w-full max-w-[800px] p-[10px]',
          'bg-white dark:bg-gray-700'
        )}
        ref={(elm) => {
          closeModal(elm, close);
        }}
        tabindex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div class={c.body}>
          <p>
            このサイトは「
            <a href="https://gbs-open.eriri.net" target="_blank">
              ツイ救援プロジェクト(gbs-open)
            </a>
            」に参加してくれている人たちのおかげで運営できています。
          </p>
          <p>参加お待ちしております。</p>
        </div>
        <Show when={infoRes()}>
          <div class={c.body}>
            <InfoView info={infoRes()!.important} />
          </div>
          <details open={false} class={c.wrap}>
            <summary class={c.title}>過去のお知らせ</summary>
            <div class={c.body}>
              <For each={infoRes()!.history}>
                {(info) => {
                  return <InfoView info={info} />;
                }}
              </For>
            </div>
          </details>
        </Show>
        <details open={false} class={c.wrap}>
          <summary class={c.title}>お問い合わせ</summary>
          <div class={c.body}>
            <p class="text-red-600 dark:text-red-300">
              自分の救援が掲載されない等のお問い合わせはご遠慮ください。
            </p>
            <p>Twitter APIで取得できたツイートは全て掲載しております。</p>
            <p>こちら側で対応できることは何もありません。</p>

            <p>
              Twitter:{' '}
              <a href="https://twitter.com/totoraj_game">@totoraj_game</a>
            </p>
            <p>
              マシュマロ:{' '}
              <a href="https://marshmallow-qa.com/totoraj_game">
                @totoraj_game
              </a>
            </p>
          </div>
        </details>

        <details open={true} class={c.wrap}>
          <summary class={c.title}>注意事項</summary>
          <div class={c.body}>
            <p>自己責任でご利用ください。</p>
            <p>
              管理人が適当に作って動かしているだけなので突然止まったりするかもしれません。
            </p>
            <p>
              個人のサーバーで動かしているものなのであまり負荷のかかる使い方(複数のタブで接続とか)はしないでください。
            </p>

            <div class="mb-[20px] rounded-[5px] bg-gray-100 p-[10px] dark:bg-gray-800">
              <p class="title">広告の配信について</p>
              <p>
                当サイトは広告配信サービス「Google Adsense」を利用しています。
              </p>
              <p>
                広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
              </p>
              <p>
                Cookieを無効にする設定およびGoogle Adsenseに関する詳細は「
                <a
                  href="https://www.google.co.jp/policies/technologies/ads/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  広告 – ポリシーと規約 – Google
                </a>
                」をご覧ください。
              </p>
              <p>
                第三者がコンテンツおよび宣伝を提供し、訪問者から直接情報を収集し、訪問者のブラウザにCookieを設定したりこれを認識したりする場合があります。
              </p>
            </div>

            <div class="mb-[20px] rounded-[5px] bg-gray-100 p-[10px] dark:bg-gray-800">
              <p class="title">アクセス解析ツールについて</p>
              <p>当サイトでは、「Googleアナリティクス」を利用しています。</p>
              <p>
                Googleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。
              </p>
              <p>
                このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
              </p>
              <p>
                Cookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
              </p>
              <p>
                詳しくは「
                <a
                  href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google アナリティクス利用規約
                </a>
                」をご覧ください。
              </p>
            </div>
          </div>
        </details>
      </section>
      <footer>
        <button
          class={clsx(
            'flex items-center justify-center',
            'mx-auto mt-[10px] h-[40px] w-[40px]',
            'border border-solid border-white',
            'rounded-full text-white'
          )}
          onClick={() => props.onClose?.()}
        >
          <MsClose size={30} />
        </button>
      </footer>
    </div>
  );
}
