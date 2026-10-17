'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { FiArrowDown, FiCheck, FiCopy } from 'react-icons/fi';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { heroName, heroItem } from '@/lib/animations';
import type { PersonalInfo } from '@/types/resume';
import { ShaderCanvas } from './ShaderCanvas';
import { ScenePanel } from './ScenePanel';
import { CursorHint } from './CursorHint';
import { createOceanAudio, type OceanAudio } from './scenes/oceanAudio';
import { createSeaSynth } from './scenes/seaSynth';
import type { SoundSource } from './scenes/storage';
import { hexToRgb } from './scenes/shared';
import { SCENES, getServerSnapshot, getSnapshot, resetConfig, setChoice, setConfig, setSound, setSoundSource, subscribe } from './scenes/store';
import type { SceneConfig, SceneId } from './scenes/types';
import styles from './Hero.module.css';

type Props = {
  data: PersonalInfo;
};

const CLI_COMMAND = 'npx xmontc';
const VOLUME_KEY = 'hero:volume';
const GESTURES = ['pointerdown', 'keydown', 'touchend'] as const;

function loadVolume(): number {
  try {
    const stored = Number(localStorage.getItem(VOLUME_KEY));
    return stored > 0 && stored <= 1 ? stored : 0.35;
  } catch {
    return 0.35;
  }
}

function sceneStyle(sceneId: SceneId, config: SceneConfig): CSSProperties {
  const vars: Record<string, string> = {
    '--hero-text-top': String(config.textTop),
    '--hero-text-bottom': String(config.textBottom ?? config.textTop),
    '--hero-accent': String(config.accent),
  };
  if (typeof config.veilColor === 'string') {
    const [r, g, b] = hexToRgb(config.veilColor).map((v) => Math.round(v * 255));
    const alpha = Number(config.veilOpacity);
    const rgba = (a: number) => `rgba(${r},${g},${b},${a})`;
    vars['--hero-veil'] = sceneId === 'shore'
      ? `linear-gradient(to bottom, ${rgba(0)} 40svh, ${rgba(alpha)} 50svh, ${rgba(alpha)} 100%)`
      : `linear-gradient(to bottom, ${rgba(alpha * 0.4)}, ${rgba(alpha)})`;
  }
  return vars as CSSProperties;
}

