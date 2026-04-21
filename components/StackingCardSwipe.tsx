import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';
import { useLanguage } from '../context/LanguageContext';
import 'swiper/css';
import 'swiper/css/effect-cards';

interface CardItem {
  id: string;
  titleKey: string;
  descKey: string;
  accent: string;
  imageUrl: string;
}

const INITIAL_CARDS: CardItem[] = [
  {
    id: 'card-1',
    titleKey: 'cardTitle_1',
    descKey: 'cardDesc_1',
    accent: 'from-cyan-500/50 to-violet-500/35',
    imageUrl: 'https://i.pinimg.com/1200x/5d/2f/72/5d2f72c1c69948d142231e3067d8f7a7.jpg',
  },
  {
    id: 'card-2',
    titleKey: 'cardTitle_2',
    descKey: 'cardDesc_2',
    accent: 'from-cyan-500/45 to-violet-500/30',
    imageUrl: 'https://i.pinimg.com/1200x/20/49/22/204922ea29920ee9e10922c0300a5ef8.jpg',
  },
  {
    id: 'card-3',
    titleKey: 'cardTitle_3',
    descKey: 'cardDesc_3',
    accent: 'from-cyan-500/40 to-violet-500/25',
    imageUrl: 'https://i.pinimg.com/1200x/51/05/8d/51058db60af863dc9dd4987e67d0d42f.jpg',
  },
  {
    id: 'card-4',
    titleKey: 'cardTitle_4',
    descKey: 'cardDesc_4',
    accent: 'from-cyan-500/35 to-violet-500/20',
    imageUrl: 'https://i.pinimg.com/1200x/ce/4f/eb/ce4febd00c098b9f18ad91f6e330731a.jpg',
  },
  {
    id: 'card-5',
    titleKey: 'cardTitle_5',
    descKey: 'cardDesc_5',
    accent: 'from-cyan-500/30 to-violet-500/15',
    imageUrl: 'https://i.pinimg.com/1200x/5c/a6/ef/5ca6ef600d5fbaa135762df503f4d3d0.jpg',
  },
  {
    id: 'card-6',
    titleKey: 'cardTitle_6',
    descKey: 'cardDesc_6',
    accent: 'from-cyan-500/20 to-violet-500/10',
    imageUrl: 'https://i.pinimg.com/1200x/b4/29/2c/b4292ce18b5a4f9c48998a09f67d9f7a.jpg',
  },
  {
    id: 'card-7',
    titleKey: 'cardTitle_7',
    descKey: 'cardDesc_7',
    accent: 'from-cyan-500/15 to-violet-500/5',
    imageUrl: 'https://i.pinimg.com/736x/fe/c0/8a/fec08a27ae224034d07ce86fb1741713.jpg',
  },
  {
    id: 'card-8',
    titleKey: 'cardTitle_8',
    descKey: 'cardDesc_8',
    accent: 'from-cyan-500/10 to-violet-500/0',
    imageUrl: 'https://i.pinimg.com/736x/85/07/87/85078789fb19dbbacc835d92db3e16cd.jpg',
  },
];

const StackingCardSwipe: React.FC = () => {
  const { t } = useLanguage();
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
                    alt={t(card.titleKey as any)}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="relative h-full flex flex-col justify-end p-6 text-white sm:p-8">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-zinc-200 sm:text-[11px]">
                        <span className="font-semibold">{t(card.titleKey as any)}</span>
                        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">
                          {t('cardSubtitle')}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-zinc-100 sm:text-base sm:leading-7">
                        {t(card.descKey as any)}
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
