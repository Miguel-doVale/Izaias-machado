// 🎥 Máquina de acabamento + tesoura offset (Three.js, PBR). Movimento esporádico.
// ✏️ POSES: [x, y, rotZ, rotY, escala, xDaTesoura] por seção (ordem de SECTION_IDS).
// 🧩 MODELO REAL: coloque public/models/clipper.glb e scissors.glb e eles substituem os procedurais.
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export const SECTION_IDS = ['hero', 'sobre', 'visagismo', 'resultados', 'atendimentos', 'contato']
const POSES = [[1.9, 0, -0.3, -0.6, 1, -1.5], [-3.4, 0.4, 0.5, 0.7, 0.55, 0.2], [3.2, -0.2, -0.45, -0.9, 0.6, -0.2], [3.4, 0.6, 0.6, 0.8, 0.5, 0], [4.4, 0.2, 0.35, -0.5, 0.55, -4.4], [0, -0.1, 0, 0, 1.05, 3.6]]
// Orientação do GLB da tesoura (ele nasce deitado no plano XZ). Ajuste se precisar virar.
const SC_ROT = [0, 0, 0] // o GLB já vem de frente (nó raiz com +90° em X)

function streaks() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')
  x.fillStyle = 'rgb(48,48,48)'; x.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 900; i++) { const g = 25 + Math.random() * 70; x.fillStyle = `rgba(${g},${g},${g},.55)`; x.fillRect(0, Math.random() * 256, 256, Math.random() * 1.6) }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t
}
function labelTex(text) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 96; const x = c.getContext('2d')
  x.fillStyle = '#1a1a1a'; x.font = '600 54px Inter,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 256, 50)
  return new THREE.CanvasTexture(c)
}
const mats = () => ({
  chrome: new THREE.MeshPhysicalMaterial({ color: 0xe6e6e6, metalness: 1, roughness: 1, roughnessMap: streaks(), clearcoat: 0.6, clearcoatRoughness: 0.08 }),
  steel: new THREE.MeshPhysicalMaterial({ color: 0xcfd2d6, metalness: 1, roughness: 0.14, anisotropy: 0.7 }),
  black: new THREE.MeshPhysicalMaterial({ color: 0x0b0b0c, metalness: 0.2, roughness: 0.55, clearcoat: 0.4 }),
  dlc: new THREE.MeshPhysicalMaterial({ color: 0x15161a, metalness: 1, roughness: 0.3 }),
  copper: new THREE.MeshPhysicalMaterial({ color: 0xb86f4b, metalness: 1, roughness: 0.25, clearcoat: 0.5 }),
  led: new THREE.MeshStandardMaterial({ color: 0x331a00, emissive: 0xff9a2e, emissiveIntensity: 2 }) })

const rr = (w, h, r) => { const s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s }
const ext = (sh, d, bv = 0.015) => { const g = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelSize: bv, bevelThickness: bv, bevelSegments: 4, curveSegments: 14 }); g.translate(0, 0, -d / 2); return g }
const comb = (w, n, h, tl) => { const s = new THREE.Shape(), p = w / n, tw = p * 0.62; s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h)
  for (let i = 0; i < n; i++) { const x = w / 2 - i * p; s.lineTo(x, h + tl); s.lineTo(x - tw, h + tl); s.lineTo(x - tw, h); s.lineTo(x - p, h) } s.closePath(); return s }
