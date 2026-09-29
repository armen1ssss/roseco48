import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHead } from '@/components/PageHead';
import { Contacts } from '@/components/Contacts';
import { Faq } from '@/components/Faq';
import { BreadcrumbsJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { company, faq, mapPoint } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Контакты: Липецк, ул. М.И. Неделина, 1В',
  description: `Телефон ${company.phoneFree}, ${company.email}. Адрес: ${company.addressFull}. График: ${company.hours}. Отбор проб по Липецку и области.`,
  alternates: { canonical: '/kontakty' },
};

const crumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Контакты', href: '/kontakty' },
];

/**
 * Контакты. Привычный порядок: адрес и телефон, карта, как добраться,
 * реквизиты для договора. Ничего, что нужно искать по странице.
 */
export default function ContactsPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHead
          breadcrumbs={crumbs}
          kicker="Контакты"
          title="Как с нами связаться"
          lead={`Единый номер ${company.phoneFree} — бесплатно со всех телефонов. Городской номер — если по регламенту нужен липецкий. Почта ${company.email}.`}
        />
        <Contacts />

        <section className="section" aria-labelledby="route-title">
          <div className="container grid-2">
            <div>
              <h2 className="h2" id="route-title">
                Как добраться
              </h2>
              <p className="lead mt-4">
                Офис и лаборатория — в центре Липецка, {company.addressNote.toLowerCase()}. Приём проб и документов
                в рабочее время: {company.hours}.
              </p>
              <p className="mt-4">
                <a className="btn btn--ghost" href={mapPoint.link} target="_blank" rel="noopener noreferrer">
                  Построить маршрут: {mapPoint.label}
                </a>
              </p>
              <p className="small muted mt-4">
                Отбор проб по городу и области делаем сами — приезжаем на объект со своей посудой и актом отбора.
                Стоимость выезда зависит от расстояния, её называем при расчёте. Про{' '}
                <Link className="link" href="/ceny">
                  цены и выезд
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="h2">Реквизиты</h2>
              {/* Плейсхолдеры «…» в lib/content.ts: заменить на реальные ИНН/ОГРН перед публикацией */}
              <div className="info-list mt-4">
                <div>
                  <span>Юридическое название</span>
                  <b>{company.legalName}</b>
                </div>
                <div>
                  <span>ИНН</span>
                  <b>{company.inn}</b>
                </div>
                <div>
                  <span>ОГРН</span>
                  <b>{company.ogrn}</b>
                </div>
                <div>
                  <span>Юридический адрес</span>
                  <b>{company.addressFull}</b>
                </div>
                <div>
                  <span>Телефон и почта для документов</span>
                  <b>
                    <a href={company.phoneHref}>{company.phoneFree}</a>,{' '}
                    <a href={`mailto:${company.email}`}>{company.email}</a>
                  </b>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Faq />
      </main>
      <Footer />
      <BreadcrumbsJsonLd items={crumbs} />
      <FaqJsonLd items={faq} />
    </>
  );
}
