"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Star, Music, VolumeX, Gift, Award } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

/* ── Deterministic heart positions (avoids Math.random in render → no hydration mismatch) ── */
const HEARTS = [
  { left: "8%",  duration: "18s", delay: "0s",   scale: 0.7 },
  { left: "25%", duration: "22s", delay: "3s",   scale: 0.5 },
  { left: "50%", duration: "20s", delay: "7s",   scale: 0.8 },
  { left: "72%", duration: "25s", delay: "2s",   scale: 0.6 },
  { left: "90%", duration: "19s", delay: "5s",   scale: 0.9 },
];

/* ── Shared viewport config for whileInView — single reusable object ── */
const ONCE = { once: true } as const;

export default function Home() {
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [emotionMode, setEmotionMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/music.mp3");
    audioRef.current.loop = true;
    audioRef.current.addEventListener("error", () => {
      console.warn("Audio file not found. Skipping.");
    });
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="relative min-h-screen bg-[#050505] text-slate-200 overflow-hidden font-sans">
      {/* Noise: now a single CSS div instead of a live feTurbulence SVG filter */}
      <div className="noise-overlay" />

      {/* Audio button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        onClick={toggleAudio}
        className="fixed top-6 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-red-400 hover:text-red-300 hover:bg-white/10 hover:scale-105 transition-all duration-300"
        aria-label="Tocar música"
      >
        {isPlaying ? <VolumeX size={20} /> : <Music size={20} />}
      </motion.button>

      {/* ═══ 1. HERO ═══ */}
      <section className="relative flex flex-col justify-center items-center min-h-[100dvh] px-6 text-center">
        {/* Background glow — smaller blur for perf */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-red-900/10 blur-[80px] pointer-events-none" />

        {/* Floating hearts — pure CSS animation, zero JS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {HEARTS.map((h, i) => (
            <div
              key={i}
              className="floating-heart bottom-0"
              style={{
                left: h.left,
                ["--heart-duration" as string]: h.duration,
                ["--heart-delay" as string]: h.delay,
                ["--heart-scale" as string]: h.scale,
              }}
            >
              <Heart size={20} fill="currentColor" />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-3xl flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8 flex flex-col items-center gap-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/40 border border-red-500/20 text-red-200 text-sm md:text-base font-medium tracking-wide shadow-[0_0_20px_rgba(220,38,38,0.15)]">
              <Gift size={18} className="text-red-400" />
              <span>Achou que era só chocolate?</span>
            </div>
            <Heart className="w-10 h-10 text-red-600/80 mt-2 animate-pulse-slow drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" fill="currentColor" />
          </motion.div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6 text-glow leading-tight">
            Feliz Dia das Mães, <span className="italic text-red-500">Véia ❤️</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-400 font-light mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Um site simples, mas feito com carinho pra pessoa que sempre esteve comigo.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            onClick={() => scrollToSection("letter")}
            className="group relative overflow-hidden rounded-[2rem] bg-red-900/20 border border-red-500/30 px-8 py-4 text-red-100 hover:border-red-500/60 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
          >
            <span className="relative z-10 flex items-center gap-2 font-medium">
              Ler minha mensagem
              {/* Pure CSS bounce instead of framer-motion repeat:Infinity */}
              <span className="inline-block" style={{ animation: "bounce-arrow 2s ease-in-out infinite" }}>↓</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          </motion.button>
        </motion.div>
      </section>

      {/* ═══ 1.5 BONUS CHOCOLATE ═══ */}
      <section className="relative py-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={ONCE}
          transition={{ duration: 0.8 }}
          className="max-w-xl mx-auto rounded-[2rem] bg-gradient-to-b from-red-950/20 to-transparent border border-red-500/20 p-8 text-center shadow-lg"
        >
          <Gift className="w-8 h-8 text-red-500 mx-auto mb-4 opacity-80" />
          <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed">
            Esse chocolate já era um presente… mas eu queria colocar uma coisa a mais nele: um pedacinho do quanto eu te amo.
          </p>
        </motion.div>
      </section>

      {/* ═══ 2. LETTER ═══ */}
      <section id="letter" className="relative min-h-screen flex items-center justify-center py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl w-full"
        >
          <div className="relative rounded-[2rem] bg-white/[0.02] border border-white/5 p-8 md:p-14 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505] px-4 py-1">
              <Sparkles className="w-6 h-6 text-red-500/80" />
            </div>

            <h2 className="font-serif text-3xl md:text-5xl mb-8 text-center text-white/90">
              Pra você, <span className="italic text-red-400">Cíntia</span>
            </h2>

            <div className="space-y-6 text-slate-300 text-lg md:text-xl font-light leading-relaxed">
              <p>Mãe,</p>
              <p>
                Eu talvez não fale isso do jeito certo todos os dias, mas eu reconheço tudo que você faz por mim.
              </p>
              <p>
                Obrigado por cuidar de mim, por se preocupar, por estar presente mesmo quando eu sou difícil, teimoso ou quieto demais.
              </p>
              <p>
                Esse site é simples, mas foi feito pensando em você. Feliz Dia das Mães, minha velha. Eu te amo.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center py-12 opacity-50">
        <div className="w-px h-24 bg-gradient-to-b from-red-500/0 via-red-500/50 to-red-500/0" />
      </div>

      {/* ═══ 3. TIMELINE ═══ */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-red-950/5 to-transparent">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={ONCE}
            className="font-serif text-3xl md:text-5xl mb-16 text-center"
          >
            Coisas que talvez eu não fale sempre
          </motion.h2>

          <div className="relative border-l border-red-900/30 ml-4 md:ml-8 space-y-12">
            {[
              "Obrigado por cuidar de mim.",
              "Obrigado por se preocupar comigo.",
              "Obrigado por me aguentar até nos dias em que eu sou difícil.",
              "Obrigado por ser minha mãe.",
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={ONCE}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="relative pl-8 md:pl-12"
              >
                <div className="absolute left-0 top-6 -translate-x-[50%] w-4 h-4 rounded-full bg-red-950 border border-red-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                </div>
                <div className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] hover:border-red-500/20 transition-colors">
                  <p className="text-lg md:text-xl text-slate-300 font-light">&ldquo;{text}&rdquo;</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center py-12 opacity-50">
        <div className="w-px h-24 bg-gradient-to-b from-red-500/0 via-red-500/50 to-red-500/0" />
      </div>

      {/* ═══ 4. HUMOR ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={ONCE}
            className="font-serif text-3xl md:text-5xl mb-16"
          >
            Motivos oficiais pra você ser <span className="italic text-red-500">insubstituível</span>
          </motion.h2>

          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {[
              "Me chama atenção quando precisa (e às vezes quando não precisa)",
              "Se preocupa até quando eu digo que tá tudo bem",
              "Tem aquele sexto sentido de mãe que não falha",
              "É minha véia favorita no mundo inteiro",
            ].map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={ONCE}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-center gap-4 text-left p-4 rounded-[1.5rem] bg-white/[0.02] border border-transparent hover:border-white/10 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-900/30 text-red-400">
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="text-slate-300 text-lg">{reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4.5 EMOTION MODE ═══ */}
      <section className="relative py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatePresence mode="wait">
            {!emotionMode ? (
              <motion.button
                key="emotion-btn"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={ONCE}
                onClick={() => setEmotionMode(true)}
                className="px-8 py-4 rounded-full bg-transparent border border-red-500/50 text-red-300 font-medium hover:bg-red-950/30 transition-all hover:scale-105 active:scale-95"
              >
                Ativar modo emoção
              </motion.button>
            ) : (
              <motion.div
                key="emotion-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="p-8 rounded-[2rem] bg-red-950/20 border border-red-500/40"
              >
                <p className="text-lg md:text-xl text-red-100 font-light leading-relaxed">
                  Eu posso não demonstrar sempre do melhor jeito, mas você é uma das pessoas mais importantes da minha vida. Eu te amo, Véia. ❤️
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ 4.7 CERTIFICATE ═══ */}
      <section className="relative py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={ONCE}
          className="max-w-3xl mx-auto p-1 md:p-2 rounded-[2rem] bg-gradient-to-br from-red-900/30 via-black to-red-900/10 border border-white/10"
        >
          <div className="border border-red-900/30 rounded-[1.5rem] p-8 md:p-12 text-center relative overflow-hidden bg-[#050505]/80">
            {/* watermark */}
            <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 text-red-900/5 pointer-events-none" />

            <div className="mb-8">
              <p className="text-red-500 uppercase tracking-widest text-sm font-bold mb-2">Certificado Oficial</p>
              <h3 className="font-serif text-4xl md:text-5xl text-white">Melhor Véia</h3>
            </div>

            <div className="space-y-6 my-12">
              <p className="text-slate-400 font-light">Este documento certifica que</p>
              <p className="font-serif text-3xl italic text-red-300 border-b border-red-900/50 pb-2 inline-block px-8">Cíntia</p>
              <p className="text-slate-300 max-w-md mx-auto text-lg leading-relaxed">
                Tem o título vitalício de &ldquo;Melhor mãe, melhor véia e dona oficial do meu respeito&rdquo;.
              </p>
            </div>

            <div className="mt-16 flex flex-col items-center">
              <p className="font-serif text-2xl italic text-white/80 mb-1">Bryan</p>
              <div className="w-32 h-px bg-red-900/50 mb-4" />
              <p className="text-xs text-slate-500 max-w-xs">
                Documento extremamente sério e 100% válido dentro desta família.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ 5. FINAL REVEAL ═══ */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center py-24 px-6 text-center border-t border-red-900/20 bg-gradient-to-t from-red-950/10 to-transparent">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={ONCE}
          transition={{ duration: 1 }}
          className="max-w-2xl"
        >
          <h2 className="font-serif text-3xl md:text-5xl mb-6 text-white/90">
            Antes de fechar…
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-light mb-16 leading-relaxed">
            Só queria que você soubesse que eu sou grato por ter você como mãe. Esse site é simples, mas foi feito com carinho de verdade.
          </p>

          <AnimatePresence mode="wait">
            {!showFinalMessage ? (
              <motion.button
                key="reveal-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={() => setShowFinalMessage(true)}
                className="px-8 py-4 rounded-[2rem] bg-red-600 text-white font-medium hover:bg-red-500 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] border border-red-400/50"
              >
                Ler última mensagem
              </motion.button>
            ) : (
              <motion.div
                key="final-message"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="p-8 rounded-[2rem] bg-gradient-to-br from-red-900/40 to-black border border-red-500/30 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                <Heart className="w-10 h-10 text-red-500 mx-auto mb-6 animate-pulse-slow" fill="currentColor" />
                <p className="font-serif text-3xl md:text-4xl text-white mb-2 leading-tight">
                  Feliz Dia das Mães, Cíntia. <br className="hidden md:block" />Obrigado por tudo.
                </p>
                <p className="text-xl text-red-200 mt-4">
                  Eu te amo muito. ❤️
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 text-sm border-t border-white/5">
        <p>Feito com ❤️ pelo seu filho</p>
      </footer>
    </main>
  );
}
