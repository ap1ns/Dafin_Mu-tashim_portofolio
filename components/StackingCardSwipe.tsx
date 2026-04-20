import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

interface CardItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  imageUrl: string;
}

const INITIAL_CARDS: CardItem[] = [
  {
    id: 'card-1',
    title: 'High Precision & Accuracy',
    subtitle: 'VALUE',
    description:
      'Possessing exceptional attention to detail in recording daily sales transactions and managing inventory to ensure zero discrepancies.',
    accent: 'from-cyan-500/50 to-violet-500/35',
    imageUrl: 'https://i.pinimg.com/1200x/5c/a8/0e/5ca80ea69eaaea75d596c4ed84489aa4.jpg',
  },
  {
    id: 'card-2',
    title: 'Disciplined & Reliable',
    subtitle: 'VALUE',
    description:
      'A highly disciplined professional committed to following Standard Operating Procedures (SOP) and meeting distribution targets consistently.',
    accent: 'from-cyan-500/45 to-violet-500/30',
    imageUrl: 'https://i.pinimg.com/736x/43/5d/25/435d25240e0a8cee30fc6e47d5fa69bc.jpg',
  },
  {
    id: 'card-3',
    title: 'Effective Collaborator',
    subtitle: 'VALUE',
    description:
      'Proven ability to work harmoniously within a team, as demonstrated through professional experience and active participation in competitive sports.',
    accent: 'from-cyan-500/40 to-violet-500/25',
    imageUrl: 'https://i.pinimg.com/1200x/23/57/4f/23574fc3d18a9bc4b8f59905a61c5635.jpg',
  },
  {
    id: 'card-4',
    title: 'Adaptive & Quick Learner',
    subtitle: 'VALUE',
    description:
      'Rapidly adapts to new work environments, technical systems, and operational workflows, ensuring a short learning curve.',
    accent: 'from-cyan-500/35 to-violet-500/20',
    imageUrl: 'https://i.pinimg.com/736x/c2/95/c3/c295c37e1f1232929e584a30301b15d8.jpg',
  },
  {
    id: 'card-5',
    title: 'Inventory Control Expert',
    subtitle: 'VALUE',
    description:
      'Experienced in managing stock flow, including accurate picking, packing, and verifying goods to maintain high customer satisfaction.',
    accent: 'from-cyan-500/30 to-violet-500/15',
    imageUrl: 'https://i.pinimg.com/736x/79/39/75/7939757da0fc7c990800bdb55ae61cdc.jpg',
  },
  {
    id: 'card-6',
    title: 'Tech-Savvy Operations',
    subtitle: 'VALUE',
    description:
      'Leveraging a Computer and Network Engineering background to master administrative software and digital tools for efficient management.',
    accent: 'from-cyan-500/20 to-violet-500/10',
    imageUrl: 'https://i.pinimg.com/1200x/95/d4/64/95d464f7a077f117442e4c9c62653238.jpg',
  },
  {
    id: 'card-7',
    title: 'Systematic Reporting',
    subtitle: 'VALUE',
    description:
      'Skilled in collecting data and transforming it into systematic, professional reports that support effective decision-making processes.',
    accent: 'from-cyan-500/15 to-violet-500/5',
    imageUrl: 'https://i.pinimg.com/736x/5d/aa/cc/5daaccf8af554418fb95b798bd89a9af.jpg',
  },
  {
    id: 'card-8',
    title: 'Efficient Time Management',
    subtitle: 'VALUE',
    description:
      'Able to manage high-volume tasks under tight deadlines while maintaining quality and speed in both administrative and field operations.',
    accent: 'from-cyan-500/10 to-violet-500/0',
    imageUrl: 'https://i.pinimg.com/736x/1f/bd/5c/1fbd5c84ef416e5073c9a95adbfc94ed.jpg',
  },
];

const StackingCardSwipe: React.FC = () => {
  return (
    <div className="mx-auto flex w-full max-w-[420px] justify-center px-4 py-6 sm:max-w-[440px] md:max-w-[460px] lg:max-w-[500px] xl:max-w-[520px]">
      <div className="relative w-full">
        <div className="absolute -right-2.5 -top-2.5 h-full w-full rounded-[3rem] bg-white/5 blur-2xl" />
        <div className="absolute -left-2.5 top-5 h-full w-full rounded-[3rem] bg-slate-700/10 shadow-[0_28px_56px_rgba(15,23,42,0.22)]" />

        <div className="relative w-full min-h-[380px] sm:min-h-[400px] md:min-h-[420px] lg:min-h-[440px]">
          <Swiper
            effect={'cards'}
            grabCursor={true}
            simulateTouch={true}
            allowTouchMove={true}
            loop={true}
            centeredSlides={true}
            slidesPerView={1}
            mousewheel={true}
            keyboard={{ enabled: true, onlyInViewport: true }}
            modules={[EffectCards, Mousewheel, Keyboard, Autoplay]}
            observer={true}
            observeParents={true}
            observeSlideChildren={true}
            speed={600}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="mySwiper !px-4"
            cardsEffect={{
              slideShadows: true,
              rotate: true,
              perSlideRotate: 3,
              perSlideOffset: 12,
            }}
            breakpoints={{
              640: {
                cardsEffect: {
                  slideShadows: true,
                  rotate: true,
                  perSlideRotate: 2.5,
                  perSlideOffset: 10,
                },
              },
              768: {
                cardsEffect: {
                  slideShadows: true,
                  rotate: true,
                  perSlideRotate: 2.2,
                  perSlideOffset: 9,
                },
              },
              1024: {
                cardsEffect: {
                  slideShadows: true,
                  rotate: true,
                  perSlideRotate: 2,
                  perSlideOffset: 8,
                },
              },
            }}
          >
            {INITIAL_CARDS.map((card) => (
              <SwiperSlide key={card.id}>
                <div className="relative h-[380px] w-full rounded-[2.5rem] border border-white/10 bg-zinc-950/80 shadow-[0_20px_48px_rgba(0,0,0,0.24)] backdrop-blur-2xl overflow-hidden sm:h-[400px] md:h-[420px] lg:h-[440px]">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="relative h-full flex flex-col justify-end p-6 text-white sm:p-8">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-zinc-200 sm:text-[11px]">
                        <span className="font-semibold">{card.title}</span>
                        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">
                          {card.subtitle}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-zinc-100 sm:text-base sm:leading-7">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default StackingCardSwipe;
