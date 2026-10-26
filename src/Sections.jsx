import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { animate } from 'animejs'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from './components/ui/button'
import * as C from './lib/content'
gsap.registerPlugin(ScrollTrigger)
export const rise = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
export const Sec = ({ id, bg, dark, className = '', children }) => (
  <section id={id} data-bg={bg} className={`relative z-10 flex min-h-screen items-center px-6 py-28 md:px-16 ${dark ? 'text-sand' : 'text-brown'} ${className}`}><div className="mx-auto w-full max-w-6xl">{children}</div></section>)

function CountUp({ to }) {
  const ref = useRef()
  useEffect(() => { const o = { v: 0 }, io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { animate(o, { v: to, duration: 2200, onUpdate: () => (ref.current.textContent = Math.round(o.v)) }); io.disconnect() } }); io.observe(ref.current); return () => io.disconnect() }, [to])
  return <span ref={ref}>0</span>
}

// SOBRE: cena pinada. O retrato "abre" em scroll, de P&B para cor, enquanto o mapa visagista é desenhado no rosto.
export function About() {
  const root = useRef(), frame = useRef(), A = C.ABOUT
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=240%', scrub: 0.7, pin: true, anticipatePin: 1 } })
        .fromTo('.ab-clip', { clipPath: 'inset(24% 30% 24% 30% round 60px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', duration: 1 }, 0)
        .fromTo('.ab-img', { scale: 1.5, filter: 'grayscale(1) brightness(.6)' }, { scale: 1, filter: 'grayscale(0) brightness(1)', ease: 'none', duration: 1 }, 0)
        .fromTo('.ab-draw', { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.07, ease: 'none', duration: 0.5 }, 0.45)
        .fromTo('.ab-lbl', { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.2 }, 0.8)
        .fromTo('.ab-word', { opacity: 0.1 }, { opacity: 1, stagger: 0.03, ease: 'none', duration: 0.45 }, 0.3)
        .fromTo('.ab-tag', { opacity: 0, y: 40, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.3 }, 0.7)
        .fromTo('.ab-bigA', { xPercent: 0 }, { xPercent: -45, ease: 'none', duration: 1.5 }, 0).fromTo('.ab-bigB', { xPercent: -45 }, { xPercent: 0, ease: 'none', duration: 1.5 }, 0)
    }, root); return () => ctx.revert()
  }, [])
  const tilt = (e) => { const b = frame.current.getBoundingClientRect(); gsap.to(frame.current, { rotateY: ((e.clientX - b.left) / b.width - 0.5) * 12, rotateX: -((e.clientY - b.top) / b.height - 0.5) * 12, transformPerspective: 900, duration: 0.5 }) }
  const tags = ['left-[2vw] top-[14vh]', 'right-[2vw] top-[30vh]', 'left-[8vw] bottom-[18vh]', 'right-[10vw] bottom-[8vh]']
  const lines = [215, 375, 570, 735], lb = ['Testa', 'Olhos', 'Nariz', 'Queixo']
  return <section id="sobre" data-bg="#171717" ref={root} className="relative z-10 h-screen overflow-hidden text-sand">
    <div className="ab-bigA outline-text pointer-events-none absolute left-0 top-[3vh] whitespace-nowrap font-serif text-[15vw] leading-none">{'VISAGISMO ✦ '.repeat(5)}</div>
    <div className="ab-bigB outline-text pointer-events-none absolute bottom-[1vh] left-0 whitespace-nowrap font-serif text-[15vw] leading-none">{'IZAÍAS MACHADO ✦ '.repeat(4)}</div>
    <div ref={frame} onMouseMove={tilt} onMouseLeave={() => gsap.to(frame.current, { rotateX: 0, rotateY: 0, duration: 0.8 })} className="absolute left-1/2 top-[11vh] aspect-[750/875] h-[50vh] -translate-x-1/2 md:left-auto md:right-[7vw] md:top-1/2 md:h-[84vh] md:translate-x-0 md:-translate-y-1/2">
      <div className="ab-clip relative h-full w-full overflow-hidden shadow-[0_40px_120px_-30px_#000]">
        <img className="ab-img h-full w-full object-cover" src="/img0.jpg" alt="Retrato de Izaías Machado, barbeiro visagista" />
        <svg viewBox="0 0 750 875" className="absolute inset-0 h-full w-full" fill="none" stroke="#C9A36A" strokeWidth="2" vectorEffect="non-scaling-stroke">
          <ellipse className="ab-draw" pathLength="1" strokeDasharray="1" cx="385" cy="470" rx="225" ry="310" />
          <line className="ab-draw" pathLength="1" strokeDasharray="1" x1="385" y1="60" x2="385" y2="835" />
          {lines.map((y, i) => <g key={y}><line className="ab-draw" pathLength="1" strokeDasharray="1" x1="50" y1={y} x2="700" y2={y} /><text className="ab-lbl" x="62" y={y - 12} fill="#E9E0D5" stroke="none" fontSize="24" fontFamily="Inter">{lb[i]}</text></g>)}
          {[[265, 410], [505, 410], [385, 610]].map(([x, y]) => <circle key={x + y} className="ab-lbl" cx={x} cy={y} r="7" fill="#C9A36A" stroke="none" />)}
        </svg>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
      </div>
      {A.tags.map((t, i) => <span key={t} className={`ab-tag glass-dark floaty absolute hidden rounded-full px-5 py-2 text-sm md:block ${tags[i]}`} style={{ animationDelay: i * 0.7 + 's' }}>{t}</span>)}
    </div>
    <div className="absolute inset-x-6 bottom-6 z-10 md:inset-x-auto md:bottom-auto md:left-[6vw] md:top-1/2 md:w-[42vw] md:-translate-y-1/2">
      <p className="gold-text font-serif text-7xl md:text-9xl"><CountUp to={A.startAge} /></p>
      <h2 className="mb-4 font-serif text-3xl md:mb-6 md:text-5xl">{A.title}</h2>
      <p className="text-sm leading-relaxed md:text-xl">{A.text.split(' ').map((w, i) => <span key={i} className="ab-word">{w} </span>)}</p>
    </div>
  </section>
}

