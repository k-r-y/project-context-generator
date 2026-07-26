# UI/UX Strategy

## 1. Visual Language
* **Aesthetic:** Clean, minimalist, and highly modern. The interface must feel like a premium developer tool.
* **Core Styling:** Implement **glassmorphism** (translucent backgrounds with background blur) on the questionnaire cards to create depth against a dark or subtle animated mesh gradient background.

## 2. Layout & Structure
* **The Wizard:** Single-view focused layout. No stepper forms with overwhelming fields. One targeted question category per screen.
* **The Dashboard:** The final output dashboard must utilize a **Bento grid** layout. 
    * The primary grid cell displays the active Markdown document with syntax highlighting.
    * Peripheral cells handle navigation between the 5 context files.
    * A dedicated grid cell houses the interactive metrics/goals checklist.

## 3. Animation & Interaction (Framer Motion)
* **Micro-interactions:** Buttons and selectable chips should have instant feedback (scale down on click, subtle glow on hover).
* **Transitions:** The questionnaire should not scroll. Each question card should slide in smoothly from the right, replacing the previous question, orchestrated by Framer Motion's `AnimatePresence`.


## 4. Colors 

* **Light Color:** `#faf9f5` Light backgrounds and text on dark
* **Dark Color:** `#141413` Primary text and dark backgrounds
* **Mid Gray: :** `#b0aea5` Secondary elements
* **Light Gray:** `#e8e6dc` Subtle backgrounds

* **Accent Color:** `#15803d` for accent, emphasizes, etc.

* **Theme:** Light and Dark mode