import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHead } from '@/components/PageHead';
import { Steps } from '@/components/Steps';
import { Faq } from '@/components/Faq';
import { Contacts } from '@/components/Contacts';
import { BreadcrumbsJsonLd } from '@/components/JsonLd';
import { services } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Услуги: анализы воды, почвы, воздуха и отходов',
  description:
    'Лабораторные исследования и природоохранная документация: анализ воды, почвы, воздуха, отходов, замеры шума и радиации, проекты НДВ, ПНООЛР, СЗЗ.',
  alternates: { canonical: '/uslugi' },
};

const crumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Услуги', href: '/uslugi' },
];

/**
 * Хаб услуг. Деление — по объекту исследования, а не по внутренней
 * структуре компании: так ищет клиент. Шесть направлений, каждое — своя
 * страница со своим URL.
 */
export default function ServicesPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHead
          breadcrumbs={crumbs}
          kicker="Услуги и цены"
          title="Лабораторные исследования и природоохранные документы"
          lead="Шесть направлений: вода, почва, воздух, отходы, физические факторы и проектная документация. Стоимость считаем по показателям — пришлите список, и мы назовём цену в день обращения."
          actions={
            <>
              <Link className="btn btn--primary" href="/kontakty#zayavka">
                Рассчитать стоимость
              </Link>
              <Link className="btn btn--ghost" href="/ceny">
                Цены по показателям
              </Link>
            </>
          }
        />

        <section className="section section--flush" aria-label="Направления">
          <div className="container">
            <div className="grid-3">
              {services.map((service) => (
                <Link className="tile" href={`/uslugi/${service.slug}`} key={service.slug}>
                  <span className="tile__icon" aria-hidden="true">
                    {service.icon}
                  </span>
                  <span>
                    <span className="tile__title">{service.title}</span>
                    <p>{service.lead}</p>
                  </span>
                </Link>
              ))}
            </div>

            <p className="small muted mt-6">
              Нужного показателя нет в прайсе? Напишите — посчитаем отдельно: таблица покрывает основные работы,
              но не все.
            </p>
          </div>
        </section>

        <Steps />
        <Faq />
        <Contacts />
      </main>
      <Footer />
      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
