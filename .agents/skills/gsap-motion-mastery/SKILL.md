---
name: gsap-motion-mastery
description: >-
  Guides implementation of high-end GSAP (GreenSock) animations, ScrollTrigger timelines,
  kinetic typography, smooth scrolling, and micro-interactions. Use when adding deliberate,
  award-winning motion and scroll-driven storytelling to web applications.
---

# GSAP Motion Mastery Skill

This skill provides patterns and best practices for implementing buttery-smooth, hardware-accelerated animations using GSAP 3 and ScrollTrigger.

---

## 🚀 Core Animation Principles

1. **Deliberate, Not Distracting**: Motion must communicate hierarchy, reveal content naturally, or provide physical feedback. Avoid gratuitous movement.
2. **Natural Physics Easing**:
   - Prefer `power2.out`, `power3.out`, or `expo.out` for entries.
   - Use custom curves like `cubic-bezier(0.16, 1, 0.3, 1)` for snappy, tactile micro-interactions.
3. **Hardware Acceleration**: Animate `transform` (`x`, `y`, `scale`, `rotation`) and `opacity`. Avoid animating layout properties (`width`, `height`, `top`, `margin`).

---

## 📦 Setup & CDN / NPM Integration

### HTML / Vanilla JS
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

### Modern Bundler (Next.js / Vite)
```bash
npm install gsap
```
```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

---

## 🛠️ Essential Patterns

### 1. Scroll-Triggered Reveal with Stagger
```javascript
gsap.from(".reveal-item", {
  scrollTrigger: {
    trigger: ".section-container",
    start: "top 80%",
    toggleActions: "play none none reverse"
  },
  y: 40,
  opacity: 0,
  duration: 0.9,
  stagger: 0.12,
  ease: "power3.out"
});
```

### 2. Pinned Horizontal Showcase
```javascript
const track = document.querySelector(".horizontal-track");
gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-section",
    pin: true,
    scrub: 1,
    end: () => `+=${track.scrollWidth - window.innerWidth}`
  }
});
```

### 3. Magnetic Button Micro-Interaction
```javascript
const btn = document.querySelector(".magnetic-btn");
btn.addEventListener("mousemove", (e) => {
  const rect = btn.getBoundingClientRect();
  const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
  const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
  gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out" });
});

btn.addEventListener("mouseleave", () => {
  gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
});
```
