import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHead } from '@/components/PageHead';
import { company } from '@/lib/content';
import { canonicalUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных',
  description: 'Как мы собираем, храним и используем персональные данные посетителей сайта.',
  robots: { index: false, follow: true },
  alternates: { canonical: canonicalUrl('/politika') },
};

const crumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Политика обработки ПД', href: '/politika' },
];

/**
 * Каркас политики под 152-ФЗ: структура и обязательные разделы.
 * Перед публикацией текст согласуется с юристом и утверждается приказом
 * руководителя — на странице об этом сказано прямо.
 */
const blocks: { title: string; text: string }[] = [
  {
    title: 'Какие данные собираем',
    text: 'Имя, телефон, адрес электронной почты, реквизиты организации — то, что вы сообщаете сами при звонке или в письме. Автоматически собираем обезличенные данные о посещении через систему веб-аналитики.',
  },
  {
    title: 'Зачем',
    text: 'Чтобы связаться с вами по заявке, рассчитать стоимость работ и подготовить договор. Для рекламных рассылок данные используем только с отдельного согласия.',
  },
  {
    title: 'Как храним',
    text: 'На серверах на территории Российской Федерации. Доступ к данным есть только у сотрудников, которым он нужен для работы с заявкой.',
  },
  {
    title: 'Кому передаём',
    text: 'Никому, кроме случаев, прямо предусмотренных законом. Третьим лицам данные не продаём и не передаём.',
  },
  {
    title: 'Сколько храним',
    text: 'Пока это нужно для работы с обращением, затем — в сроки, установленные законодательством для документов организации.',
  },
  {
    title: 'Ваши права',
    text: `Вы можете запросить сведения об обработке данных, потребовать их уточнения или удаления. Напишите на ${company.email} — ответим в течение 30 дней.`,
  },
];

export default function PolicyPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHead
          breadcrumbs={crumbs}
          title="Политика обработки персональных данных"
          lead={`Оператор — ${company.legalName} (${company.addressFull}). Политика описывает, какие данные мы собираем на сайте и что с ними делаем.`}
        />

        <section className="section section--flush">
          <div className="container">
            <div style={{ maxWidth: '72ch' }}>
              {blocks.map((block) => (
                <div key={block.title} style={{ marginBottom: 'var(--s-6)' }}>
                  <h2 className="h3">{block.title}</h2>
                  <p className="muted mt-3">{block.text}</p>
                </div>
              ))}
              <p className="small muted">
                Документ подготовлен как каркас: перед публикацией текст согласуется с юристом и утверждается
                приказом руководителя организации.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
