'use client';

import { useMemo } from 'react';

interface ParticleBackgroundProps {
    className?: string;
}

const COLORS = ['#ff0080', '#7928ca', '#00d4ff', '#ff00ff', '#ffffff'];

function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export default function ParticleBackground({ className }: ParticleBackgroundProps) {
    const particles = useMemo(() => {
        return Array.from({ length: 120 }, (_, i) => ({
            id: i,
            x: randomBetween(0, 100),
            y: randomBetween(0, 100),
            size: randomBetween(8, 20),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            duration: randomBetween(10, 30),
            delay: randomBetween(0, 15),
            driftX: randomBetween(-40, 40),
            driftY: randomBetween(-50, 50),
            opacity: randomBetween(0.4, 0.95),
        }));
    }, []);

    return (
        <div
            className={className}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                overflow: 'hidden',
            }}
        >
            {particles.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        borderRadius: '50%',
                        backgroundColor: p.color,
                        opacity: p.opacity,
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 1.5}px ${p.color}`,
                        filter: 'blur(1.5px)',
                        animation: `particleDrift${p.id % 4} ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
                    }}
                />
            ))}

            <style>{`
                @keyframes particleDrift0 {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                    25% { transform: translate(20px, -30px) scale(1.2); opacity: 0.8; }
                    50% { transform: translate(-15px, -50px) scale(0.8); opacity: 0.5; }
                    75% { transform: translate(25px, -20px) scale(1.1); opacity: 0.9; }
                    100% { transform: translate(-10px, -40px) scale(1); opacity: 0.4; }
                }
                @keyframes particleDrift1 {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.4; }
                    25% { transform: translate(-25px, 20px) scale(0.9); opacity: 0.7; }
                    50% { transform: translate(30px, 40px) scale(1.3); opacity: 0.5; }
                    75% { transform: translate(-20px, 15px) scale(0.7); opacity: 0.8; }
                    100% { transform: translate(15px, 35px) scale(1); opacity: 0.3; }
                }
                @keyframes particleDrift2 {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                    33% { transform: translate(35px, -25px) scale(1.4); opacity: 0.9; }
                    66% { transform: translate(-20px, 30px) scale(0.6); opacity: 0.4; }
                    100% { transform: translate(10px, -15px) scale(1.1); opacity: 0.7; }
                }
                @keyframes particleDrift3 {
                    0% { transform: translate(0, 0) scale(0.8); opacity: 0.6; }
                    20% { transform: translate(-30px, -20px) scale(1.2); opacity: 0.3; }
                    40% { transform: translate(20px, 25px) scale(0.9); opacity: 0.8; }
                    60% { transform: translate(-10px, -35px) scale(1.3); opacity: 0.5; }
                    80% { transform: translate(25px, 10px) scale(0.7); opacity: 0.9; }
                    100% { transform: translate(-15px, -10px) scale(1); opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}
