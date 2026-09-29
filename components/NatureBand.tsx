import Image from 'next/image';
import { asset } from '@/lib/asset';
import { natureNumbers } from '@/lib/content';

/**
 * Природная полоса: тёмная панель с фактами + большое фото региона.
 *
 * Так решена задача «природа и животные»: кадр с полем живёт в отдельной
 * секции, где не спорит с текстом. Никакого коллажа «лаборатория + пейзаж».
 * Цифры 15 лет / 150 000 / 1000+ живут только здесь: повторённые дважды
 * на одной странице, они перестают работать как доказательство.
 *
 * Мобильный: текст, затем фотография под ним (3:2).
 * Десктоп: две половины рядом во всю высоту секции.
 */
export function NatureBand() {
  return (
    <section className="nature" aria-labelledby="nature-title">
      <div className="nature__inner">
        <div className="section-head">
          <p className="kicker" style={{ color: 'var(--on-dark-muted)' }}>
            Регион
          </p>
          <h2 className="h2 nature__title" id="nature-title">
            Смотрим за состоянием среды там, где живём и работаем
          </h2>
          <p className="nature__lead">
            Липецкая область — промышленность и сельское хозяйство рядом. Мы измеряем то, что между ними: воду,
            воздух, почву, отходы.
          </p>
        </div>

        <div className="nature__nums">
          {natureNumbers.map((item) => (
            <div key={item.value}>
              <b>{item.value}</b>
              <span>{item.caption}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="nature__photo">
        <Image
          src={asset('/photos/pole.jpg')}
          alt="Поле и лесополоса в Липецкой области на рассвете"
          fill
          sizes="(max-width: 1023px) 100vw, 50vw"
          className="nature__img"
        />
      </div>
    </section>
  );
}