// VISAGISMO: seletor de formato de rosto + benefícios
const Icon = ({ k }) => <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#C9A36A" strokeWidth="1.4">{{
  clareza: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></>, intencao: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  pessoal: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 4-7 8-7s7 2 8 7" /></>, consciencia: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></> }[k]}</svg>
export function Visagismo() {
  const [i, setI] = useState(0), [n, d, t] = C.SHAPES[i]
  return <Sec id="visagismo" bg="#171717" dark>
    <motion.div {...rise} className="mb-12 max-w-2xl"><h2 className="font-serif text-5xl md:text-7xl">{C.VIS.title.split(' ').slice(0, -1).join(' ')} <span className="gold-text italic">{C.VIS.title.split(' ').slice(-1)}</span></h2><p className="mt-5 text-lg text-sand/80">{C.VIS.text}</p></motion.div>
    <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:pr-[16%]">
      <motion.div {...rise} className="glass-dark relative aspect-[4/3.4] overflow-hidden rounded-[2rem]">
        <div className="scan absolute inset-x-8 h-px bg-gold/70 shadow-[0_0_20px_#C9A36A]" />
        <svg key={i} viewBox="0 0 200 270" className="absolute inset-0 m-auto h-[88%]" fill="none" stroke="#C9A36A" strokeWidth="1.6">
          <path className="draw" pathLength="1" d={d} />
          {[100, 135, 170].map((y) => <line key={y} className="draw" pathLength="1" x1="10" y1={y} x2="190" y2={y} strokeDasharray=".02 .02" strokeWidth=".8" opacity=".6" />)}
          <line className="draw" pathLength="1" x1="100" y1="10" x2="100" y2="262" strokeWidth=".8" opacity=".6" />
        </svg>
        <p className="absolute bottom-5 left-6 font-serif text-3xl">{n}</p></motion.div>
      <div>
        <div className="mb-6 flex flex-wrap gap-2">{C.SHAPES.map(([s], k) => <button key={s} onClick={() => setI(k)} className={`rounded-full px-5 py-2 text-sm transition ${k === i ? 'btn-flat' : 'btn-glass'}`}>{s}</button>)}</div>
        <AnimatePresence mode="wait"><motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-dark rounded-3xl p-7 font-serif text-2xl leading-snug">{t}</motion.p></AnimatePresence>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">{C.BENEFITS.map(([k, h, p], j) => <motion.div key={k} {...rise} transition={{ ...rise.transition, delay: j * 0.08 }} className="glass-dark rounded-2xl p-5 transition hover:border-gold/60"><Icon k={k} /><h3 className="mt-3 text-lg font-semibold">{h}</h3><p className="mt-1 text-sm text-sand/75">{p}</p></motion.div>)}</div>
      </div>
    </div>
  </Sec>
}