// Tudo é montado dentro da silhueta do corpo (sem peças soltas): casco cromado, grip, parafusos nos trilhos, cabeça com lâminas.
function buildClipper(M) {
  const g = new THREE.Group(), add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m }
  add(ext(rr(1.06, 2.86, 0.24), 0.46), M.chrome, 0, 0, 0)                       // casco
  add(ext(rr(0.62, 2.0, 0.06), 0.04, 0.01), M.black, 0, -0.2, 0.285)            // grip
  for (let i = 0; i < 34; i++) add(new RoundedBoxGeometry(0.5, 0.016, 0.025, 2, 0.006), M.dlc, 0, -1.12 + i * 0.055, 0.31).rotation.z = 0.3
  add(new THREE.PlaneGeometry(0.6, 0.11), new THREE.MeshBasicMaterial({ map: labelTex('IZAÍAS'), transparent: true }), 0, 1.04, 0.273)
  for (const [x, y] of [[-0.42, 1.2], [0.42, 1.2], [-0.42, -1.3], [0.42, -1.3]]) { add(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 28), M.steel, x, y, 0.285).rotation.x = Math.PI / 2; add(new THREE.BoxGeometry(0.07, 0.01, 0.01), M.black, x, y, 0.302).rotation.z = 0.6 }
  add(ext(rr(0.3, 0.08, 0.03), 0.012, 0.004), M.black, 0, -1.3, 0.275); add(new THREE.BoxGeometry(0.06, 0.025, 0.01), M.led, -0.08, -1.3, 0.283); add(new THREE.BoxGeometry(0.06, 0.025, 0.01), M.led, 0.08, -1.3, 0.283)
  add(new RoundedBoxGeometry(0.03, 0.5, 0.12, 2, 0.012), M.black, -0.575, 0.35, 0); add(new RoundedBoxGeometry(0.045, 0.16, 0.09, 2, 0.015), M.chrome, -0.595, 0.45, 0)  // chave lateral
  add(ext(rr(0.94, 0.34, 0.1), 0.4), M.chrome, 0, 1.55, 0)                      // pescoço
  add(ext(rr(0.98, 0.2, 0.05), 0.34), M.black, 0, 1.74, 0)                      // cabeçote
  add(ext(comb(0.94, 31, 0.22, 0.12), 0.02, 0.004), M.steel, 0, 1.84, 0.19)    // lâmina inferior
  add(ext(comb(0.88, 29, 0.12, 0.08), 0.02, 0.004), M.dlc, 0, 1.92, 0.22)      // lâmina de corte
  add(ext(rr(0.12, 0.5, 0.04), 0.16, 0.012), M.black, -0.56, 1.66, 0.05).rotation.z = 0.15  // alavanca
  g.position.y = -0.3; const w = new THREE.Group(); w.add(g); return w
}
function buildScissors(M) {
  const w = new THREE.Group(), g = new THREE.Group(); w.add(g)
  const blade = (flip) => {
    const s = new THREE.Shape(); s.moveTo(0, -0.07); s.bezierCurveTo(1.0, -0.1, 2.1, -0.05, 2.9, 0.01); s.bezierCurveTo(2.1, 0.07, 1, 0.13, 0, 0.13); s.closePath()
    const b = new THREE.Group(); b.add(new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.035, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 3, curveSegments: 24 }), M.steel))
    const arm = new THREE.Mesh(new RoundedBoxGeometry(0.8, 0.09, 0.05, 3, 0.02), M.steel); arm.position.set(-0.38, 0.03, 0.02); arm.rotation.z = flip ? -0.5 : 0.35; b.add(arm)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 20, 56), M.steel); ring.scale.set(0.82, 1, 1); ring.position.set(-0.95, flip ? 0.42 : -0.5, 0.02); b.add(ring)
    if (!flip) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 14, 30, Math.PI), M.copper); t.position.set(-1.0, -0.84, 0.02); t.rotation.z = Math.PI; b.add(t) }
    b.position.z = flip ? 0.045 : 0; b.scale.y = flip ? -1 : 1; g.add(b); return b }
  const bl = [blade(false), blade(true)]
  const pv = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.14, 32), M.copper); pv.rotation.x = Math.PI / 2; pv.position.set(0.05, 0.03, 0.03); g.add(pv)
  g.position.x = -1.1; w.userData.blades = bl; return w
}
async function tryGLB(url) {
  try { const r = await fetch(url); if (!r.ok) return null; const b = await r.arrayBuffer(); if (new TextDecoder().decode(b.slice(0, 4)) !== 'glTF') return null
    return await new Promise((res, rej) => new GLTFLoader().parse(b, '', (g) => res(g), rej)) } catch { return null }
}
function fit(obj, size) { const bx = new THREE.Box3().setFromObject(obj), c = bx.getCenter(new THREE.Vector3()), s = size / Math.max(...bx.getSize(new THREE.Vector3()).toArray()); obj.scale.setScalar(s); obj.position.sub(c.multiplyScalar(s)); const w = new THREE.Group(); w.add(obj); return w }

