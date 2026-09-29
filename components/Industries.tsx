import Link from 'next/link';
import { industries } from '@/lib/content';

/**
 * Отраслевые решения — сетка, а не карусель: три карточки видны целиком,
 * прятать их за стрелками незачем.
 * Ссылки подписаны по-разному: по подписи понятно, куда ведёт,
 * в отличие от трёх «Подробнее» подряд.
 * Цвет не различает отрасли: различитель одним цветом не работает
 * для людей с дальтонизмом, а три близких оттенка не читаются и остальными.
 */
export function Industries() {
  return (
    <section className="section" id="otrasli" aria-labelledby="industries-title">
      <div className="container center">
        <div className="section-head">
          <p className="kicker">Для кого работаем</p>
          <h2 className="h2" id="industries-title">
            Отраслевые решения
          </h2>
          <p className="lead">
            У каждой отрасли свои задачи и свой набор документов. Соберём пакет под ваш случай — от одной пробы до
            годового мониторинга.
          </p>
        </div>

        <div className="grid-3" style={{ textAlign: 'left' }}>
          {industries.map((industry) => (
            <article className="card" key={industry.href}>
              <span className="card__icon" aria-hidden="true">
                {industry.icon}
              </span>
              <h3 className="h3">{industry.title}</h3>
              <ul className="card__list">
                {industry.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
              <Link className="link link--block card__foot" href={industry.href}>
                {industry.linkLabel} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
