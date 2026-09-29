import Image from 'next/image';
import { asset } from '@/lib/asset';
import Link from 'next/link';
import { company } from '@/lib/content';

/**
 * Первый экран: фотография на всю ширину, текст поверх, затемнение.
 *
 * Кадр подобран под композицию: специалист отбирает пробу воды — работа,
 * а не постановочный портрет. Он стоит справа, текст занимает левую треть,
 * поэтому человек в кадре остаётся виден целиком.
 *
 * Затемнение постоянное, в CSS: если фото заменят, читаемость сохранится.
 * Без него белый текст на светлых участках воды и неба даёт 2–3:1 — ниже AA.
 *
 * Вместо цифр о себе — сообщение о том, как устроена работа: пробы забираем
 * сами, протоколы отдаём в срок. Без цитат от лица сотрудников заказчика.
 *
 * Мобильный: кадр обрезается вертикально, затемнение усиливается снизу,
 * текст стоит внизу, кнопки — во всю ширину (52 px, комфортная цель),
 * главная кнопка ведёт на звонок.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Image
        src={asset('/photos/hero.jpg')}
        alt="Специалист лаборатории отбирает пробу воды из реки"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="hero__bg"
      />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container">
        <div className="hero__inner">
          <p className="hero__kicker">Испытательная лаборатория · Липецк</p>
          <h1 className="hero__title" id="hero-title">
            Экологические анализы воды, почвы и воздуха — от пробы до протокола
          </h1>

          <p className="hero__lead">
            Контролируем качество воды по графику. Пробы забирают на месте, протоколы приходят в срок — за пять лет
            ни одной просрочки по договору.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href={company.phoneHref}>
              Позвонить: {company.phoneFree}
            </a>
            <Link className="btn btn--light" href="/ceny">
              Цены по показателям
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
