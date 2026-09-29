'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoMark } from './LogoMark';
import { company, nav } from '@/lib/content';

/**
 * Шапка: липкая, высота 64 px на мобильном и 76 px на десктопе.
 * Телефон виден всегда — для лаборатории звонок первый контакт.
 * Кнопка справа ведёт на звонок: заявку принимаем голосом, формы на сайте нет.
 *
 * Мобильное меню: панель на весь экран, цели ≥44 px, закрывается по Esc
 * и по переходу, фокус возвращается на кнопку. Скролл фона блокируется.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Закрываем меню при переходе на другую страницу
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Переносим фокус в панель: так меню доступно с клавиатуры
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="header">
      <div className="container header__row">
        <Link className="logo" href="/" aria-label={`${company.name} — на главную`}>
          <LogoMark />
          <span className="logo__text">РОСЭКО</span>
        </Link>

        <nav className="header__nav" aria-label="Основная навигация">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <a className="header__phone" href={company.phoneHref}>
          <b>{company.phoneFree}</b>
          <span>звонок бесплатный · {company.hoursShort}</span>
        </a>

        <a className="btn btn--primary btn--sm header__cta" href={company.phoneHref}>
          Позвонить
        </a>

        <button
          ref={burgerRef}
          type="button"
          className="header__burger"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Закрыть' : 'Меню'}
        </button>
      </div>

      {open && (
        <div className="mobile-menu" id="mobile-menu" ref={panelRef}>
          <nav aria-label="Мобильная навигация">
            <ul className="mobile-menu__list">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mobile-menu__foot">
            <a className="mobile-menu__phone" href={company.phoneHref}>
              {company.phoneFree}
            </a>
            <p className="mobile-menu__hours">
              звонок бесплатный · {company.hours}
              <br />
              {company.email}
            </p>
            <Link className="btn btn--primary" href="/kontakty#zayavka">
              Контакты и карта
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
