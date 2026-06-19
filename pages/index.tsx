import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BaseLayout from '../components/BaseLayout';
import { MusicPlayer } from '../shared/MusicPlayer';

/* ── Config types ── */
interface LetterConfig {
  theme?: string;
  recipientName?: string;
  senderName?: string;
  memories?: {
    title?: string;
    date?: string;
    description?: string;
    photo?: string;
  }[];
  message?: string[];
  audioSrc?: string;
  autoplayAudio?: boolean;
}

/* ── Constellation Particles (unique to Signature) ── */
function ConstellationField({ count = 16 }: { count?: number }) {
  const points = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  })), [count]);

  // Connect nearby points with lines
  const lines = useMemo(() => {
    const result: { x1: string; y1: string; x2: string; y2: string; opacity: number }[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 25) {
          result.push({
            x1: `${points[i].x}%`,
            y1: `${points[i].y}%`,
            x2: `${points[j].x}%`,
            y2: `${points[j].y}%`,
            opacity: 1 - dist / 25,
          });
        }
      }
    }
    return result;
  }, [points]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {lines.map((line, i) => (
          <motion.line
            key={`line-${i}`}
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="rgb(var(--primary))"
            strokeWidth="0.5"
            strokeOpacity={line.opacity * 0.1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: i * 0.1, ease: 'easeInOut' }}
          />
        ))}
      </svg>
      {/* Star points */}
      {points.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: 'rgb(var(--primary))',
            boxShadow: `0 0 ${p.size * 3}px rgba(var(--primary), 0.3)`,
          }}
          animate={{
            opacity: [0, 0.8, 0.3, 0.8, 0],
            scale: [0.5, 1.2, 0.7, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ── Gold Particle Field ── */
function GoldParticleField({ count = 16 }: { count?: number }) {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  })), [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: 'rgba(var(--primary), 0.1)',
            boxShadow: `0 0 ${p.size * 2}px rgba(var(--primary), 0.06)`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.5, 0],
            scale: [0.6, 1, 0.6],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ── Scroll Progress ── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(90deg, rgb(var(--primary)), rgb(var(--primary-dim)))',
      }}
    />
  );
}

/* ── 3D Parallax Section Wrapper ── */
function ParallaxSection({ children, speed = 0.5, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [80 * speed, -80 * speed]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [1.5, 0, -1.5]);
  return (
    <motion.div className={className} style={{ y, rotateX, transformPerspective: 1200, transformStyle: "preserve-3d" }}>
      {children}
    </motion.div>
  );
}

