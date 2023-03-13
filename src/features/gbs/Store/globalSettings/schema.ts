import { getUserDarkMode, getUserLanguage } from '@gbs/utils';
import { z } from 'zod';

/**
 * 設定のバージョン
 */
export const VERSION = 1;

/**
 * カラムの最大数
 */
export const MAX_COLUMN_NUM = 6;

export const zFilterItem = z.object({
  id: z.number().int().min(-1),
  regex: z.string().optional(),
  level: z.string().optional(),
});
export type FilterItem = z.infer<typeof zFilterItem>;

export const zSoundType = z.enum(['0', '1', '2', '3']);
export type SoundType = z.infer<typeof zSoundType>;

export const zSoundOptions = z.object({
  type: zSoundType.default('0'),
  volume: z.number().min(0).max(1).default(0.2),
  isMute: z.boolean().default(true),
});
export type SoundOptions = z.infer<typeof zSoundOptions>;

export const zDuplicateOption = z.enum([
  'all',
  'latest',
  '1m',
  '2m',
  '3m',
  '5m',
  '10m',
]);
export type DuplicateOption = z.infer<typeof zDuplicateOption>;

export const zElapsedOption = z.enum(['all', '2s', '3s', '4s', '5s']);
export type ElapsedOption = z.infer<typeof zElapsedOption>;

export const zColumnOptions = z.object({
  name: z.string().default(''),
  filters: z.array(zFilterItem).default([]),
  duplicate: zDuplicateOption.default('latest'),
  elapsed: zElapsedOption.default('all'),
  autoCopy: z.boolean().default(false),
  sound: zSoundOptions.default({}),
});
export type ColumnOptions = z.infer<typeof zColumnOptions>;

export const zColumnGroupKey = z.enum(['1', '2', '3', '4']);
export type ColumnGroupKey = z.infer<typeof zColumnGroupKey>;

export const zColumnGroup = (key: ColumnGroupKey) =>
  z.object({
    key: z.literal(key).default(key),
    columns: z.array(zColumnOptions).max(MAX_COLUMN_NUM).default([{}]),
  });
export type ColumnGroup = z.infer<ReturnType<typeof zColumnGroup>>;

export const zColumnGroupMap = z.object({
  '1': zColumnGroup('1').default({}),
  '2': zColumnGroup('2').default({}),
  '3': zColumnGroup('3').default({}),
  '4': zColumnGroup('4').default({}),
});
export type ColumnSetMap = z.infer<typeof zColumnGroupMap>;

export const zColumnSize = z.enum(['s', 'm', 'l']);
export type ColumnSize = z.infer<typeof zColumnSize>;

export const zColumnType = z.enum(['1line', '2lines']);
export type ColumnType = z.infer<typeof zColumnType>;

export const zLanguageOption = z.enum(['en', 'ja']);
export type LanguageOption = z.infer<typeof zLanguageOption>;

export const zMenuPosition = z.enum(['left', 'right']);
export type MenuPosition = z.infer<typeof zMenuPosition>;

export const zClickAction = z.enum([
  'copy',
  'pc:browser',
  'mobile:mbga',
  'mobile:app',
]);
export type ClickAction = z.infer<typeof zClickAction>;

export const zCopyButtonOption = z.enum(['none', 'top', 'bottom', 'overlay']);
export type CopyButtonOption = z.infer<typeof zCopyButtonOption>;

export const zGlobalSettings = z.object({
  columnSize: zColumnSize.default('s'),
  columnType: zColumnType.default('1line'),
  language: zLanguageOption.default(getUserLanguage()),
  copyButton: zCopyButtonOption.default('none'),
  clickAction: zClickAction.default('copy'),
  showImage: z.boolean().default(true),
  darkMode: z.boolean().default(getUserDarkMode()),
  orderByTweetTime: z.boolean().default(true),
  log: z.boolean().default(false),
  columnGroup: zColumnGroupMap.default({}),
  currentGroupKey: zColumnGroupKey.default('1'),
  compact: z.boolean().default(false),
  noScroll: z.boolean().default(false),
  showMoveButton: z.boolean().default(false),
  menuPotision: zMenuPosition.default('right'),
  fewerTweets: z.boolean().default(false),
});
export type GlobalSettings = z.infer<typeof zGlobalSettings>;
