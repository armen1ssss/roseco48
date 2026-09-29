import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHead } from '@/components/PageHead';
import { Lab } from '@/components/Lab';
import { NatureBand } from '@/components/NatureBand';
import { Clients } from '@/components/Clients';
import { Steps } from '@/components/Steps';
import { Contacts } from '@/components/Contacts';
import { BreadcrumbsJsonLd } from '@/components/JsonLd';
import { company, trustFacts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'О лаборатории: испытательный центр и проектная группа в Липецке',
  description:
    'Лаборатория работает с 2010 года: 150 000 исследований, 1000+ проектов, аналитическое оборудование, резидент МБУ «Технопарк-Липецк» и участник ОЭЗ РУ «Липецк-Технополюс».',
  alternates: { canonical: '/o-kompanii' },
};

const crumbs = [
  { label: 'Главная', href: '/' },
  { label: 'О компании', href: '/o-kompanii' },
];

/**
 * О компании — без «динамично развивающейся компании» и «команды
 * профессионалов». Только проверяемое: годы, объёмы, статусы, оборудование.
 * Здесь строка доверия уместна: это отдельная страница, а не вход на сайт,
 * и цифры не дублируются с главной в одном поле зрения.
 */
export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHead
          breadcrumbs={crumbs}
          kicker="О компании"
          title="Испытательная лаборатория и проектная группа в Липецке"
          lead={`Мы делаем измерения и готовим природоохранные документы. Работаем с ${company.yearFounded} года: за это время провели 150 000 исследований и закрыли больше 1000 проектов для предприятий области.`}
        />

        <section className="section section--flush" aria-label="Ключевые показатели">
          <div className="container">
            <ul className="grid-3">
              {trustFacts.map((fact) => (
                <li className="card card--outline" key={fact.value}>
                  <b style={{ fontSize: 26, lineHeight: 1.15 }}>{fact.value}</b>
                  <span className="muted">{fact.caption}</span>
                </li>
              ))}
            </ul>

            <div className="grid-2 mt-7">
              <div>
                <h2 className="h2">Чем занимаемся</h2>
                <p className="lead">
                  Два направления, которые работают вместе: лабораторные исследования и проектная группа. Замеры
                  нужны для расчётов, а расчёты — для документов, поэтому держим их в одной компании.
                </p>
              </div>
              <div className="card card--sand">
                <h3 className="h3">Научная работа</h3>
                <p className="muted">
                  Как резидент МБУ «Технопарк-Липецк» и участник ОЭЗ РУ «Липецк-Технополюс» ведём исследования по
                  методам диагностики почв и детоксикации техногенно нагруженных территорий Липецкой области.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Lab />

        <Steps id="process-about" />
        <NatureBand />
        <Clients />

        <section className="section section--line" aria-labelledby="docs-cta">
          <div className="container center">
            <h2 className="h2" id="docs-cta">
              Документы и статус
            </h2>
            <p className="lead">
              Аттестат аккредитации, область аккредитации и лицензия Росгидромета — с реквизитами и ссылками в
              реестры.
            </p>
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              <a className="btn btn--primary" href="/dokumenty">
                Открыть документы
              </a>
            </div>
          </div>
        </section>

        <Contacts />
      </main>
      <Footer />
      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