export default function Clipper3D() {
  const ref = useRef()
  useEffect(() => {
    const m = () => innerWidth < 768
    const r = new THREE.WebGLRenderer({ canvas: ref.current, alpha: true, antialias: true })
    r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.1
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, 0.1, 50); cam.position.set(0, 1.2, 9); cam.lookAt(0, -0.2, 0)
    scene.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.03).texture
    const key = new THREE.DirectionalLight(0xffe6c8, 2.4); key.position.set(3, 5, 5)
    const rim = new THREE.DirectionalLight(0xb86f4b, 3); rim.position.set(-5, 2, -3); scene.add(key, rim)
    const M = mats(), clip = new THREE.Group(), sc = buildScissors(M); clip.add(buildClipper(M)); scene.add(clip, sc)
    tryGLB('/models/clipper.glb').then((o) => o && (clip.clear(), clip.add(fit(o.scene, 3.6))))
    let mixer, act, dur = 1
    tryGLB('/models/scissors.glb').then((o) => { if (!o) return
      const w = fit(o.scene, 3.4); w.rotation.set(...SC_ROT); sc.children[0].clear(); sc.children[0].position.x = 0; sc.children[0].add(w); sc.userData.blades = []
      if (o.animations[0]) { mixer = new THREE.AnimationMixer(o.scene); act = mixer.clipAction(o.animations[0]); act.play(); act.paused = true; dur = o.animations[0].duration } })
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const cx = cv.getContext('2d'), gr = cx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = gr; cx.fillRect(0, 0, 128, 128)
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; scene.add(shadow)
    const p = { x: POSES[0][0], y: 0, rz: POSES[0][2], ry: POSES[0][3], s: 1, sx: POSES[0][5] }, fx = { buzz: 0, open: 0.14, snip: 0.3 }, mouse = { x: 0, y: 0 }; let cur = 0, tl
    const resize = () => { r.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix() }; resize()
    const onMove = (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5 }
    addEventListener('resize', resize); addEventListener('pointermove', onMove)
    // Transição suave entre seções (sem sair da tela)
    const dart = (i) => { const to = POSES[i]; cur = i; tl && tl.kill(); p.ry = gsap.utils.wrap(-Math.PI, Math.PI, p.ry)
      tl = gsap.timeline().to(p, { x: to[0], y: to[1], rz: to[2], ry: to[3], s: to[4], sx: to[5], duration: 1.8, ease: 'power3.inOut' }) }
    const trig = SECTION_IDS.map((id, i) => ScrollTrigger.create({ trigger: '#' + id, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && i !== cur && dart(i) }))
    // Ações aleatórias
    let to; const loop = () => { to = setTimeout(() => { const k = Math.random()
      if (k < 0.25) gsap.to(p, { rz: '+=0.3', duration: 0.6, yoyo: true, repeat: 1, ease: 'elastic.out(1,.35)' })
      else if (k < 0.5) gsap.to(fx, { buzz: 1, duration: 0.07, yoyo: true, repeat: 9 })
      else if (k < 0.78) { gsap.to(fx, { open: 0.5, duration: 0.11, yoyo: true, repeat: 5, ease: 'power1.inOut' }); gsap.to(fx, { snip: 1, duration: 0.14, yoyo: true, repeat: 5, ease: 'power1.inOut' }) }
      else gsap.to(p, { ry: '+=' + Math.PI * 2, duration: 1.5, ease: 'power3.inOut' }); loop() }, 3000 + Math.random() * 4000) }; loop()
    const tick = (t) => {
      const mob = m(), kx = THREE.MathUtils.clamp(cam.aspect / 1.78, 0.6, 1.35), b = fx.buzz * 0.025, sk = p.s * (mob ? 0.55 : 1)
      clip.position.set((mob ? 0 : p.x * kx) + (Math.random() - 0.5) * b, p.y + Math.sin(t * 1.1) * 0.07 + (Math.random() - 0.5) * b, 0)
      clip.rotation.set(-mouse.y * 0.25, p.ry + mouse.x * 0.45, p.rz); clip.scale.setScalar(sk)
      sc.position.set(mob ? 0.3 : p.sx * kx, p.y - 1.3 + Math.cos(t * 0.9) * 0.1, -0.5); sc.rotation.set(0, p.ry * 0.5, 0.5 + p.rz * 0.5); sc.scale.setScalar(0.75 * sk); sc.visible = !mob
      if (act) { act.time = 0.05 + fx.snip * (dur - 0.1); mixer.update(0) }
      const o = fx.open; sc.userData.blades?.forEach((bl, i) => (bl.rotation.z = i ? -o : o))
      shadow.position.set(clip.position.x, -2.6, 0); shadow.scale.setScalar(sk * (1 - (clip.position.y + 0.3) * 0.1)); shadow.material.opacity = 0.9
      r.render(scene, cam) }
    gsap.ticker.add(tick)
    return () => { gsap.ticker.remove(tick); clearTimeout(to); tl && tl.kill(); trig.forEach((x) => x.kill()); removeEventListener('resize', resize); removeEventListener('pointermove', onMove); r.dispose() }
  }, [])
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[1] h-screen w-screen" aria-hidden />
}
