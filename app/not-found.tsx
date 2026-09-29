import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { company, tiles } from '@/lib/content';

export const metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: false },
};

/**
 * 404: объясняем, что произошло, и даём выход — разделы услуг и телефон.
 * Никаких картинок с котами: человек пришёл по делу.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="container notfound">
        <p className="notfound__code">Ошибка 404</p>
        <h1 className="page-head__title">Такой страницы нет</h1>
        <p className="lead">
          Возможно, адрес изменился или в ссылке опечатка. Ниже — разделы, с которых чаще всего начинают.
        </p>

        <div className="grid-3" style={{ marginTop: 'var(--s-6)' }}>
          {tiles.slice(0, 3).map((tile) => (
            <Link className="tile" href={tile.href} key={tile.href}>
              <span className="tile__icon" aria-hidden="true">
                {tile.icon}
              </span>
              <span>
                <span className="tile__title">{tile.title}</span>
                <p>{tile.text}</p>
              </span>
            </Link>
          ))}
        </div>

        <div className="btn-row">
          <Link className="btn btn--primary" href="/uslugi">
            Все услуги
          </Link>
          <a className="btn btn--ghost" href={company.phoneHref}>
            {company.phoneFree}
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
