import Link from 'next/link';
import { tiles } from '@/lib/content';

/**
 * Вход по задаче: «горячий» посетитель пришёл за анализом воды,
 * а не знакомиться с компанией. Один тап — и он в нужном разделе.
 * Формулировки — словами клиента, а не «испытания водных сред».
 */
export function Tiles() {
  return (
    <section className="section section--line" id="uslugi" aria-labelledby="tiles-title">
      <div className="container">
        <div className="section-head">
          <p className="kicker">Навигация по задаче</p>
          <h2 className="h2" id="tiles-title">
            Что нужно проверить?
          </h2>
          <p className="lead">Выберите объект — покажем методы, сроки и документы, которые получите на руки.</p>
        </div>

        <div className="grid-3">
          {tiles.map((tile) => (
            <Link className="tile" href={tile.href} key={tile.href}>
              <span className="tile__icon" aria-hidden="true">
                {tile.icon}
              </span>
              <span>
                <span className="tile__title">{tile.title}</span>
                <p>{tile.text}</p>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
