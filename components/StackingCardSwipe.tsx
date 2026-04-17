import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface CardItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    accent: string;
    imageUrl: string;
}

// Add more cards here manually. Each card should have a unique id, title, subtitle, description, accent, and imageUrl.
// Example:
// {
//     id: 'card-6',
//     title: 'NEW TITLE',
//     subtitle: 'New Subtitle',
//     description: 'New description here.',
//     accent: 'from-new-color/30 to-new-color/20',
//     imageUrl: '/img/new-image.png',
// },
const INITIAL_CARDS: CardItem[] = [
    {
        id: 'card-1',
        title: 'High Precision & Accuracy',
        subtitle: 'VALUE',
        description: 'Possessing exceptional attention to detail in recording daily sales transactions and managing inventory to ensure zero discrepancies.',
        accent: 'from-cyan-500/50 to-violet-500/35',
        imageUrl: 'https://i.pinimg.com/1200x/5c/a8/0e/5ca80ea69eaaea75d596c4ed84489aa4.jpg',
    },
    {
        id: 'card-2',
        title: 'Disciplined & Reliable',
        subtitle: 'VALUE',
        description: 'A highly disciplined professional committed to following Standard Operating Procedures (SOP) and meeting distribution targets consistently.',
        accent: 'from-cyan-500/45 to-violet-500/30',
        imageUrl: 'https://i.pinimg.com/736x/43/5d/25/435d25240e0a8cee30fc6e47d5fa69bc.jpg',
    },
    {
        id: 'card-3',
        title: 'Effective Collaborator',
        subtitle: 'VALUE',
        description: 'Proven ability to work harmoniously within a team, as demonstrated through professional experience and active participation in competitive sports.',
        accent: 'from-cyan-500/40 to-violet-500/25',
        imageUrl: 'https://i.pinimg.com/1200x/23/57/4f/23574fc3d18a9bc4b8f59905a61c5635.jpg',
    },
    {
        id: 'card-4',
        title: 'Adaptive & Quick Learner',
        subtitle: 'VALUE',
        description: 'Rapidly adapts to new work environments, technical systems, and operational workflows, ensuring a short learning curve.',
        accent: 'from-cyan-500/35 to-violet-500/20',
        imageUrl: 'https://i.pinimg.com/736x/c2/95/c3/c295c37e1f1232929e584a30301b15d8.jpg',
    },
    {
        id: 'card-5',
        title: 'Inventory Control Expert',
        subtitle: 'VALUE',
        description: 'Experienced in managing stock flow, including accurate picking, packing, and verifying goods to maintain high customer satisfaction.',
        accent: 'from-cyan-500/30 to-violet-500/15',
        imageUrl: 'https://i.pinimg.com/736x/79/39/75/7939757da0fc7c990800bdb55ae61cdc.jpg',
    },
    {
        id: 'card-6',
        title: 'Tech-Savvy Operations',
        subtitle: 'VALUE',
        description: 'Leveraging a Computer and Network Engineering background to master administrative software and digital tools for efficient management.',
        accent: 'from-cyan-500/20 to-violet-500/10',
        imageUrl: 'https://i.pinimg.com/1200x/95/d4/64/95d464f7a077f117442e4c9c62653238.jpg',
    },
    {
        id: 'card-7',
        title: 'Systematic Reporting',
        subtitle: 'VALUE',
        description: 'Skilled in collecting data and transforming it into systematic, professional reports that support effective decision-making processes.',
        accent: 'from-cyan-500/15 to-violet-500/5',
        imageUrl: 'https://i.pinimg.com/736x/b8/d9/8c/b8d98c44f9f67afd75a44720360dd3c0.jpg',
    },
    {
        id: 'card-8',
        title: 'Efficient Time Management',
        subtitle: 'VALUE',
        description: 'Able to manage high-volume tasks under tight deadlines while maintaining quality and speed in both administrative and field operations.',
        accent: 'from-cyan-500/10 to-violet-500/0',
        imageUrl: 'https://i.pinimg.com/736x/53/51/69/535169270fbdba18922b3e2cb430d1b0.jpg',
    },
];

const CARD_VISIBLE_COUNT = 8;

