"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const mainFeatures = [
  {
    title: "Анатомічна форма",
    text: "Завдяки анатомічній формі, беруші легко адаптуються до індивідуальної будови вушного каналу, забезпечуючи надійну фіксацію та ефективне шумозаглушення.",
  },
  {
    title: "Комплект змінних насадок",
    text: "Ваш розмір знайдеться! У комплекті чотири розміри амбушур: XS, S, M і L (від 10 до 13 мм). Тому саме цей комплект підходить і вам, і тим, у кого вуха менші чи більші за середні.",
  },
  {
    title: "Футляр у комплекті",
    text: "Беруші постачаються в зручному футлярі: усе потрібне лежить в одному місці й під рукою.\nЧистота. Беруші не збирають пил і ворсинки в сумці чи на тумбочці.\nНічого не губиться. Для берушів і змінних амбушур є окремі місця.\nЗавжди з собою. Компактний футляр і шнурок: беріть у дорогу, на роботу чи в подорож.\nЗахист від пошкоджень. Жорсткий корпус оберігає м’який силікон.\nПорядок. Ви завжди знаєте, де ваші беруші.",
  },
  {
    title: "М’який силікон",
    text: "Беруші створено з м’якого силікону: він підходить для сну, не тисне навіть при тривалому носінні. М’який матеріал не заважає лежати на подушці.\nСилікон повторює форму вуха, тому шум не проходить повз беруші.\nЛегкий догляд. Достатньо промити й висушити.\nБагаторазові. Зберігають форму й служать місяцями.",
  },
];

export function About() {
  return (
    <section id="about" className="section-shell relative -mt-4 pb-12 pt-8 md:-mt-10 md:pb-16 md:pt-12">
      <span className="section-number">03</span>

      <div className="section-container">
        <Reveal>
          <SectionHeading line1="ПРО" line2="ПРОДУКТ" />
        </Reveal>

        <div className="mt-8 max-w-3xl space-y-8 sm:mt-10 sm:space-y-12">
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base md:text-lg">
              Беруші для сну призначені для ефективного зниження рівня зовнішнього шуму та забезпечення комфортного відпочинку в будь-яких умовах. Виріб виготовлений з м’якого гіпоалергенного силікону, що безпечно контактує зі шкірою та не викликає дискомфорту навіть при тривалому використанні. (В наявності 2 кольори)
              <br /><br />
              Завдяки анатомічній формі та комплекту змінних насадок чотирьох розмірів (XS / S / M / L), беруші легко адаптуються до індивідуальної будови вушного каналу, забезпечуючи надійну фіксацію та ефективне шумозаглушення.
              <br /><br />
              Підходять для використання під час сну, подорожей, роботи, навчання, а також у шумному середовищі.
            </p>
          </Reveal>

          <div className="h-px w-full bg-border" />

          <Reveal delay={0.15}>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                Основні переваги та функції
              </h4>
              <ul className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
                {mainFeatures.map((feature) => (
                  <li key={feature.title} className="space-y-1.5 sm:space-y-2">
                    <p className="font-display text-base font-bold sm:text-lg md:text-xl">
                      {feature.title}
                    </p>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-muted sm:text-base">{feature.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
