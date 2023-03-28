import { globalSettings } from '@gbs/Store/globalSettings';

export const TEXT_LIST = [
  { ja: '設定', en: 'Settings' },
  { ja: '設定なし', en: 'NO SETTINGS' },
  { ja: 'フィルタ', en: 'Filters' },
  { ja: '表示名', en: 'Display name' },
  { ja: '検索', en: 'Search' },
  { ja: 'リストから追加', en: 'Add from list' },
  { ja: 'コメント', en: 'Comment' },
  { ja: '重複制限', en: 'Duplicate limit' },
  { ja: '全て', en: 'All' },
  { ja: '最新のものだけ', en: 'Latest only' },
  { ja: '{n}分以上前からあるものだけ', en: 'More than {n} minutes ago' },
  { ja: '秒数制限', en: 'Elapsed seconds' },
  { ja: '{n}秒以内', en: 'Within {n} seconds' },
  { ja: '手動入力', en: 'Manual input' },
  { ja: 'レベル', en: 'Level' },
  { ja: '追加', en: 'Add' },
  { ja: 'キャンセル', en: 'Cancel' },
  { ja: 'OK', en: 'OK' },
  { ja: '閉じる', en: 'Close' },
  { ja: 'フィルタ設定', en: 'Filter settings' },
  { ja: 'カラムを削除', en: 'Delete column' },
  { ja: '全体設定', en: 'Settings' },
  { ja: 'カラムの横幅', en: 'Column width' },
  { ja: '小', en: 'S' },
  { ja: '中', en: 'M' },
  { ja: '大', en: 'L' },
  { ja: 'カラムの配置', en: 'Arrangement' },
  { ja: '1段', en: '1 line' },
  { ja: '2段', en: '2 lines' },
  { ja: 'カラムの並べ替え', en: 'Sort columns' },
  { ja: 'コピーボタン', en: 'Copy button' },
  { ja: 'なし', en: 'None' },
  { ja: '上', en: 'Top' },
  { ja: '下', en: 'Bottom' },
  { ja: '左', en: 'Left' },
  { ja: '右', en: 'Right' },
  { ja: '全面', en: 'Overlay' },
  { ja: '時間の表示タイプ', en: 'Time display type' },
  { ja: '経過時間', en: 'Elapsed time' },
  { ja: '投稿時間', en: 'Tweet time' },
  { ja: 'その他の設定', en: 'Other settings' },
  { ja: '画面ロックボタンを表示', en: 'Show screen lock button' },
  { ja: 'メニューボタンを表示', en: 'Show menu button' },
  { ja: 'ダークモード', en: 'Dark mode' },
  { ja: '画像を表示', en: 'Show images' },
  { ja: 'デバッグログを表示', en: 'Debug logs' },
  { ja: '分', en: 'm' },
  { ja: '秒', en: 's' },
  { ja: '例', en: 'Example' },
  { ja: 'ヘルプ', en: 'Help' },
  { ja: 'カラムを追加', en: 'Add column' },
  { ja: 'コンパクト', en: 'Compact' },
  { ja: '通知音', en: 'Alarm' },
  { ja: '音量', en: 'Volume' },
  { ja: 'ミュート', en: 'Mute' },
  { ja: 'ミュート切り替え', en: 'Toggle mute' },
  { ja: '{n}分', en: '{n}m' },
  { ja: '{n}秒', en: '{n}s' },
  { ja: '英語', en: 'English' },
  { ja: '日本語', en: 'Japanese' },
  { ja: '言語', en: 'Language' },
  { ja: 'クリック時の動作', en: 'Click action' },
  { ja: 'コピーのみ', en: 'Copy only' },
  { ja: 'PC版を開く', en: 'Open PC ver.' },
  { ja: 'スマホ版(モバゲー)を開く', en: 'Open mobile ver.(mbga)' },
  { ja: 'スマホ版(アプリ)を開く', en: 'Open mobile ver.(app)' },
  { ja: 'SkyLeap(モバゲー)を開く', en: 'Open SkyLeap ver.(mbga)' },
  { ja: 'SkyLeap(その他)を開く', en: 'Open SkyLeap ver.(other)' },
  { ja: '最新をコピー', en: 'Copy latest' },
  { ja: 'コピーに失敗しました', en: 'Copy filed' },
  { ja: 'ログを表示', en: 'Display log' },
  { ja: 'ツイート時間順で並べる', en: 'Order by tweet time' },
  { ja: 'セット{n}', en: 'Set {n}' },
  { ja: 'カラムの移動', en: 'Move column' },
  { ja: '移動ボタンを表示', en: 'Show move button' },
  { ja: 'カラム設定', en: 'Column settings' },
  { ja: 'カラムのスクロールを禁止', en: 'Disable column scrolling' },
  { ja: 'メニューの位置', en: 'Menu position' },
  { ja: 'カラムを削除しますか？', en: 'Delete a column?' },
  { ja: 'マイセット', en: 'My Sets' },
  { ja: '軽量化', en: 'Optimize performance' },
  { ja: '表示ツイート数を減らす', en: 'Show fewer Tweets' },
  { ja: '名前', en: 'Name' },
  { ja: '自動', en: 'Auto' },
  { ja: 'フォーカス時のみ音を鳴らす', en: 'Play sound only when focused' },
  { ja: 'ダーク', en: 'Dark' },
  { ja: 'ライト', en: 'Light' },
  { ja: 'テーマ', en: 'Theme' },
  { ja: 'サーバーに接続しました', en: 'Server connected' },
  { ja: 'サーバーから切断しました', en: 'Server disconnected' },
  { ja: 'サーバー接続に失敗', en: 'Server connection failed' },
  { ja: 'コピー: {id}', en: 'Copied: {id}' },
  { ja: 'リストの読み込みに失敗', en: 'Failed to load list' },
  { ja: '画面ロック中', en: 'Screen locked' },
  { ja: '広告', en: 'Ads' },
  { ja: '注意事項', en: 'Terms of Use (Japanese)' },
  { ja: '24時間表記にする', en: '24-Hour Clock' },
] as const;

