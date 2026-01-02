'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './Testimonials.module.css';

interface Testimonial {
    id: number;
    name: string;
    handle: string;
    avatar: string;
    rating: number;
    text: string;
    role: string;
}

interface TestimonialsCarouselProps {
    testimonials: Testimonial[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    return (
        <div className={styles.carousel}>
            <div className={styles.carouselTrack}>
                {testimonials.map((testimonial, index) => {
                    let position = index - currentIndex;
                    if (position < -2) position += testimonials.length;
                    if (position > 2) position -= testimonials.length;

                    return (
                        <div
                            key={testimonial.id}
                            className={`${styles.testimonialCard} ${index === currentIndex ? styles.active : ''}`}
                            style={{
                                transform: `translateX(${position * 110}%) scale(${position === 0 ? 1 : 0.85})`,
                                opacity: Math.abs(position) <= 1 ? 1 : 0.5,
                                zIndex: position === 0 ? 10 : 5 - Math.abs(position),
                            }}
                        >
                            {/* Rating */}
                            <div className={styles.rating}>
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className={styles.quote}>&ldquo;{testimonial.text}&rdquo;</p>

                            {/* Author */}
                            <div className={styles.author}>
                                <div className={styles.avatar}>{testimonial.avatar}</div>
                                <div className={styles.authorInfo}>
                                    <span className={styles.authorName}>{testimonial.name}</span>
                                    <span className={styles.authorRole}>{testimonial.role}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation */}
            <div className={styles.navigation}>
                <button
                    className={styles.navButton}
                    onClick={prevSlide}
                    aria-label="Previous testimonial"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>

                <div className={styles.dots}>
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>

                <button
                    className={styles.navButton}
                    onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
                    aria-label="Next testimonial"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
