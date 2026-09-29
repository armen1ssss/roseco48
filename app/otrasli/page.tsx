import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHead } from '@/components/PageHead';
import { Steps } from '@/components/Steps';
import { Contacts } from '@/components/Contacts';
import { BreadcrumbsJsonLd } from '@/components/JsonLd';
import { industries } from '@/lib/content';
import { canonicalUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Отраслевые решения: госсектор, промышленность, АПК',
  description:
    'Экологическое сопровождение для водоканалов, заводов, строительных компаний и агрохолдингов Липецкой области: анализы, замеры, проекты и отчётность.',
  alternates: { canonical: canonicalUrl('/otrasli') },
};

const crumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Отрасли', href: '/otrasli' },
];

/**
 * Типовые работы по группам заказчиков. Цифр по конкретным договорам здесь нет:
 * их нельзя опубликовать без согласия заказчика — оставляем только то, что
 * честно повторяется из проекта в проект.
 */
const cases = [
  {
    id: 'gossektor',
    title: 'Водоканал: контроль качества воды',
    text: 'Отбор проб по точкам сети, химический и бактериологический анализ, протоколы для отчётности и тендеров.',
    result: 'Протоколы по области аккредитации — для отчётности и тендеров',
  },
  {
    id: 'promyshlennost',
    title: 'Промышленная площадка: выбросы и СЗЗ',
    text: 'Замеры на источниках выбросов, расчёт рассеивания, проект санитарно-защитной зоны и сопровождение согласования.',
    result: 'Замеры, расчёт и проект — в одной организации',
  },
  {
    id: 'apk',
    title: 'Агрохолдинг: обследование полей',
    text: 'Отбор проб по контурам полей, агрохимия и токсикология, карта плодородия с рекомендациями по удобрениям.',
    result: 'Карта плодородия и рекомендации по удобрениям — вместе с протоколами',
  },
];

/**
 * Отрасли. Показываем не «мы работаем со всеми», а конкретные задачи
 * каждой группы заказчиков и результат — цифрой в карточке.
 * Названия заказчиков не публикуем без письменного согласия.
 */
export default function IndustriesPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHead
          breadcrumbs={crumbs}
          kicker="Для кого работаем"
          title="Отраслевые решения"
          lead="Три группы заказчиков — три набора задач. Ниже — типовые работы и то, чем они заканчиваются."
        />

        <section className="section section--flush" aria-label="Отрасли и примеры">
          <div className="container">
            <div className="grid-3">
              {industries.map((industry, index) => (
                <article className="card card--outline" key={industry.title} id={cases[index]?.id}>
                  <span className="card__icon" aria-hidden="true">
                    {industry.icon}
                  </span>
                  <h2 className="h3">{industry.title}</h2>
                  <ul className="card__list">
                    {industry.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <h2 className="h2 mt-7">Как это выглядит на практике</h2>
            <div className="grid-3">
              {cases.map((item) => (
                <article className="card card--sand" key={item.id}>
                  <h3 className="h3">{item.title}</h3>
                  <p className="muted">{item.text}</p>
                  <p className="card__foot small muted">{item.result}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Steps id="process-otrasli" />
        <Contacts />
      </main>
      <Footer />
      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