type Key = (typeof TEXT_LIST)[number]['ja'];
type Table = Record<string, unknown>;

export function text(key: Key, table?: Table) {
  const l = globalSettings.language || 'ja';
  let res: string = TEXT_LIST.find(({ ja }) => ja === key)?.[l] ?? key;
  for (const [k, v] of Object.entries(table ?? {})) {
    const regexp = new RegExp(`{${k}}`, 'g');
    res = res.replace(regexp, v + '');
  }
  return res;
}

export const TAG_LIST = [
  // 無くなった
  // { ja: '旧石', en: 'T1 Summons'},
  // 無くなった
  // { ja: '高級鞄', en: '' },
  // いらないかも
  // { ja: 'HL', en: 'IMPOSSIBLE' },
  { ja: 'ヒヒイロカネ', en: 'Gold Brick' },
  { ja: '刻の流砂', en: 'Eternity Sand' },
  { ja: 'マグナ', en: 'Omega' },
  { ja: 'マグナⅡ', en: 'Omega Ⅱ' },
  { ja: '新石', en: 'T2 Summons' },
  { ja: 'エニアド', en: 'Ennead' },
  { ja: 'マリス', en: 'Malice' },
  { ja: '四大天司', en: 'Primarch' },
  { ja: '六竜', en: 'Six-Dragon' },
  { ja: 'レヴァンス', en: 'Revans' },
  { ja: '四象降臨', en: 'ROTB' },
  { ja: 'ゼノ', en: 'Xeno' },
  { ja: '古戦場', en: 'Guild Wars' },
  { ja: 'イベント', en: 'Event' },
  { ja: 'その他', en: 'Other' },
  { ja: '高難易度', en: 'Difficulty' },
] as const;

type TagKey = (typeof TAG_LIST)[number]['ja'];

export function tagText(key: TagKey) {
  const l = globalSettings.language || 'ja';
  const res = TAG_LIST.find(({ ja }) => ja === key);
  if (res) return res[l];
  return key;
}
