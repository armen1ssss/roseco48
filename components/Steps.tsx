import { steps } from '@/lib/content';

/**
 * Как проходит работа. Отвечает на главный страх B2B-заказчика:
 * «что будет после заявки и сколько ждать». В каждом шаге есть срок.
 * Четыре шага — предел: длинные схемы процессов пролистывают.
 */
export function Steps({ id = 'process' }: { id?: string }) {
  return (
    <section className="section section--line" id={id} aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="section-head">
          <p className="kicker">Процесс</p>
          <h2 className="h2" id={`${id}-title`}>
            Как проходит работа
          </h2>
        </div>

        <div className="grid-4">
          {steps.map((step) => (
            <div className="step" key={step.n}>
              <span className="step__n" aria-hidden="true">
                {step.n}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
