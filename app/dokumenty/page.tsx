import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHead } from '@/components/PageHead';
import { Docs } from '@/components/Docs';
import { Contacts } from '@/components/Contacts';
import { BreadcrumbsJsonLd } from '@/components/JsonLd';
import { asset } from '@/lib/asset';
import { company, documents } from '@/lib/content';
import { canonicalUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Документы: аттестат аккредитации, область аккредитации, лицензия',
  description:
    'Аттестат аккредитации испытательной лаборатории, область аккредитации, лицензия Росгидромета. Скачать PDF и проверить в реестрах Росаккредитации и Росгидромета.',
  alternates: { canonical: canonicalUrl('/dokumenty') },
};

const crumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Документы', href: '/dokumenty' },
];

/**
 * Страница документов — второй по важности раздел после услуг:
 * сюда приходит заказчик, который проверяет подрядчика перед тендером.
 * Правило: каждый документ можно скачать и проверить в реестре.
 */
export default function DocumentsPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHead
          breadcrumbs={crumbs}
          kicker="Статус и аккредитация"
          title="Документы лаборатории"
          lead="Протоколы лаборатории принимают Росприроднадзор, Роспотребнадзор и суды. Каждый документ можно скачать и проверить в реестре — ссылки под карточками."
        />

        <Docs />

        <section className="section section--line" id="registry" aria-labelledby="docs-help">
          <div className="container">
            <h2 className="h2" id="docs-help">
              Как проверить лабораторию
            </h2>
            <div className="grid-3">
              <div className="card card--outline">
                <h3 className="h3">Что такое область аккредитации</h3>
                <p className="muted">
                  Это перечень методик и объектов, по которым лаборатория имеет право выдавать протоколы. Если
                  показателя в области нет — протокол по нему не имеет силы.
                </p>
              </div>
              <div className="card card--outline">
                <h3 className="h3">Как проверить статус</h3>
                <p className="muted">
                  Откройте реестр Росаккредитации и сверьте номер аттестата {company.accreditation} и статус
                  «действует». Это займёт минуту и не требует звонка.
                </p>
              </div>
              <div className="card card--outline">
                <h3 className="h3">Реквизиты для договора</h3>
                <p className="muted">
                  {company.legalName}. ИНН {company.inn}, ОГРН {company.ogrn}. Счёт и договор готовим в день
                  обращения.
                </p>
              </div>
            </div>

            <p className="small muted mt-6">
              Не хватает документа или нужна заверенная копия?{' '}
              <Link className="link" href="/kontakty#zayavka">
                Напишите — подготовим
              </Link>
              .
            </p>

            <ul className="mt-6">
              {documents.map((doc) => (
                <li key={doc.id} className="small muted">
                  {doc.title} — <a className="link" href={asset(doc.href)}>{doc.file}</a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Contacts />
      </main>
      <Footer />
      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
