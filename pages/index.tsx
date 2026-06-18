import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import { useConfigLoader } from "../shared";

interface Section {
  type: string;
  title?: string;
  subtitle?: string;
  text?: string;
}

interface Config {
  recipient: string;
  sender: string;
  title: string;
  message: string;
  photos: string[];
  theme: string;
  music: string;
  musicTitle: string;
  template: string;
  sections: Section[];
  captions: string[];
  closing: string;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 60, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: "easeOut" }
  }
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] }
  }
};

function HeroSection({ section }: { section: Section }) {
  return (
    <motion.section
      variants={scaleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative flex items-center justify-center min-h-screen px-6"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-gold-accent/5 blur-[120px]" />
      </div>
      <div className="text-center z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gold-accent/70 tracking-[0.3em] uppercase text-sm mb-6 font-light"
        >
          {section.subtitle}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-6xl md:text-8xl font-light text-elegant-white leading-tight"
        >
          {section.title}
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="h-px w-32 mx-auto mt-10 bg-gradient-to-r from-transparent via-gold-accent to-transparent"
        />
      </div>
    </motion.section>
  );
}

function StorySection({ section }: { section: Section }) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="flex items-center justify-center min-h-screen px-6 md:px-20"
    >
      <div className="max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gold-accent/60 tracking-[0.25em] uppercase text-xs mb-6"
        >
          {section.title}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl md:text-3xl font-light text-elegant-white/90 leading-relaxed italic"
        >
          &ldquo;{section.text}&rdquo;
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.7 }}
          className="h-px w-20 mx-auto mt-10 bg-gold-accent/30"
        />
      </div>
    </motion.section>
  );
}

function PhotosSection({
  section,
  photos,
  captions
}: {
  section: Section;
  photos: string[];
  captions: string[];
}) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="min-h-screen px-6 md:px-20 py-32 flex flex-col items-center justify-center"
    >
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-gold-accent/60 tracking-[0.25em] uppercase text-xs mb-16"
      >
        {section.title}
      </motion.p>
      <div className="grid grid-cols-2 gap-6 max-w-4xl w-full">
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            className="relative group"
          >
            <div className="relative overflow-hidden rounded-lg bg-dark-luxury border border-gold-accent/10 aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              {photo ? (
                <img
                  src={`/${photo}`}
                  alt={captions[i] || `Foto ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gold-accent/30 text-sm">
                  Foto {i + 1}
                </div>
              )}
            </div>
            {captions[i] && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 + 0.3 }}
                className="text-center text-elegant-white/50 text-xs mt-3 tracking-wide"
              >
                {captions[i]}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function MessageSection({ section }: { section: Section }) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="flex items-center justify-center min-h-screen px-6 md:px-20"
    >
      <div className="max-w-xl text-center relative">
        <div className="absolute -inset-20 bg-gold-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gold-accent/60 tracking-[0.25em] uppercase text-xs mb-8"
          >
            {section.title}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px w-16 mx-auto mb-10 bg-gold-accent/40"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="text-xl md:text-2xl font-light text-elegant-white/80 leading-relaxed"
          >
            {section.text}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="h-px w-16 mx-auto mt-10 bg-gold-accent/40"
          />
        </div>
      </div>
    </motion.section>
  );
}

function ClosingSection({
  section,
  closing,
  sender
}: {
  section: Section;
  closing: string;
  sender: string;
}) {
  return (
    <motion.section
      variants={scaleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="flex items-center justify-center min-h-screen px-6"
    >
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-6xl font-light text-elegant-white mb-6"
        >
          {section.title}
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="h-px w-40 mx-auto mb-10 bg-gradient-to-r from-transparent via-gold-accent to-transparent"
        />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-elegant-white/60 text-sm tracking-wide"
        >
          {closing}
        </motion.p>
      </div>
    </motion.section>
  );
}

export default function Home() {
  const { config, loading, error } = useConfigLoader<Config>("/config.json");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (config?.music) {
      audioRef.current = new Audio(`/${config.music}`);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [config]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-black">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-gold-accent"
        />
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-black">
        <p className="text-elegant-white/50">Gagal memuat konfigurasi</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{config.title} | EverLetter</title>
        <meta name="description" content={`Surat untuk ${config.recipient} dari ${config.sender}`} />
      </Head>

      <main className="bg-deep-black min-h-screen">
        <AnimatePresence>
          {config.sections.map((section, i) => {
            switch (section.type) {
              case "hero":
                return <HeroSection key={i} section={section} />;
              case "story":
                return <StorySection key={i} section={section} />;
              case "photos":
                return (
                  <PhotosSection
                    key={i}
                    section={section}
                    photos={config.photos}
                    captions={config.captions}
                  />
                );
              case "message":
                return <MessageSection key={i} section={section} />;
              case "closing":
                return (
                  <ClosingSection
                    key={i}
                    section={section}
                    closing={config.closing}
                    sender={config.sender}
                  />
                );
              default:
                return null;
            }
          })}
        </AnimatePresence>

        {/* WhatsApp CTA */}
        <section className="py-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto text-center"
          >
            <a
              href="https://wa.me/6282320114535?text=Halo,%20saya%20ingin%20memesan%20EverLetter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-full font-medium hover:bg-green-600 transition-colors shadow-lg min-h-[48px]"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pesan via WhatsApp
            </a>
          </motion.div>
        </section>

        {/* Pricing Badge */}
        <div className="fixed bottom-24 right-8 z-50 bg-dark-luxury/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gold-accent/30">
          <p className="text-elegant-white/60 text-xs mb-1">Ultra Premium</p>
          <p className="text-2xl font-bold text-gold-accent">Rp 110K</p>
        </div>

        {/* Share Button */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'EverLetter - Signature Memory',
                text: 'Lihat hadiah digital indah ini!',
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link disalin ke clipboard!');
            }
          }}
          className="fixed bottom-24 right-8 z-50 bg-gold-accent/20 backdrop-blur-sm text-gold-accent px-4 py-3 rounded-full shadow-lg hover:bg-gold-accent/30 transition-colors flex items-center gap-2 border border-gold-accent/30"
          aria-label="Bagikan"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        {/* Music Button */}
        {config.music && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            onClick={togglePlay}
            aria-label={playing ? 'Jeda musik' : 'Putar musik'}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gold-accent/20 border border-gold-accent/30 flex items-center justify-center backdrop-blur-sm hover:bg-gold-accent/30 transition-colors min-h-[48px]"
            title={config.musicTitle}
          >
            <span className="text-gold-accent text-lg">{playing ? "⏸" : "▶"}</span>
          </motion.button>
        )}
      </main>
    </>
  );
}