export function Hero({ data }: Props) {
  const { name, title, tagline, address, social } = data;
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [readyScene, setReadyScene] = useState<SceneId | null>(null);
  const audioRef = useRef<{ kind: SoundSource; audio: OceanAudio } | null>(null);
  const [volume, setVolume] = useState(loadVolume);
  const [awaitingGesture, setAwaitingGesture] = useState(false);

  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const scene = store ? SCENES[store.sceneId] : null;
  const config = store ? store.configs[store.sceneId] : null;
  const ready = scene !== null && readyScene === scene.id;
  const soundOn = store?.sound ?? false;
  const soundSource = store?.soundSource ?? 'clip';

  // Clip player or envelope-following synth; swapping disposes the other one.
  const audioEngine = (): OceanAudio => {
    if (audioRef.current?.kind !== soundSource) {
      audioRef.current?.audio.dispose();
      audioRef.current = { kind: soundSource, audio: soundSource === 'synth' ? createSeaSynth() : createOceanAudio() };
    }
    return audioRef.current.audio;
  };

  const onReady = useCallback((ok: boolean) => {
    setReadyScene(ok ? getSnapshot().sceneId : null);
  }, []);

  // Lets the Header switch to light nav text with a dark halo while it floats over the scene.
  useEffect(() => {
    if (!scene) return;
    document.documentElement.dataset.heroScene = scene.id;
    return () => { delete document.documentElement.dataset.heroScene; };
  }, [scene]);

  const toggleSound = () => {
    setSound(!soundOn);
    if (soundOn) audioRef.current?.audio.stop();
  };

  const changeVolume = (next: number) => {
    setVolume(next);
    audioRef.current?.audio.setVolume(next);
    try { localStorage.setItem(VOLUME_KEY, String(next)); } catch { /* private mode */ }
  };

  // Sound is on by default, but browsers only let it start after a user gesture: try right
  // away (allowed on sites the user visits often) and otherwise on the first interaction.
  useEffect(() => {
    if (!soundOn || !scene) return;
    const audio = audioEngine();
    audio.setVolume(volume);
    audio.setScene(scene.id);
    // The hint shows if the first (automatic) attempt is blocked, and goes away on the first
    // gesture regardless of whether the audio managed to start.
    let gestured = false;
    const tryStart = () => {
      void audio.start().then((started) => {
        if (started) stopListening();
        if (!gestured) setAwaitingGesture(!started);
      });
    };
    const onGesture = () => {
      gestured = true;
      setAwaitingGesture(false);
      tryStart();
    };
    const stopListening = () => GESTURES.forEach((type) => document.removeEventListener(type, onGesture));
    GESTURES.forEach((type) => document.addEventListener(type, onGesture));
    tryStart();
    const onVisibility = () => { if (document.hidden) audio.stop(); else tryStart(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stopListening();
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // `volume` is pushed through changeVolume; re-running on each slider move would restart listeners.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundOn, scene, soundSource]);

  // Fade with scroll: full volume at the top, silent once the hero has scrolled away.
  useEffect(() => {
    if (!soundOn) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const height = heroRef.current?.offsetHeight ?? 0;
      audioRef.current?.audio.setDuck(height > 0 ? 1 - window.scrollY / height : 1);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [soundOn]);

  useEffect(() => () => audioRef.current?.audio.dispose(), []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CLI_COMMAND);
    setCopied(true);
    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className={styles.hero}
      data-scene={scene?.id}
      data-ready={ready || undefined}
      style={scene && config ? sceneStyle(scene.id, config) : undefined}
    >
      {scene && config && (
        <div className={styles.layer}>
          <ShaderCanvas key={scene.id} scene={scene} config={config} anchorRef={nameRef} onReady={onReady} />
          <div className={styles.veil} aria-hidden="true" />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.top}>
          <motion.div initial="hidden" animate="visible" variants={heroItem(0.1)}>
            <p className={styles.greeting}>
              <span className={styles.prompt}>charly@portfolio:~$</span> whoami
              <span className={styles.caret} aria-hidden="true" />
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={heroName}>
            <h1 ref={nameRef} className={styles.name}>{name}</h1>
          </motion.div>
        </div>

        <div className={styles.rest}>
          <motion.div initial="hidden" animate="visible" variants={heroItem(0.5)}>
            <h2 className={styles.title}>{title}</h2>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={heroItem(0.7)}>
            <p className={styles.tagline}>{tagline}</p>
          </motion.div>

          <motion.div
            className={styles.accentLine}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.25, 1, 0.5, 1] }}
          />

          <motion.div initial="hidden" animate="visible" variants={heroItem(1.0)}>
            <div className={styles.cli}>
              <button
                type="button"
                className={styles.cliButton}
                onClick={handleCopy}
                aria-label="Copy npx xmontc to clipboard"
              >
                <span className={styles.prompt}>charly@portfolio:~$</span> {CLI_COMMAND}
                <span className={styles.cliIcon} aria-hidden="true">
                  {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                </span>
              </button>
              <span className={styles.visuallyHidden} role="status">
                {copied ? 'copied to clipboard' : ''}
              </span>
              <p className={styles.cliHint}>try the terminal version</p>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={heroItem(1.2)}>
            <div className={styles.bottom}>
              <SocialLinks links={social} size="lg" />
              <p className={styles.location}>
                {address.city}, {address.country}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <a href="#about" className={styles.scrollDown} aria-label="Scroll to about section">
        <FiArrowDown size={20} />
      </a>

      <CursorHint active={soundOn && awaitingGesture} />

      {store && scene && config && (
        <ScenePanel
          choice={store.choice}
          onChoice={setChoice}
          scene={scene}
          config={config}
          onChange={(next) => setConfig(scene.id, next)}
          onReset={() => resetConfig(scene.id)}
          soundOn={soundOn}
          onToggleSound={toggleSound}
          volume={volume}
          onVolume={changeVolume}
          soundSource={soundSource}
          onSoundSource={setSoundSource}
        />
      )}
    </section>
  );
}