/* ── Cinematic Loading ── */
function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgb(var(--bg-start))' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="relative w-16 h-16 mb-8"
        animate={{ rotate: 45 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute inset-1 border"
          style={{
            borderColor: 'rgb(var(--primary))',
            boxShadow: '0 0 20px rgba(var(--primary), 0.15)',
          }}
        />
        <div
          className="absolute inset-3 border"
          style={{ borderColor: 'rgba(var(--primary), 0.2)', transform: 'rotate(22.5deg)' }}
        />
      </motion.div>

      <motion.p
        className="text-[10px] tracking-[0.5em] uppercase"
        style={{ color: 'rgb(var(--primary-dim))' }}
        initial={{ opacity: 0, letterSpacing: '0.8em' }}
        animate={{ opacity: 1, letterSpacing: '0.5em' }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Signature Memory
      </motion.p>

      <motion.div
        className="mt-6 h-[1px] w-24 origin-center"
        style={{ backgroundColor: 'rgba(var(--primary), 0.2)' }}
      >
        <motion.div
          className="h-full"
          style={{ backgroundColor: 'rgb(var(--primary))' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── Emotional Depth Section (new) ── */
function EmotionalDepthSection() {
  const paragraphs = [
    "Setiap kenangan yang kita ciptakan bersama seperti foto yang tercetak di dinding hatiku. Beberapa terang dan cerah — pertama kali kau tertawa begitu keras hingga tak bisa bernapas, malam sunyi ketika kita menyaksikan matahari terbenam tanpa mengucap sepatah kata. Yang lain lebih lembut, seperti aquarel yang meresap ke kertas, tepinya kabur tapi keindahannya tak berkurang.",
    "Aku membawa kenangan-kenangan ini ke mana pun aku pergi — bukan sebagai beban, tapi sebagai harta. Ini adalah bukti bahwa sesuatu yang indah ada di antara kita, sesuatu yang melampaui yang biasa dan menyentuh luar biasa. Ketika dunia terasa berat, aku memejamkan mata dan kembali ke momen-momen ini, dan tiba-tiba semuanya masuk akal lagi.",
    "Ada keajaiban khusus dalam mengenang. Ini bukan tentang menghidupkan kembali masa lalu — ini tentang memahami bagaimana masa lalu membentuk siapa kita hari ini. Setiap keheningan bersama, setiap ledakan tita, setiap air mata yang kita usap dari wajah satu sama lain telah menyatu menjadi kain dari cerita kita.",
    "Dan betapa indahnya cerita itu. Tidak sempurna, tidak terskenario, tapi nyata dan mentah dan sepenuhnya milik kita. Ini adalah cerita dua orang tidak sempurna yang memilih satu sama lain, lagi dan lagi, dan membangun sesuatu yang lebih indah dari yang bisa dibangun sendiri.",
    "Jadi ketika aku menatapmu, aku tidak hanya melihat orang yang berdiri di depanku sekarang. Aku melihat setiap versimu yang pernah kukenal — yang membuatku tertawa di kencan pertama, yang menggenggam tanganku melewati hari-hari terberat, dan yang terus mengejutkanku dengan kedalaman dan kebaikannya. Semua versi ini hidup di dalam diriku, dan aku mencintai setiap satu dari mereka.",
  ];

  return (
    <ParallaxSection speed={0.1}>
      <div className="max-w-3xl mx-auto space-y-12">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] tracking-[0.5em] uppercase mb-4 font-semibold"
            style={{ color: 'rgb(var(--primary-dim))' }}>
            Perasaanku
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wide"
            style={{ color: 'rgb(var(--primary))' }}>
            Cerita-Cerita Yang Kita Simpan
          </h2>
          <div className="w-16 h-[1px] mx-auto mt-6"
            style={{ background: `linear-gradient(90deg, transparent, rgba(var(--primary), 0.3), transparent)` }} />
        </motion.div>

        {paragraphs.map((text, i) => (
          <motion.div
            key={i}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-lg md:text-xl leading-[2] font-serif-alt italic text-white/80">
              {i === 0 && (
                <span className="text-5xl md:text-6xl font-serif float-left mr-3 mt-1 leading-none"
                  style={{ color: 'rgb(var(--primary))' }}>
                  {text.charAt(0)}
                </span>
              )}
              {i === 0 ? text.slice(1) : text}
            </p>
            {i < paragraphs.length - 1 && (
              <div className="flex justify-center mt-10">
                <div className="w-1.5 h-1.5 rotate-45 border border-white/10" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </ParallaxSection>
  );
}

/* ── Memory Card with premium photo treatment ── */
function MemoryCard({
  memory,
  index,
}: {
  memory: NonNullable<LetterConfig['memories']>[number];
  index: number;
}) {
  const isLeft = index % 2 === 0;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }, []);

  return (
    <motion.div
      className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-14 items-center`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Photo with premium treatment */}
      <div ref={cardRef} className="w-full md:w-1/2 group cursor-pointer" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transition: 'transform 0.25s ease-out' }}>
        <div className="glass overflow-hidden rounded-glass">
          <motion.div
            className="aspect-[4/5] bg-cover bg-center"
            style={{ backgroundImage: `url(${memory.photo})` }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
        {/* Photo glow on hover */}
        <div
          className="absolute inset-0 rounded-glass opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            boxShadow: '0 0 40px rgba(var(--primary), 0.06)',
          }}
        />
      </div>

      {/* Text with premium typography */}
      <div className="w-full md:w-1/2 space-y-4">
        {memory.date && (
          <motion.p
            className="text-[10px] tracking-[0.35em] uppercase"
            style={{ color: 'rgb(var(--primary-dim))' }}
            initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {memory.date}
          </motion.p>
        )}
        {memory.title && (
          <motion.h3
            className="text-2xl md:text-3xl lg:text-4xl font-serif leading-tight"
            style={{ color: 'rgb(var(--primary))' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {memory.title}
          </motion.h3>
        )}
        {memory.description && (
          <motion.p
            className="text-sm md:text-base leading-[1.8] font-serif-alt"
            style={{ color: 'rgb(var(--text-muted))' }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {memory.description}
          </motion.p>
        )}
        {/* Subtle accent line */}
        <motion.div
          className="h-px w-10"
          style={{ backgroundColor: 'rgba(var(--primary), 0.2)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

/* ── Memory Timeline Divider ── */
function TimelineDivider({ number }: { number: number }) {
  return (
    <div className="flex items-center justify-center gap-6 py-12">
      <motion.div
        className="h-px flex-1 max-w-16"
        style={{ backgroundColor: 'rgba(var(--primary), 0.12)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      />
      <motion.span
        className="text-[9px] tracking-[0.5em] uppercase"
        style={{ color: 'rgb(var(--primary-dim))' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {number}
      </motion.span>
      <motion.div
        className="h-px flex-1 max-w-16"
        style={{ backgroundColor: 'rgba(var(--primary), 0.12)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
    </div>
  );
}

/* ── Section Wrapper ── */
function Section({
  children,
  className = '',
  fullScreen = false,
}: {
  children: React.ReactNode;
  className?: string;
  fullScreen?: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative px-5 py-20 md:py-28 ${fullScreen ? 'min-h-screen flex flex-col justify-center' : ''} ${className}`}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2
                     w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--glow-color)) 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {children}
      </div>
    </motion.section>
  );
}

/* ── Home Page ── */
export default function Home() {
  const [config, setConfig] = useState<LetterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: LetterConfig = await res.json();
        setConfig(data);
      } catch {
        // Use default config
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowLoading(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const theme = config?.theme || 'ultra-signature';
  const memories = config?.memories || [];
  const message = config?.message || [];
  const hasMemories = memories.length > 0;
  const hasMessage = message.length > 0;

  if (loading || showLoading) {
    return (
      <BaseLayout theme={theme} ultra>
        <LoadingScreen />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout theme={theme} ultra className="relative">
      <ScrollProgress />
      <ConstellationField count={16} />
      <GoldParticleField count={12} />

      <MusicPlayer
        audioSrc={config?.audioSrc}
        autoPlay={config?.autoplayAudio}
      />

      {/* Hero with parallax + 3D */}
      <Section fullScreen>
        <ParallaxSection speed={0.1}>
          <div className="text-center max-w-3xl mx-auto">
            <motion.p
              className="text-[10px] tracking-[0.6em] uppercase mb-8"
              style={{ color: 'rgb(var(--primary-dim))' }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Dalam Kenangan
            </motion.p>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-[6.5rem] font-serif mb-8 leading-[1.1] tracking-tight"
              style={{ color: 'rgb(var(--primary))' }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {config?.recipientName || 'Every Moment'}
            </motion.h1>

            <motion.div
              className="w-12 h-px mx-auto mb-6"
              style={{ backgroundColor: 'rgb(var(--primary))' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />

            <motion.p
              className="text-sm md:text-base max-w-lg mx-auto leading-relaxed font-serif-alt italic"
              style={{ color: 'rgb(var(--text-muted))' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              Beberapa memori memudar. Yang lain meninggalkan bentuknya dalam diri kita selamanya.
            </motion.p>
          </div>
        </ParallaxSection>
      </Section>

      {/* Memories timeline */}
      {hasMemories && (
        <>
          <TimelineDivider number={1} />
          <Section>
            <div className="space-y-28 md:space-y-36">
              {memories.map((memory, i) => (
                <MemoryCard key={i} memory={memory} index={i} />
              ))}
            </div>
          </Section>
        </>
      )}

      {/* Emotional Depth */}
      <TimelineDivider number={2} />
      <Section>
        <EmotionalDepthSection />
      </Section>

      {/* Letter message */}
      {hasMessage && (
        <>
          <TimelineDivider number={3} />
          <Section>
            <ParallaxSection speed={0.1}>
              <div className="glass p-8 md:p-16 max-w-3xl mx-auto space-y-8">
                {message.map((paragraph, i) => (
                  <motion.p
                    key={i}
                    className="text-lg md:text-xl leading-[1.8] font-serif-alt italic"
                    style={{ color: 'rgb(var(--text))' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {i === 0 && (
                      <span className="text-5xl md:text-6xl font-serif float-left mr-3 mt-1 leading-none" style={{ color: 'rgb(var(--primary))' }}>
                        {paragraph.charAt(0)}
                      </span>
                    )}
                    {i === 0 ? paragraph.slice(1) : paragraph}
                  </motion.p>
                ))}
              </div>
            </ParallaxSection>
          </Section>
        </>
      )}

      {/* Closing */}
      <Section>
        <div className="text-center">
          <motion.div
            className="mb-10"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <svg
              className="w-8 h-8 mx-auto"
              style={{ color: 'rgb(var(--primary))' }}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>

          <motion.p
            className="text-xs tracking-[0.4em] uppercase mb-6"
            style={{ color: 'rgb(var(--primary-dim))' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Selamanya Milikmu
          </motion.p>

          <motion.p
            className="text-3xl md:text-4xl lg:text-5xl font-serif"
            style={{ color: 'rgb(var(--primary))' }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {config?.senderName || 'Always'}
          </motion.p>

          <motion.div
            className="mt-10 h-px w-16 mx-auto"
            style={{ backgroundColor: 'rgba(var(--primary), 0.3)' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
        </div>
      </Section>
    </BaseLayout>
  );
}
