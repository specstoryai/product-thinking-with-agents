---
theme: the-unnamed
layout: cover
background: '#161C2C'
title: 'Product Thinking for Agentic Development'
info: |
  From Human Craft to Agent Orchestration - How infinite building capacity transforms product creation
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-up
mdc: true
themeConfig:
  color: "#F3EFF5"
  background: "#161C2C"
  
  code-background: "#0F131E"
  code-border: "#242d34"

  accents-teal: "#44FFD2"
  accents-yellow: "#FFE45E"
  accents-red: "#FE4A49"
  accents-lightblue: "#15C2CB"
  accents-blue: "#5EADF2"
  accents-vulcan: "#0E131F"
---

<style>
/* Make title font smaller on cover slide */
.cover h1 {
  font-size: 2.5em !important;
}

.cover h2 {
  font-size: 1.5em !important;
}

/* Custom styles for code blocks */
.shiki {
  background: #0F131E !important;
  border: 1px solid #242d34 !important;
}

/* Accent colors */
.text-accent-teal { color: #44FFD2; }
.text-accent-yellow { color: #FFE45E; }
.text-accent-red { color: #FE4A49; }
.text-accent-blue { color: #5EADF2; }
.bg-accent-blue { background-color: #5EADF2; }
.bg-vulcan { background-color: #0E131F; }
.bg-code-background { background-color: #0F131E; }
.border-code-border { border-color: #242d34; }
</style>

# Product Thinking for Agentic Development

<div class="absolute bottom-5 right-5 text-sm opacity-70">
  Jake Levirne & Greg Ceccarelli • 2025
</div>

---
layout: center
---

# The Fundamental Shift

<div class="flex flex-col items-center justify-center mt-8">
  <div v-click class="text-xl text-accent-red mb-4">
    <span class="font-bold">Traditional Development:</span> "We can only build so much"
  </div>
  
  <div v-click class="text-xl text-accent-teal mb-6">
    <span class="font-bold">Agentic Reality:</span> "We can build anything - but should we?"
  </div>
  
  <div v-click class="bg-code-background p-6 rounded-lg border-2 border-accent-yellow mt-4 text-center">
    <div class="text-2xl font-bold text-accent-yellow">
      At SpecStory, we ship micro-SaaS<br/>
      <span class="text-2xl">using 100% Agentic Development</span>
    </div>
  </div>
</div>

---
layout: default
---

# About Us

<div class="grid grid-cols-2 gap-4 -mt-4 mb-8">
  <div class="bg-code-background p-3 rounded-lg border border-code-border">
    <div class="flex flex-col items-center text-center">
      <img src="/greg.png" class="w-28 h-28 rounded-full object-cover mb-1" />
      <h3 class="text-xl font-bold text-accent-yellow leading-tight">Greg Ceccarelli</h3>
      <p class="text-lg leading-tight">Co-founder of SpecStory</p>
      <p class="text-sm text-gray-300 leading-tight">Past CPO at Pluralsight | Ex-GitHub</p>
      <div class="text-sm leading-tight">
        <p class="m-0">🐦 @gregce10</p>
        <p class="m-0">📧 greg@specstory.com</p>
      </div>
    </div>
  </div>
  
  <div class="bg-code-background p-3 rounded-lg border border-code-border">
    <div class="flex flex-col items-center text-center">
      <img src="/jake.jpg" class="w-28 h-28 rounded-full object-cover mb-1" />
      <h3 class="text-xl font-bold text-accent-teal leading-tight">Jake Levirne</h3>
      <p class="text-lg leading-tight">Co-founder of SpecStory</p>
      <p class="text-sm text-gray-300 leading-tight">Past CPO at Docker | Ex-DigitalOcean</p>
      <div class="text-sm leading-tight">
        <p class="m-0">🐦 @awakenjake</p>
        <p class="m-0">📧 jake@specstory.com</p>
      </div>
    </div>
  </div>
</div>

---
layout: default
---

# What We've Built at SpecStory

<div class="grid grid-cols-2 gap-4 mt-6">
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-blue mb-2">tny.dev (External)</h3>
    <p class="text-sm mb-2">An API-first link shortener for Cursor, Claude users </p>
    <p class="text-xs text-gray-400">Time from MVP to Prod: 3 weeks</p>
    <p class="text-xs text-accent-teal">Canceled Bitly. Paying Users. 12K links shortened</p>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-yellow mb-2">tnyform.dev (Internal)</h3>
    <p class="text-sm mb-2">A natural language TypeForm replacement</p>
    <p class="text-xs text-gray-400">Time from MVP to Prod: 1 week</p>
    <p class="text-xs text-accent-teal">Canceled TypeForm. Collects responses from specstory.com/teams</p>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-red mb-2">tnyATS (Internal)</h3>
    <p class="text-sm mb-2">A fully functional ATS that powers specstory.com/careers</p>
    <p class="text-xs text-gray-400">Time from MVP to Prod: 3 days</p>
    <p class="text-xs text-accent-teal">Avoided buying AshbyHQ, Greenhouse, Lever, etc</p>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-teal mb-2">tnydocs (In flight)</h3>
    <p class="text-sm mb-2">A collaborative markdown editor with CRDT</p>
    <p class="text-xs text-gray-400">Time to MVP: 1 day</p>
    <p class="text-xs text-accent-teal">We're going to build it today together!</p>
  </div>
</div>

<div v-click class="text-center mt-6 text-xl text-accent-yellow">
  Each solving ONE job exceptionally well
</div>

---
layout: default
---

# Product Thinking Essentials

<div class="grid grid-cols-2 gap-6 mt-6">
  <div v-click class="flex flex-col">
    <h2 class="text-accent-yellow mb-3 text-lg font-bold">Taste = Calibrated Judgment</h2>
    <div class="bg-code-background p-4 rounded-lg border border-code-border flex-1">
      <ul class="text-sm space-y-2">
        <li>✓ Would YOU use this?</li>
        <li>✓ Is it 10x better at the job?</li>
        <li>✓ Does it have an opinion?</li>
        <li>✓ Can you explain it in one sentence?</li>
      </ul>
    </div>
  </div>
  
  <div v-click class="flex flex-col">
    <h2 class="text-accent-teal mb-3 text-lg font-bold">Jobs-to-be-Done</h2>
    <div class="bg-code-background p-4 rounded-lg border border-code-border flex-1">
      <ul class="text-sm space-y-2">
        <li>• What job are they hiring this for?</li>
        <li>• What are they firing?</li>
        <li>• When does this job arise?</li>
        <li>• How do we know it's done well?</li>
      </ul>
    </div>
  </div>
</div>

<div v-click class="bg-code-background p-4 rounded-lg border-2 border-accent-yellow mt-6 text-center">
  <p class="text-lg">
    <span class="font-bold text-accent-yellow">Key insight:</span> With infinite building capacity,<br/>
    these questions become your ONLY differentiator
  </p>
</div>

---
layout: default
---

# What Changes with AI Agents

<div class="grid grid-cols-2 gap-6 mt-6">
  <div v-click class="bg-code-background p-5 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-blue mb-4">From Managing People</h3>
    <ul class="text-sm space-y-2">
      <li>Task assignment</li>
      <li>Status meetings</li>
      <li>Context switching</li>
      <li>Sequential execution</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-5 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-yellow mb-4">To Orchestrating Agents</h3>
    <ul class="text-sm space-y-2">
      <li>Intent specification via prompts</li>
      <li>Continuous availability 24/7</li>
      <li>Parallel experimentation</li>
      <li>Hours not weeks per iteration</li>
    </ul>
  </div>
</div>

<div v-click class="mt-8 text-center">
  <div class="bg-code-background p-4 rounded-lg border-2 border-accent-teal inline-block">
    <p class="text-xl font-bold text-accent-teal">Real Example from Yesterday:</p>
    <p class="text-base mt-2">Built 3 different versions of a PDF editor simultaneously</p>
    <p class="text-base">Total time: 2 hours | Winner: Version with drag-and-drop</p>
  </div>
</div>

---
layout: default
---

# The SPECIFY Framework

<div class="flex justify-between gap-3 mt-10">
  <div v-click="1" class="flex-1 text-center">
    <div class="bg-code-background border-2 border-accent-blue text-accent-blue font-bold text-4xl rounded-lg py-6 mb-3">S</div>
    <p class="text-sm font-bold">Scope</p>
    <p class="text-xs text-gray-400">the problem clearly</p>
  </div>
  
  <div v-click="2" class="flex-1 text-center">
    <div class="bg-code-background border-2 border-accent-teal text-accent-teal font-bold text-4xl rounded-lg py-6 mb-3">P</div>
    <p class="text-sm font-bold">Prototype</p>
    <p class="text-xs text-gray-400">with agents rapidly</p>
  </div>
  
  <div v-click="3" class="flex-1 text-center">
    <div class="bg-code-background border-2 border-accent-yellow text-accent-yellow font-bold text-4xl rounded-lg py-6 mb-3">E</div>
    <p class="text-sm font-bold">Evaluate</p>
    <p class="text-xs text-gray-400">systematically</p>
  </div>
  
  <div v-click="4" class="flex-1 text-center">
    <div class="bg-code-background border-2 border-accent-red text-accent-red font-bold text-4xl rounded-lg py-6 mb-3">C</div>
    <p class="text-sm font-bold">Compose</p>
    <p class="text-xs text-gray-400">agent workflows</p>
  </div>
  
  <div v-click="5" class="flex-1 text-center">
    <div class="bg-code-background border-2 border-accent-blue text-accent-blue font-bold text-4xl rounded-lg py-6 mb-3">I</div>
    <p class="text-sm font-bold">Iterate</p>
    <p class="text-xs text-gray-400">based on usage</p>
  </div>
  
  <div v-click="6" class="flex-1 text-center">
    <div class="bg-code-background border-2 border-accent-teal text-accent-teal font-bold text-4xl rounded-lg py-6 mb-3">F</div>
    <p class="text-sm font-bold">Fortify</p>
    <p class="text-xs text-gray-400">with guardrails</p>
  </div>
  
  <div v-click="7" class="flex-1 text-center">
    <div class="bg-code-background border-2 border-accent-yellow text-accent-yellow font-bold text-4xl rounded-lg py-6 mb-3">Y</div>
    <p class="text-sm font-bold">Yield</p>
    <p class="text-xs text-gray-400 whitespace-nowrap">control progressively</p>
  </div>
</div>

---
layout: default
---

# Let's Build Something Together

<div class="text-center text-xl text-accent-yellow mb-6">
  Live Demo: Building a Micro-SaaS in 10 Minutes
</div>

<div class="grid grid-cols-2 gap-6">
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-blue mb-3">The Job We'll Solve</h3>
    <p class="text-sm mb-2">
      "I need to quickly extract and format data from screenshots"
    </p>
    <ul class="text-xs space-y-1 text-gray-400">
      <li>• Current solution: Manual retyping</li>
      <li>• When it arises: Daily for researchers</li>
      <li>• Success metric: < 10 seconds per extraction</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-teal mb-3">Our Approach</h3>
    <ol class="text-sm space-y-2">
      <li>1. Scope: Screenshot → Structured data</li>
      <li>2. Prototype: OCR + LLM parsing</li>
      <li>3. Evaluate: Test with real screenshots</li>
      <li>4. Compose: Add format options</li>
    </ol>
  </div>
</div>

<div v-click class="mt-6 text-center">
  <div class="bg-code-background p-4 rounded-lg border-2 border-accent-yellow">
    <p class="text-lg font-bold">Watch as we go from idea → working product</p>
  </div>
</div>

---
layout: default
---

# Real Prompts We Use at SpecStory

<div class="bg-code-background p-4 rounded-lg border border-code-border mb-4">
  <h3 class="text-sm font-bold text-accent-yellow mb-2">Initial Scoping Prompt</h3>
  <pre class="text-xs">
Build a web app that extracts structured data from screenshots.
Requirements:
- Drag and drop interface for images
- Auto-detect tables, lists, and key-value pairs
- Export to JSON, CSV, or Markdown
- Show confidence scores for extractions
- One-click copy to clipboard
Tech: Next.js, Vercel AI SDK, Tesseract.js
  </pre>
</div>

<div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
  <h3 class="text-sm font-bold text-accent-teal mb-2">Iteration Prompt</h3>
  <pre class="text-xs">
The extraction works but users want to see a preview.
Add a side-by-side view:
- Left: Original image with bounding boxes
- Right: Extracted data with edit capability
- Sync highlighting between panels
Keep it simple - this is the core differentiator.
  </pre>
</div>

<div v-click class="text-center mt-4 text-accent-yellow">
  Notice: Clear intent, specific constraints, focused on the job
</div>

---
layout: default
---

# Agent Orchestration in Action

<div class="text-center text-lg text-gray-400 mb-4">How we build with multiple agents</div>

<div class="grid grid-cols-3 gap-3">
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-sm font-bold text-accent-blue mb-2">Claude (Architect)</h3>
    <ul class="text-xs space-y-1">
      <li>• System design</li>
      <li>• Complex logic</li>
      <li>• Code review</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-sm font-bold text-accent-yellow mb-2">Cursor (Builder)</h3>
    <ul class="text-xs space-y-1">
      <li>• Rapid prototyping</li>
      <li>• UI components</li>
      <li>• Refactoring</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-sm font-bold text-accent-teal mb-2">v0 (Designer)</h3>
    <ul class="text-xs space-y-1">
      <li>• UI/UX patterns</li>
      <li>• Component library</li>
      <li>• Responsive design</li>
    </ul>
  </div>
</div>

<div v-click class="mt-6">
  <div class="bg-code-background p-4 rounded-lg border-2 border-accent-red">
    <h3 class="text-base font-bold text-accent-red mb-2">Real Workflow Example</h3>
    <div class="text-sm space-y-1">
      <p>1. Claude: "Design a system for real-time CSV transformations"</p>
      <p>2. v0: "Create the upload and preview interface"</p>
      <p>3. Cursor: "Implement the transformation engine"</p>
      <p>4. Claude: "Review and optimize the pipeline"</p>
      <p class="text-xs text-gray-400 mt-2">Total time: 90 minutes → Shipped to 500 users</p>
    </div>
  </div>
</div>

---
layout: default
---

# Common Pitfalls & How to Avoid Them

<div class="grid grid-cols-2 gap-4 mt-4">
  <div v-click class="bg-code-background p-4 rounded-lg border border-accent-red">
    <h3 class="text-base font-bold text-accent-red mb-2">❌ Building Everything</h3>
    <p class="text-sm">Just because you can doesn't mean you should</p>
    <p class="text-xs text-accent-yellow mt-2">✓ Fix: Validate the job first</p>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-accent-red">
    <h3 class="text-base font-bold text-accent-red mb-2">❌ Overengineering</h3>
    <p class="text-sm">Adding features because AI makes it easy</p>
    <p class="text-xs text-accent-yellow mt-2">✓ Fix: One job, done perfectly</p>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-accent-red">
    <h3 class="text-base font-bold text-accent-red mb-2">❌ Ignoring Taste</h3>
    <p class="text-sm">Shipping mediocre products fast</p>
    <p class="text-xs text-accent-yellow mt-2">✓ Fix: Your standards are your moat</p>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-accent-red">
    <h3 class="text-base font-bold text-accent-red mb-2">❌ Poor Prompting</h3>
    <p class="text-sm">Vague instructions = wasted cycles</p>
    <p class="text-xs text-accent-yellow mt-2">✓ Fix: Specific intent + constraints</p>
  </div>
</div>

<div v-click class="mt-6 text-center">
  <div class="bg-code-background p-4 rounded-lg border-2 border-accent-teal">
    <p class="text-lg font-bold text-accent-teal">Remember: Speed without taste = fast failure</p>
  </div>
</div>

---
layout: default
---

# Your First Micro-SaaS This Week

<div class="text-center text-xl text-accent-yellow mb-6">
  Start with these high-success patterns
</div>

<div class="grid grid-cols-2 gap-4">
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-base font-bold text-accent-blue mb-2">Format Converters</h3>
    <p class="text-xs">PDF→X, CSV→Y, Markdown→Z</p>
    <p class="text-xs text-gray-400">Clear job, easy to validate</p>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-base font-bold text-accent-teal mb-2">Workflow Automators</h3>
    <p class="text-xs">Zapier-like but for ONE specific workflow</p>
    <p class="text-xs text-gray-400">Deep not wide</p>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-base font-bold text-accent-yellow mb-2">Data Extractors</h3>
    <p class="text-xs">Screenshots, PDFs, websites → structured data</p>
    <p class="text-xs text-gray-400">High daily usage potential</p>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-base font-bold text-accent-red mb-2">Micro Analytics</h3>
    <p class="text-xs">One metric, beautifully visualized</p>
    <p class="text-xs text-gray-400">Simplicity wins</p>
  </div>
</div>

<div v-click class="mt-6">
  <div class="bg-code-background p-4 rounded-lg border-2 border-accent-teal text-center">
    <p class="text-lg font-bold mb-2">This Week's Challenge:</p>
    <p class="text-base">Pick one. Build it. Ship it. Get 10 users.</p>
    <p class="text-sm text-gray-400 mt-2">Time budget: 8 hours max</p>
  </div>
</div>

---
layout: default
---

# Two Approaches We Use at SpecStory

<div class="flex justify-center mt-2 pb-20">
  <img src="/specflow.png" class="max-h-[450px]" />
</div>

---
layout: center
---

# Ready to Build?

<div class="text-center mt-8">
  <div v-click class="text-2xl text-accent-yellow mb-6">
    Join us for the full course
  </div>
  
  <div v-click class="text-lg mb-8">
    <p class="text-accent-teal">Product Thinking for Agentic Development</p>
    <p class="text-sm text-gray-400 mt-2">Where we'll build 3 micro-SaaS products together</p>
  </div>
  
  <div v-click class="bg-code-background p-6 rounded-lg border-2 border-accent-yellow inline-block">
    <p class="text-lg mb-2">What you'll leave with:</p>
    <ul class="text-base text-left space-y-2">
      <li>✓ Your own micro-SaaS shipped and live</li>
      <li>✓ Prompt templates and agent workflows</li>
      <li>✓ The SPECIFY framework mastered</li>
      <li>✓ Direct access to our SpecStory playbook</li>
    </ul>
  </div>
  
  <div v-click class="mt-8 text-lg">
    <p class="text-accent-blue">Questions? Let's discuss!</p>
    <p class="text-sm text-gray-400">greg@specstory.com | jake@specstory.com</p>
  </div>
</div>