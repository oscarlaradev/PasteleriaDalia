---
name: motion-dev-react
description: >-
  Guides production-grade animations using Motion (motion.dev / Framer Motion) in React
  and Next.js applications, including layout animations, gestures, page transitions,
  exit animations, and spring physics.
---

# Motion (motion.dev) for React & Next.js Skill

This skill provides patterns for declarative, spring-based motion in modern React and Next.js applications using `motion` (formerly Framer Motion).

---

## 📦 Installation
```bash
npm install motion
# or
npm install framer-motion
```

---

## 🛠️ Core Patterns

### 1. Spring-Based Micro-Interactions
```tsx
import { motion } from "motion/react";

export function LuxuryButton({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="btn-primary"
    >
      {children}
    </motion.button>
  );
}
```

### 2. Staggered Children Reveal
```tsx
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export function ProductGrid({ items }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants} className="product-card">
          {item.name}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### 3. Smooth Layout Morphing (Shared Layout)
```tsx
import { motion } from "motion/react";

export function TabSelector({ tabs, activeTab, onSelect }) {
  return (
    <div className="flex gap-2 p-1 bg-surface-muted rounded-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className="relative px-5 py-2 text-sm font-semibold"
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTabPill"
              className="absolute inset-0 bg-white rounded-full shadow-sm"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
```
