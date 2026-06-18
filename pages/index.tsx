import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

function useConfigLoader<T>(path: string) {
  const [config, setConfig] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    fetch(path)
      .then((r) => r.json())
      .then((d) => {
        setConfig(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, [path]);
  return { config, loading, error };
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
            className={`relative group ${i % 3 === 0 ? "row-span-2" : ""}`}
          >
            <div className="relative overflow-hidden rounded-lg bg-dark-luxury border border-gold-accent/10 aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 flex items-center justify-center text-gold-accent/30 text-sm">
                {photo}
              </div>
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
        <p className="text-elegant-white/50">Loading configuration...</p>
      </div>
    );
  }

  return (
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

      {config.music && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          onClick={() => setPlaying(!playing)}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gold-accent/20 border border-gold-accent/30 flex items-center justify-center backdrop-blur-sm hover:bg-gold-accent/30 transition-colors"
          title={config.musicTitle}
        >
          <span className="text-gold-accent text-lg">{playing ? "⏸" : "▶"}</span>
        </motion.button>
      )}
    </main>
  );
}