const StackingCardSwipe: React.FC = () => {
    const [cards, setCards] = useState<CardItem[]>(INITIAL_CARDS);
    const [swipeDirection, setSwipeDirection] = useState<'up' | 'right' | 'left' | 'down'>('up');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const autoSwipeRef = useRef<number | null>(null);

    const visibleCards = cards.slice(0, CARD_VISIBLE_COUNT);

    const moveTopCardToBottom = () => {
        if (isAnimating || cards.length <= 1) return;

        setSwipeDirection('up');
        setIsAnimating(true);

        // Setelah animasi keluar selesai, susun ulang kartu
        window.setTimeout(() => {
            setCards((prevCards) => {
                const [first, ...rest] = prevCards;
                return [...rest, first];
            });
            setIsAnimating(false);
        }, 250);
    };

    useEffect(() => {
        if (isPaused || isAnimating) return;

        autoSwipeRef.current = window.setInterval(() => {
            moveTopCardToBottom();
        }, 2800);

        return () => {
            if (autoSwipeRef.current) {
                window.clearInterval(autoSwipeRef.current);
            }
        };
    }, [isPaused, isAnimating, cards]);

    return (
        <div className="mx-auto flex w-full max-w-[420px] justify-center px-4 py-10 sm:px-6">
            <div
                className="relative w-full"
            >
                <div className="absolute -right-4 -top-4 h-full w-full rounded-[4rem] bg-white/5 blur-2xl" />
                <div className="absolute -left-4 top-8 h-full w-full rounded-[4rem] bg-slate-700/10 shadow-[0_40px_80px_rgba(15,23,42,0.35)]" />

                <div className="relative w-full min-h-[460px]">
                    {visibleCards
                        .slice(1)
                        .reverse()
                        .map((card, index) => {
                            const level = index + 1;
                            const scale = 1 - level * 0.04;
                            const y = 0;
                            const rotate = level * 2;

                            return (
                                <motion.div
                                    key={card.id}
                                    className="absolute inset-x-0 mx-auto h-[420px] w-full rounded-[3rem] border border-white/10 bg-zinc-950/80 shadow-[0_30px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl cursor-pointer overflow-hidden"
                                    style={{ zIndex: 50 - level, filter: `blur(${level * 0.5}px)` }}
                                    animate={{ scale, y, rotate, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 120, damping: 25 }}
                                    onClick={() => moveTopCardToBottom()}
                                    onMouseEnter={() => setIsPaused(true)}
                                    onMouseLeave={() => setIsPaused(false)}
                                    whileHover={{ scale: 1.05, cursor: 'pointer' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <img src={card.imageUrl} alt={card.title} className="absolute inset-0 h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="relative h-full flex flex-col justify-end p-6 text-white">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-zinc-200">
                                                <span className="font-semibold">{card.title}</span>
                                                <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">{card.subtitle}</span>
                                            </div>
                                            <p className="text-sm leading-6 text-zinc-100">
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                    <AnimatePresence initial={false}>
                        {visibleCards[0] && (
                            <motion.div
                                key={visibleCards[0].id}
                                className="absolute inset-x-0 mx-auto h-[420px] w-full rounded-[3rem] border-2 border-white/20 bg-zinc-950/95 shadow-[0_35px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl cursor-pointer overflow-hidden"
                                onClick={() => moveTopCardToBottom()}
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                                exit={{ opacity: 0, x: swipeDirection === 'right' ? 120 : swipeDirection === 'left' ? -120 : 0, y: swipeDirection === 'up' ? -140 : swipeDirection === 'down' ? 140 : 0, rotate: swipeDirection === 'right' ? 14 : swipeDirection === 'left' ? -14 : swipeDirection === 'up' ? -8 : 8 }}
                                animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
                                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                                whileHover={{ scale: 1.05, cursor: 'pointer' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <img src={visibleCards[0].imageUrl} alt={visibleCards[0].title} className="absolute inset-0 h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="relative h-full flex flex-col justify-end p-6 text-white">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-zinc-200">
                                            <span className="font-semibold">{visibleCards[0].title}</span>
                                            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">{visibleCards[0].subtitle}</span>
                                        </div>
                                        <p className="text-sm leading-6 text-zinc-100">
                                            {visibleCards[0].description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StackingCardSwipe;
