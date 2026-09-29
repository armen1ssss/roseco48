import Link from 'next/link';
import { LogoMark } from './LogoMark';
import { company } from '@/lib/content';

const columns = [
  {
    title: 'Услуги',
    links: [
      { label: 'Анализ воды', href: '/uslugi/analiz-vody' },
      { label: 'Почва и грунты', href: '/uslugi/analiz-pochvy' },
      { label: 'Воздух и выбросы', href: '/uslugi/analiz-vozduha' },
      { label: 'Отходы', href: '/uslugi/othody' },
      { label: 'Проекты и документы', href: '/uslugi/proekty' },
      { label: 'Цены на анализы', href: '/ceny' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'О лаборатории', href: '/o-kompanii' },
      { label: 'Оборудование', href: '/o-kompanii#oborudovanie' },
      { label: 'Отрасли', href: '/otrasli' },
      { label: 'Контакты', href: '/kontakty' },
    ],
  },
  {
    title: 'Документы',
    links: [
      { label: 'Аттестат аккредитации', href: '/dokumenty#attestat' },
      { label: 'Область аккредитации', href: '/dokumenty#oblast' },
      { label: 'Лицензия Росгидромета', href: '/dokumenty#licenziya' },
      { label: 'Политика обработки ПД', href: '/politika' },
    ],
  },
];

/**
 * Подвал: тёмный тёплый фон вместо чёрного — держит палитру.
 * Вторичный текст #D8C39B на #2E2718 даёт 8.6:1 (AAA).
 * Ссылок не больше двадцати: подвал — не свалка.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <Link className="logo" href="/" style={{ color: '#fff' }}>
              <LogoMark color="#fff" />
              <span className="logo__text">РОСЭКО</span>
            </Link>
            <a className="footer__phone" href={company.phoneHref}>
              {company.phoneFree}
            </a>
            <p className="footer__contacts">
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <br />
              {company.addressFull}
              <br />
              {company.hours}
            </p>
          </div>

          <div className="footer__cols">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2>{column.title}</h2>
                <div className="footer__links">
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            {company.legalName} · ИНН {company.inn} · ОГРН {company.ogrn}
          </p>
          <p>
            © {new Date().getFullYear()} {company.name}. Сайт не является публичной офертой
          </p>
        </div>
      </div>
    </footer>
  );
}
