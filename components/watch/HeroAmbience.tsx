'use client'
import { useEffect, useRef } from 'react'

interface Props { style: string; accent: string; accentH: string }

export function HeroAmbience({ style, accent, accentH }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number
    let W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H
    const onResize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H }
    window.addEventListener('resize', onResize)

    function hexRgb(hex: string) {
      const h = hex.replace('#','').slice(0,6)
      return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) }
    }
    const c1 = hexRgb(accent), c2 = hexRgb(accentH)

    type P = { x:number;y:number;vx:number;vy:number;size:number;alpha:number;life:number;maxLife:number;hue?:number }
    const particles: P[] = []
    let t = 0

    function spawn(): P {
      if (style === 'horror') return { x: Math.random()*W, y: -10, vx: (Math.random()-.5)*.3, vy: .4+Math.random()*1.2, size: 1.5+Math.random()*3, alpha: .5+Math.random()*.5, life:0, maxLife:120+Math.random()*80 }
      if (style === 'mystical') return { x: Math.random()*W, y: H+10, vx: (Math.random()-.5)*.5, vy: -(.3+Math.random()*.8), size: 1+Math.random()*3, alpha: .3+Math.random()*.5, life:0, maxLife:180+Math.random()*120, hue:Math.random() }
      if (style === 'tech') return { x: Math.random()<.5?-10:W+10, y: Math.random()*H, vx: (Math.random()<.5?1:-1)*(.3+Math.random()*.6), vy:0, size: 1+Math.random()*1.5, alpha: .4+Math.random()*.4, life:0, maxLife:160+Math.random()*80 }
      if (style === 'warm') return { x: W*.3+Math.random()*W*.4, y: H+10, vx: (Math.random()-.5)*1, vy: -(.5+Math.random()*1.5), size: 1+Math.random()*2.5, alpha: .4+Math.random()*.5, life:0, maxLife:120+Math.random()*80 }
      if (style === 'epic') return { x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-.5)*.2, vy: -(.1+Math.random()*.3), size: 1+Math.random()*2, alpha: .1+Math.random()*.2, life:0, maxLife:300+Math.random()*200 }
      return { x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-.5)*.15, vy: -(.05+Math.random()*.15), size: .8+Math.random()*1.5, alpha: .06+Math.random()*.1, life:0, maxLife:400+Math.random()*200 }
    }

    const maxCount = style==='horror'?25:style==='mystical'?60:style==='tech'?30:style==='warm'?40:style==='epic'?50:30
    for (let i=0;i<maxCount*.6;i++) { const p=spawn(); p.life=Math.random()*p.maxLife; particles.push(p) }

    function draw() {
      ctx!.clearRect(0,0,W,H); t++
      if (particles.length<maxCount&&Math.random()<.3) particles.push(spawn())
      for (let i=particles.length-1;i>=0;i--) {
        const p=particles[i]; if(!p) continue
        p.life++; p.x+=p.vx; p.y+=p.vy
        if(style==='mystical') p.vx+=Math.sin(t*.02+i)*.01
        if(style==='warm') p.vx+=Math.sin(t*.03+i)*.02
        const fade=Math.min(p.life/20,1)*Math.min((p.maxLife-p.life)/30,1)
        const alpha=p.alpha*fade
        ctx!.beginPath()
        if(style==='horror') {
          ctx!.ellipse(p.x,p.y,p.size*.6,p.size,0,0,Math.PI*2)
          ctx!.fillStyle=`rgba(${c1.r},${c1.g},${c1.b},${alpha})`; ctx!.fill()
        } else if(style==='mystical') {
          const mix=p.hue??0.5
          const r=Math.round(c1.r+(c2.r-c1.r)*mix),g=Math.round(c1.g+(c2.g-c1.g)*mix),b=Math.round(c1.b+(c2.b-c1.b)*mix)
          const grad=ctx!.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*3)
          grad.addColorStop(0,`rgba(${r},${g},${b},${alpha})`); grad.addColorStop(1,`rgba(${r},${g},${b},0)`)
          ctx!.arc(p.x,p.y,p.size*3,0,Math.PI*2); ctx!.fillStyle=grad; ctx!.fill()
        } else if(style==='tech') {
          ctx!.rect(p.x-p.size/2,p.y-p.size/2,p.size,p.size)
          ctx!.fillStyle=`rgba(${c1.r},${c1.g},${c1.b},${alpha})`; ctx!.fill()
          ctx!.beginPath(); ctx!.moveTo(p.x,p.y); ctx!.lineTo(p.x-p.vx*20,p.y-p.vy*20)
          ctx!.strokeStyle=`rgba(${c1.r},${c1.g},${c1.b},${alpha*.3})`; ctx!.lineWidth=.5; ctx!.stroke()
        } else {
          const grad=ctx!.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*2)
          grad.addColorStop(0,`rgba(${c1.r},${c1.g},${c1.b},${alpha})`); grad.addColorStop(1,`rgba(${c1.r},${c1.g},${c1.b},0)`)
          ctx!.arc(p.x,p.y,p.size*2,0,Math.PI*2); ctx!.fillStyle=grad; ctx!.fill()
        }
        if(p.life>=p.maxLife) particles.splice(i,1)
      }
      if(['cinematic','warm','epic'].includes(style)) {
        const pulse=.04+Math.sin(t*.008)*.02
        const grad=ctx!.createRadialGradient(W/2,H*.45,0,W/2,H*.45,W*.5)
        grad.addColorStop(0,`rgba(${c1.r},${c1.g},${c1.b},${pulse})`); grad.addColorStop(1,`rgba(${c1.r},${c1.g},${c1.b},0)`)
        ctx!.fillStyle=grad; ctx!.fillRect(0,0,W,H)
      }
      raf=requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',onResize) }
  }, [style,accent,accentH])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}
