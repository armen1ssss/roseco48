import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHead } from '@/components/PageHead';
import { Steps } from '@/components/Steps';
import { BreadcrumbsJsonLd, ServiceJsonLd } from '@/components/JsonLd';
import { services, serviceBySlug } from '@/lib/services';
import { company, faq } from '@/lib/content';
import { canonicalUrl } from '@/lib/site';

/** Страницы услуг — статика: генерируются на этапе сборки, без лишнего JS. */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: canonicalUrl(`/uslugi/${service.slug}`) },
    openGraph: { title: `${service.title} — ГК «РОСЭКО»`, description: service.description },
  };
}

/**
 * Шаблон страницы услуги: один на шесть направлений.
 * Структура: что проверяем → что входит → сроки и документы → кому нужно → заявка.
 * Меняется контент (lib/services.ts), не вёрстка.
 */
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const crumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Услуги', href: '/uslugi' },
    { label: service.title, href: `/uslugi/${service.slug}` },
  ];

  return (
    <>
      <Header />
      <main id="main">
        <PageHead
          breadcrumbs={crumbs}
          kicker="Услуга"
          title={service.h1}
          lead={service.lead}
          actions={
            <>
              <Link className="btn btn--primary" href="#zayavka-usluga">
                Рассчитать стоимость
              </Link>
              <Link className="btn btn--ghost" href="/ceny">
                Цены по показателям
              </Link>
            </>
          }
        />

        <section className="section section--flush" aria-label="Что входит в работу">
          <div className="container">
            <div className="grid-2">
              <div>
                <h2 className="h3">Что проверяем</h2>
                <ul className="card__list mt-4">
                  {service.checks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="h3">Что входит в работу</h2>
                <ul className="card__list mt-4">
                  {service.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid-3 mt-7">
              <div className="card card--outline">
                <h3 className="h3">Сроки</h3>
                <p className="muted">{service.terms}</p>
              </div>
              <div className="card card--outline">
                <h3 className="h3">Что получите на руки</h3>
                <ul className="card__list mt-3">
                  {service.documents.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="card card--outline">
                <h3 className="h3">Кому это нужно</h3>
                <ul className="card__list mt-3">
                  {service.forWhom.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="small muted mt-6">
              Стоимость зависит от списка показателей и числа точек отбора. Цены по показателям —{' '}
              <Link className="link" href="/ceny">
                в прайсе
              </Link>
              . Пришлите перечень — посчитаем в день обращения и зафиксируем цену в договоре.
            </p>
          </div>
        </section>

        <Steps id="process-usluga" />

        <section className="section section--line" aria-labelledby="usluga-faq">
          <div className="container">
            <div className="section-head center">
              <p className="kicker">FAQ</p>
              <h2 className="h2" id="usluga-faq">
                Частые вопросы
              </h2>
            </div>
            <div className="faq">
              {faq.slice(0, 4).map((item, index) => (
                <details key={item.q} open={index === 0}>
                  <summary>{item.q}</summary>
                  <p className="faq__answer">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--line" id="zayavka-usluga" aria-labelledby="zayavka-usluga-title">
          <div className="container contact">
            <div>
              <div className="section-head">
                <p className="kicker">Связаться</p>
                <h2 className="h2" id="zayavka-usluga-title">
                  Позвоните — посчитаем стоимость
                </h2>
                <p className="lead">
                  Скажите объект, список показателей и число точек. Цену и срок назовём в разговоре: для расчёта
                  нужны детали, а их быстрее уточнить голосом.
                </p>
              </div>
              <div className="btn-row">
                <a className="btn btn--primary" href={company.phoneHref}>
                  Позвонить: {company.phoneFree}
                </a>
                <a className="btn btn--ghost" href={`mailto:${company.email}`}>
                  Написать письмо
                </a>
              </div>
            </div>
            <div className="info-list">
              <div>
                <span>Телефон</span>
                <b>
                  <a href={company.phoneHref}>{company.phoneFree}</a>
                </b>
              </div>
              <div>
                <span>Почта</span>
                <b>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </b>
              </div>
              <div>
                <span>Адрес</span>
                <b>{company.addressFull}</b>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ServiceJsonLd name={service.h1} description={service.description} slug={service.slug} />
      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
