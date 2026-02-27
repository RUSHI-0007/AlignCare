'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─────────────────────────────────────────────────────────────────────────────
// GLSL: Bright blue sky with flowing white clouds
// ─────────────────────────────────────────────────────────────────────────────
const SKY_SHADER = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution

float hash(vec2 p){ p=fract(p*vec2(127.1,311.7)); p+=dot(p,p+74.23); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0., a=0.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){ v+=a*noise(p); p=m*p; a*=0.5; }
  return v;
}

void main(){
  vec2 uv = FC / R;
  // Slow horizontal drift
  vec2 st = vec2(uv.x * 2.5 + T * 0.04, uv.y * 1.2 - T * 0.008);

  // Layered cloud density
  float c1 = fbm(st);
  float c2 = fbm(st * 1.8 + vec2(5.2, 1.3));
  float cloud = smoothstep(0.38, 0.72, c1 * 0.55 + c2 * 0.45);

  // Sky gradient: deep blue at top → bright azure at centre → light blue at bottom
  float vert = uv.y;
  vec3 skyTop    = vec3(0.18, 0.45, 0.82);
  vec3 skyMid    = vec3(0.38, 0.68, 0.96);
  vec3 skyBottom = vec3(0.62, 0.82, 0.98);
  vec3 sky = mix(skyBottom, mix(skyMid, skyTop, vert*vert), vert);

  // Bright white cloud layer
  vec3 cloudCol = mix(vec3(0.88,0.92,0.98), vec3(1.0,1.0,1.0), cloud);

  // Blend clouds over sky
  vec3 col = mix(sky, cloudCol, cloud * 0.9);

  // Subtle sun-glow in upper-right
  vec2 sunDir = normalize(vec2(FC) - vec2(R.x*0.75, R.y*0.82));
  float sunDist = length(FC/R - vec2(0.75,0.82));
  col += vec3(1.0,0.97,0.88) * 0.08 * exp(-sunDist * 8.0);

  O = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

// ─────────────────────────────────────────────────────────────────────────────
// useShaderCanvas — pure WebGL2, no Three.js
// ─────────────────────────────────────────────────────────────────────────────
function useShaderCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const gl = canvas.getContext('webgl2'); if (!gl) return;

        const compile = (type: number, src: string) => {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, src); gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
            return s;
        };
        const vert = compile(gl.VERTEX_SHADER, `#version 300 es\nin vec4 position;\nvoid main(){gl_Position=position;}`);
        const frag = compile(gl.FRAGMENT_SHADER, SKY_SHADER);
        const prog = gl.createProgram()!;
        gl.attachShader(prog, vert); gl.attachShader(prog, frag); gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        const pos = gl.getAttribLocation(prog, 'position');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(prog, 'resolution');
        const uTime = gl.getUniformLocation(prog, 'time');

        const resize = () => {
            const d = Math.min(window.devicePixelRatio, 2);
            canvas.width = window.innerWidth * d;
            canvas.height = window.innerHeight * d;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize(); window.addEventListener('resize', resize);

        let raf: number;
        const render = (t: number) => {
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uTime, t * 0.001);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            raf = requestAnimationFrame(render);
        };
        raf = requestAnimationFrame(render);

        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, [ref]);
}



// ─────────────────────────────────────────────────────────────────────────────
// Hero component
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroCanvas() {
    const shaderRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();

    useShaderCanvas(shaderRef);

    return (
        <div
            className="relative w-full h-screen overflow-hidden"
            style={{ marginTop: '-56px' }}
        >
            {/* Layer 1: sky + cloud GLSL shader */}
            <canvas ref={shaderRef} className="absolute inset-0 w-full h-full" />

            {/* Layer 3: Hero content */}
            <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white"
                style={{ paddingTop: '56px' }}
            >
                {/* Trust badge */}
                <div className="mb-6 animate-fade-in-down">
                    <div className="flex items-center gap-2 px-5 py-2 rounded-full border text-sm"
                        style={{ backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                        <span className="text-yellow-300">★</span>
                        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Physiotherapy &amp; Cancer Rehab · Pune</span>
                    </div>
                </div>

                <div className="text-center max-w-5xl mx-auto px-4">
                    {/* Line 1 */}
                    <h1
                        className="font-bold animate-fade-in-up animation-delay-200"
                        style={{
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontSize: 'clamp(2.8rem, 6.5vw, 5rem)',
                            lineHeight: 1.0,
                            letterSpacing: '-0.035em',
                            color: '#fff',
                            textShadow: '0 2px 20px rgba(0,60,150,0.35)',
                        }}
                    >
                        Reclaim your
                    </h1>

                    {/* Line 2 — giant Cormorant italic */}
                    <h1
                        className="animate-fade-in-up animation-delay-400"
                        style={{
                            fontFamily: 'Cormorant Garamond, Georgia, serif',
                            fontStyle: 'italic',
                            fontWeight: 600,
                            fontSize: 'clamp(5rem, 13vw, 10rem)',
                            lineHeight: 0.88,
                            letterSpacing: '-0.02em',
                            color: '#fff',
                            textShadow: '0 4px 32px rgba(0,60,150,0.4)',
                        }}
                    >
                        Movement.
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="max-w-xl mx-auto mt-7 mb-0 animate-fade-in-up animation-delay-600"
                        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75 }}
                    >
                        Evidence-based physiotherapy and cancer rehabilitation
                        delivered with precision and genuine care in Pune.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up animation-delay-800">
                        <Link
                            href="/booking"
                            className="px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105"
                            style={{
                                fontFamily: 'Plus Jakarta Sans, sans-serif',
                                backgroundColor: '#2D5BE3',
                                color: '#fff',
                                boxShadow: '0 8px 28px rgba(45,91,227,0.4)',
                            }}
                        >
                            Book Appointment →
                        </Link>
                        <button
                            onClick={() => router.push('/#services')}
                            className="px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105"
                            style={{
                                fontFamily: 'Plus Jakarta Sans, sans-serif',
                                backgroundColor: 'rgba(255,255,255,0.18)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.35)',
                                color: '#fff',
                            }}
                        >
                            Our Services
                        </button>
                    </div>

                    {/* Trust bar */}
                    <div className="flex items-center justify-center gap-2 mt-6 text-sm animate-fade-in-up animation-delay-800"
                        style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
                        <span className="text-yellow-400">★★★★★</span>
                        <span className="font-semibold" style={{ color: '#fff' }}>5.0</span>
                        <span>·</span><span>120+ Google Reviews</span><span>·</span><span>Pune</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
