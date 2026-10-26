import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { animate } from 'animejs'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Clipper3D from './components/Clipper3D'
import { Button } from './components/ui/button'
import { About, Visagismo, Results, Services, Sec, rise } from './Sections'
import * as C from './lib/content'
gsap.registerPlugin(ScrollTrigger)

function Loader({ done }) {
  const [n, setN] = useState(0)
  useEffect(() => { const o = { v: 0 }; animate(o, { v: 100, duration: 1600, ease: 'inOutQuad', onUpdate: () => setN(Math.round(o.v)), onComplete: done }) }, [])
  return <motion.div initial={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }} className="fixed inset-0 z-[100] grid place-items-center bg-obs text-sand"><div className="text-center"><p className="gold-text font-serif text-5xl">Izaías Machado</p><p className="mt-3 text-xs tracking-[0.4em]">{n}%</p></div></motion.div>
}
// Nav: some ao rolar para baixo, volta ao rolar para cima
function Nav() {
  const [hide, setHide] = useState(false)
  useEffect(() => { let l = 0; const f = () => { const y = scrollY; setHide(y > 80 && y > l); l = y }; addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  return <motion.nav initial={{ y: -100 }} animate={{ y: hide ? -110 : 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: hide ? 0 : 0.1 }}
    className="glass fixed left-1/2 top-5 z-50 flex w-[min(92%,880px)] -translate-x-1/2 items-center justify-between rounded-full px-6 py-3 text-brown">
    <a href="#hero" className="font-serif text-xl font-semibold engrave">Izaías <span className="text-copper">Machado</span></a>
    <div className="hidden gap-7 text-sm md:flex">{C.NAV.map(([l, h]) => <a key={h} href={h} className="transition hover:text-copper">{l}</a>)}</div>
    <Button href={C.LINKS.geral} target="_blank" rel="noopener" className="!px-5 !py-2 text-xs">WhatsApp</Button></motion.nav>
}
// Carrossel infinito: acelera e inverte conforme a direção do scroll, desacelera no hover
function Carousel({ items }) {
  const tr = useRef(), hover = useRef(false)
  useEffect(() => {
    let x = 0, boost = 0, dir = 1, cur = 2.4
    const st = ScrollTrigger.create({ onUpdate: (s) => { dir = s.direction; boost = Math.min(Math.abs(s.getVelocity()) / 350, 14) } })
    const tick = () => { boost *= 0.93; cur += ((hover.current ? 0.35 : 2.4 + boost) - cur) * 0.08; x -= cur * dir; const W = tr.current.scrollWidth / 2; if (x <= -W) x += W; if (x > 0) x -= W; tr.current.style.transform = `translate3d(${x}px,0,0)` }
    gsap.ticker.add(tick); return () => { gsap.ticker.remove(tick); st.kill() }
  }, [])
  const row = [...items, ...items, ...items, ...items]
  return <div className="overflow-hidden border-y border-gold/20 py-6" onMouseEnter={() => (hover.current = true)} onMouseLeave={() => (hover.current = false)}>
    <div ref={tr} className="flex w-max will-change-transform">{[0, 1].map((k) => <div key={k} className="flex shrink-0 gap-10 pr-10 font-serif text-4xl italic text-sand/70">{row.map((t, i) => <span key={i} className="flex gap-10">{t}<span className="text-gold">✦</span></span>)}</div>)}</div></div>
}
function ToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => { const f = () => setShow(scrollY > 700); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  return <AnimatePresence>{show && <motion.button initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} onClick={() => window.lenis?.scrollTo(0, { duration: 1.8 })} aria-label="Voltar ao topo" className="btn-top fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 19V5M5 12l7-7 7 7" /></svg></motion.button>}</AnimatePresence>
}
function Footer() {
  const F = C.FOOTER
  return <footer className="relative z-10 overflow-hidden bg-obs text-sand">
    <Carousel items={F.marquee} />
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.2fr_1fr_1fr]">
      <div><img src="/img0.jpg" alt="Izaías Machado" className="h-28 w-28 rounded-full border border-gold/50 object-cover object-[center_30%] p-1" /><p className="mt-6 max-w-sm font-serif text-2xl leading-snug text-sand/90">{F.phrase}</p></div>
      <div><p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Navegar</p>{C.NAV.map(([l, h]) => <a key={h} href={h} className="block py-1 text-lg transition hover:text-gold">{l}</a>)}</div>
      <div><p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Contato</p><p className="text-lg">{F.role}</p><p className="text-sand/70">{F.place}</p><Button href={C.LINKS.geral} target="_blank" rel="noopener" className="mt-6">WhatsApp</Button></div>
    </div>
    <p className="gold-text select-none text-center font-serif text-[15vw] leading-none opacity-90">{F.name}</p>
    <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 border-t border-gold/20 px-6 py-6 text-xs text-sand/50"><span>© {F.year} Izaías Machado. Todos os direitos reservados.</span>{F.credit && <span>{F.credit}</span>}<a href="#hero" className="hover:text-gold">Voltar ao topo</a></div>
  </footer>
}
export default function App() {
  const [ready, setReady] = useState(false), H = C.HERO
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085 }); window.lenis = lenis; lenis.on('scroll', ScrollTrigger.update)
    const anchor = (e) => { const a = e.target.closest('a[href^="#"]'); if (!a) return; const el = document.querySelector(a.getAttribute('href')); if (el) { e.preventDefault(); lenis.scrollTo(a.getAttribute('href') === '#hero' ? 0 : el, { duration: 1.6 }) } }
    document.addEventListener('click', anchor)
    const t = (s) => lenis.raf(s * 1000); gsap.ticker.add(t); gsap.ticker.lagSmoothing(0)
    document.querySelectorAll('section[data-bg]').forEach((s) => ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: (st) => st.isActive && gsap.to('#floor', { backgroundColor: s.dataset.bg, duration: 1, ease: 'power2.out' }) }))
    const r = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => { clearTimeout(r); document.removeEventListener('click', anchor); gsap.ticker.remove(t); lenis.destroy() }
  }, [])
  return <>
    <AnimatePresence>{!ready && <Loader done={() => setReady(true)} />}</AnimatePresence>
    <div id="floor" className="fixed inset-0 z-0 bg-sand" style={{ backgroundImage: 'radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.7),transparent 60%)' }} />
    <Clipper3D /><Nav />
    <main>
      <Sec id="hero" bg="#E9E0D5">
        <div className="max-w-2xl">
          <motion.p {...rise} className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-copper">{H.tag}</motion.p>
          <h1 className="font-serif text-6xl font-medium leading-[0.95] md:text-8xl engrave">{H.title.map((w, i) => <motion.span key={w} className="block" initial={{ opacity: 0, y: 70 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span>)}
            <motion.span className="gold-ink mt-2 block text-5xl font-semibold italic md:text-7xl" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.7, duration: 1 }}>{H.gold}</motion.span></h1>
          <motion.p {...rise} className="mt-7 max-w-lg text-lg text-brown/80">{H.text}</motion.p>
          <motion.div {...rise} className="mt-9 flex flex-wrap gap-4"><Button href="#atendimentos">Conheça os atendimentos</Button><Button variant="line" href={C.LINKS.geral} target="_blank" rel="noopener">Fale comigo</Button></motion.div>
        </div>
      </Sec>
      <About /><Visagismo /><Results /><Services />
      <Sec id="contato" bg="#171717" dark>
        <motion.div {...rise} className="glass-dark mx-auto max-w-3xl rounded-[2.5rem] p-10 text-center md:p-16"><h2 className="font-serif text-5xl md:text-6xl">{C.CTA.title}</h2><p className="mx-auto mt-5 max-w-md text-sand/75">{C.CTA.text}</p><Button variant="glass" href={C.LINKS.geral} target="_blank" rel="noopener" className="mt-9">{C.CTA.btn}</Button></motion.div>
      </Sec>
    </main>
    <Footer /><ToTop />
  </>
}