// RESULTADOS: molduras editoriais com parallax
function Frame({ src, t, s, off }) {
  const ref = useRef(), { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] }), y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%'])
  return <motion.figure ref={ref} {...rise} className={`group relative ${off ? 'md:mt-28' : ''}`}>
    <div className="relative overflow-hidden rounded-sm border border-gold/30"><motion.img style={{ y, scale: 1.2 }} src={src} alt={t} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.28]" />
      <figcaption className="glass-dark absolute inset-x-4 bottom-4 rounded-xl px-5 py-4"><b className="font-serif text-2xl">{t}</b><span className="block text-sm text-sand/80">{s}</span></figcaption></div>
    {['-left-2 -top-2 border-l border-t', '-right-2 -top-2 border-r border-t', '-left-2 -bottom-2 border-l border-b', '-right-2 -bottom-2 border-r border-b'].map((c) => <i key={c} className={`absolute h-6 w-6 border-gold ${c}`} />)}</motion.figure>
}
export const Results = () => <Sec id="resultados" bg="#171717" dark>
  <motion.h2 {...rise} className="mb-12 max-w-3xl font-serif text-5xl md:text-7xl">Decisões com propósito. <span className="gold-text italic">Resultados com identidade.</span></motion.h2>
  <div className="grid items-start gap-10 md:grid-cols-2 md:pr-[16%]">{C.RESULTS.map(([src, t, s], k) => <Frame key={src} src={src} t={t} s={s} off={k === 1} />)}</div></Sec>

// ATENDIMENTOS: seletor + formulário que monta a mensagem do WhatsApp
export function Services() {
  const [type, setType] = useState('abordagem'), [f, setF] = useState({ nome: '', email: '', msg: '' }), [title, desc] = C.SERVICES[type]
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const send = (e) => { e.preventDefault(); open(C.wa(`Olá, Izaías Machado! Vim pelo seu site e gostaria de agendar uma ${title}.\n\n*Nome:* ${f.nome}\n*E-mail:* ${f.email}\n*O que busco:* ${f.msg}`), '_blank') }
  return <Sec id="atendimentos" bg="#2A2522" dark>
    <div className="grid items-start gap-12 md:grid-cols-[.9fr_1.1fr] md:pr-[14%]">
      <motion.div {...rise} className="readable"><h2 className="font-serif text-5xl md:text-7xl">Escolha o <span className="gold-text italic">próximo passo.</span></h2>
        <AnimatePresence mode="wait"><motion.div key={type} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-8 border-l border-gold/50 pl-6"><h3 className="font-serif text-3xl">{title}</h3><p className="mt-2 text-lg text-sand/80">{desc}</p></motion.div></AnimatePresence>
        <p className="mt-8 text-sm text-sand/60">Valores e disponibilidade: consulte pelo WhatsApp.</p></motion.div>
      <motion.form {...rise} onSubmit={send} className="glass-dark rounded-[2rem] p-6 md:p-9">
        <div className="relative mb-6 grid grid-cols-2 rounded-full border border-white/15 bg-white/5 p-1">{Object.entries(C.SERVICES).map(([k, [n]]) => <button type="button" key={k} onClick={() => setType(k)} className="relative z-10 rounded-full py-3 text-sm font-semibold">{type === k && <motion.span layoutId="seg" className="btn-flat absolute inset-0 -z-10 rounded-full" />}{n}</button>)}</div>
        <div className="space-y-4"><input required className="field" placeholder="Seu nome" value={f.nome} onChange={set('nome')} /><input required type="email" className="field" placeholder="Seu e-mail" value={f.email} onChange={set('email')} />
          <textarea required rows={4} className="field resize-none" placeholder="Conte o que você busca" value={f.msg} onChange={set('msg')} /></div>
        <Button as="button" type="submit" className="mt-6 w-full">Enviar pelo WhatsApp</Button></motion.form>
    </div></Sec>
}
