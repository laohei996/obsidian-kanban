import { StateManager } from 'src/StateManager';
import { LocaleCode, getCurrentLocaleCode } from 'src/lang/helpers';

import l10n from './flatpickr/l10n';
import { CustomLocale } from './flatpickr/types/locale';

const localeMap: Record<LocaleCode, CustomLocale> = {
  ar: l10n.ar,
  cs: l10n.cs,
  da: l10n.da,
  de: l10n.de,
  en: l10n.en,
  es: l10n.es,
  fr: l10n.fr,
  hi: l10n.hi,
  id: l10n.id,
  it: l10n.it,
  ja: l10n.ja,
  ko: l10n.ko,
  nl: l10n.nl,
  nn: l10n.nn,
  no: l10n.no,
  pl: l10n.pl,
  pt: l10n.pt,
  'pt-br': l10n.pt,
  ro: l10n.ro,
  ru: l10n.ru,
  sq: l10n.sq,
  tr: l10n.tr,
  uk: l10n.uk,
  'zh-cn': l10n.zh,
  'zh-tw': l10n.zh_tw,
};

export function getDefaultLocale(stateManager?: StateManager) {
  const firstDayOfWeek = stateManager?.getSetting('date-picker-week-start');
  const curLocale = localeMap[getCurrentLocaleCode()];

  if (
    typeof firstDayOfWeek === 'number' &&
    Number.isInteger(firstDayOfWeek) &&
    firstDayOfWeek >= 0 &&
    firstDayOfWeek <= 6
  ) {
    return {
      ...curLocale,
      firstDayOfWeek,
    };
  }

  return curLocale;
}
