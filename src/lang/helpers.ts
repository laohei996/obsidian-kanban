import ar from './locale/ar';
import cz from './locale/cz';
import da from './locale/da';
import de from './locale/de';
import en, { Lang } from './locale/en';
import es from './locale/es';
import fr from './locale/fr';
import hi from './locale/hi';
import id from './locale/id';
import it from './locale/it';
import ja from './locale/ja';
import ko from './locale/ko';
import nl from './locale/nl';
import no from './locale/no';
import pl from './locale/pl';
import pt from './locale/pt';
import ptBR from './locale/pt-br';
import ro from './locale/ro';
import ru from './locale/ru';
import sq from './locale/sq';
import tr from './locale/tr';
import uk from './locale/uk';
import zhCN from './locale/zh-cn';
import zhTW from './locale/zh-tw';

export type LocaleCode =
  | 'ar'
  | 'cs'
  | 'da'
  | 'de'
  | 'en'
  | 'es'
  | 'fr'
  | 'hi'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'nl'
  | 'nn'
  | 'no'
  | 'pl'
  | 'pt'
  | 'pt-br'
  | 'ro'
  | 'ru'
  | 'sq'
  | 'tr'
  | 'uk'
  | 'zh-cn'
  | 'zh-tw';

const localeMap: Record<LocaleCode, Partial<Lang>> = {
  ar,
  cs: cz,
  da,
  de,
  en,
  es,
  fr,
  hi,
  id,
  it,
  ja,
  ko,
  nl,
  nn: no,
  no,
  pl,
  pt,
  'pt-br': ptBR,
  ro,
  ru,
  sq,
  tr,
  uk,
  'zh-cn': zhCN,
  'zh-tw': zhTW,
};

const localeAliases: Record<string, LocaleCode> = {
  cz: 'cs',
  nb: 'no',
  'pt-br': 'pt-br',
  zh: 'zh-cn',
  'zh-cn': 'zh-cn',
  'zh-hans': 'zh-cn',
  'zh-sg': 'zh-cn',
  'zh-hant': 'zh-tw',
  'zh-hk': 'zh-tw',
  'zh-mo': 'zh-tw',
  'zh-tw': 'zh-tw',
};

function getMappedLocale(locale: string): LocaleCode | undefined {
  if (Object.prototype.hasOwnProperty.call(localeAliases, locale)) {
    return localeAliases[locale];
  }
  if (Object.prototype.hasOwnProperty.call(localeMap, locale)) {
    return locale as LocaleCode;
  }
}

export function normalizeLocaleCode(rawLocale?: string | null): LocaleCode {
  const normalized = (rawLocale || 'en').trim().toLowerCase().replace(/_/g, '-');
  if (!normalized) return 'en';

  const exact = getMappedLocale(normalized);
  if (exact) return exact;

  const parts = normalized.split('-');
  for (let length = parts.length - 1; length > 0; length--) {
    const mapped = getMappedLocale(parts.slice(0, length).join('-'));
    if (mapped) return mapped;
  }

  return 'en';
}

let cachedRawLocale: string | null | undefined;
let cachedLocaleCode: LocaleCode | undefined;

export function getCurrentLocaleCode(): LocaleCode {
  const rawLocale = window.localStorage.getItem('language');
  if (rawLocale !== cachedRawLocale || !cachedLocaleCode) {
    cachedRawLocale = rawLocale;
    cachedLocaleCode = normalizeLocaleCode(rawLocale);
  }

  return cachedLocaleCode;
}

export function t(str: keyof typeof en, replacements?: Record<string, string | number>): string {
  const locale = localeMap[getCurrentLocaleCode()];
  let translation = locale[str] ?? en[str];

  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      translation = translation.replace(new RegExp(`{{\\s*${escapedKey}\\s*}}`, 'g'), () =>
        String(value)
      );
    });
  }

  return translation;
}
