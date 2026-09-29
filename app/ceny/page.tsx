import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHead } from '@/components/PageHead';
import { PriceTable } from '@/components/PriceTable';
import { Steps } from '@/components/Steps';
import { Contacts } from '@/components/Contacts';
import { BreadcrumbsJsonLd } from '@/components/JsonLd';
import { canonicalUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Цены на анализы: вода, почва, воздух, отходы',
  description:
    'Прайс по показателям: анализ воды, почвы, воздуха, отходов, замеры шума и радиации, природоохранные проекты. Стоимость отбора проб и выезда за город.',
  alternates: { canonical: canonicalUrl('/ceny') },
};

const crumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Цены', href: '/ceny' },
];

/**
 * Страница цен. Прайс построен по показателям, а не по услугам:
 * заказчик ищет «сколько стоит анализ на нефтепродукты»,
 * а не «прайс на испытания».
 */
export default function PricesPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHead
          breadcrumbs={crumbs}
          kicker="Цены и расчёт"
          title="Цены на лабораторные исследования"
          lead="Считаем по показателям. Если нужного показателя в таблице нет — напишите, посчитаем отдельно: прайс покрывает основные работы, но не все."
          actions={
            <>
              <Link className="btn btn--primary" href="/kontakty#zayavka">
                Прислать список показателей
              </Link>
              <Link className="btn btn--ghost" href="/uslugi">
                Все услуги
              </Link>
            </>
          }
        />

        <section className="section section--flush" aria-label="Прайс">
          <div className="container">
            <PriceTable />
          </div>
        </section>

        <Steps id="process-ceny" />
        <Contacts />
      </main>
      <Footer />
      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
