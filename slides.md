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

<div class="grid grid-cols-2 gap-3 mt-3">
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-sm font-bold text-accent-blue mb-1">tny.dev (External)</h3>
    <p class="text-xs mb-1">API-first link shortener for Cursor/Claude</p>
    <p class="text-xs text-gray-400">MVP → Prod: 3 weeks</p>
    <p class="text-xs text-accent-teal">12K links • Paying users</p>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-sm font-bold text-accent-yellow mb-1">tnyform.dev (Internal)</h3>
    <p class="text-xs mb-1">Natural language TypeForm replacement</p>
    <p class="text-xs text-gray-400">MVP → Prod: 1 week</p>
    <p class="text-xs text-accent-teal">Powers specstory.com/teams</p>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-sm font-bold text-accent-red mb-1">tnyATS (Internal)</h3>
    <p class="text-xs mb-1">Full ATS for specstory.com/careers</p>
    <p class="text-xs text-gray-400">MVP → Prod: 3 days</p>
    <p class="text-xs text-accent-teal">Replaced AshbyHQ/Greenhouse</p>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-sm font-bold text-accent-teal mb-1">tnyOffice (In flight)</h3>
    <p class="text-xs mb-1">Collaborative markdown editor + CRDT</p>
    <p class="text-xs text-gray-400">MVP: 1 day</p>
    <p class="text-xs text-accent-teal">Building it today together!</p>
  </div>
</div>

---
layout: default
---

# We Apply Product Thinking Essentials

<div class="grid grid-cols-2 gap-6 mt-6">
  <div v-click class="flex flex-col">
    <h2 class="text-accent-yellow mb-3 text-lg font-bold">Taste = Calibrated Judgment</h2>
    <div class="bg-code-background p-4 rounded-lg border border-code-border flex-1">
      <ul class="text-sm space-y-2">
        <li>Would YOU use this?</li>
        <li>Is it 10x better at the job?</li>
        <li>Does it have an opinion?</li>
        <li>Can you explain it in one sentence?</li>
      </ul>
    </div>
  </div>
  
  <div v-click class="flex flex-col">
    <h2 class="text-accent-teal mb-3 text-lg font-bold">Jobs-to-be-Done</h2>
    <div class="bg-code-background p-4 rounded-lg border border-code-border flex-1">
      <ul class="text-sm space-y-2">
        <li>What job are they hiring this for?</li>
        <li>What are they firing?</li>
        <li>When does this job arise?</li>
        <li>How do we know it's done well?</li>
      </ul>
    </div>
  </div>
</div>

<div v-click class="bg-code-background p-4 rounded-lg border-2 border-accent-yellow mt-6 text-center">
  <p class="text-lg">
    <span class="font-bold text-accent-yellow">Key insight:</span> With near infinite building capacity,<br/>
    solid answers to these questions are your primary differentiator
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

<div v-click class="mt-6 text-center">
  <img src="/specflow_image.png" class="max-h-[150px] mx-auto rounded-lg border border-code-border" />
</div>

---
layout: default
---

# How We Use Specflow at SpecStory

<div class="flex gap-4 mt-2">
<div class="w-5/12">
<div class="bg-code-background p-3 rounded-lg border border-accent-red mb-3">
<h3 class="text-sm font-bold text-accent-red mb-2">Vibe-driven approaches result in:</h3>
<ul class="text-xs space-y-1">
<li>Misaligned outputs that don't match intent</li>
<li>Wasted time on iterations that miss the mark</li>
<li>Fragmented results from uncoordinated efforts</li>
<li>Lost context between development phases</li>
</ul>
</div>
<div class="bg-code-background p-3 rounded-lg border border-accent-teal">
<h3 class="text-sm font-bold text-accent-teal mb-2">Specflow solves this with:</h3>
<ul class="text-xs space-y-1">
<li><strong>Structured Planning:</strong> Clear progression</li>
<li><strong>Human-AI Collaboration:</strong> Optimal tasks</li>
<li><strong>Iterative Refinement:</strong> Continuous improvement</li>
<li><strong>Context Preservation:</strong> Maintain alignment</li>
</ul>
</div>
</div>
<div class="w-7/12 flex items-center justify-center">
<img src="/specflow.png" class="max-h-[380px]" />
</div>
</div>

---
layout: default
---

# Brainstorming: Where Every Product Starts

<div class="flex gap-4 mt-2">
<div class="w-5/12">
<div class="bg-code-background p-4 rounded-lg border border-accent-yellow">
<h3 class="text-base font-bold text-accent-yellow mb-3">Prompts to Get You Thinking</h3>
<ul class="text-sm space-y-2">
<li v-click>What am I trying to build?</li>
<li v-click>Why does this matter?</li>
<li v-click>Random ideas & inspiration</li>
<li v-click>Things I've seen that are cool</li>
<li v-click>Problems this could solve</li>
</ul>
</div>
<div v-click class="bg-code-background p-3 rounded-lg border border-accent-teal mt-3">
<p class="text-xs"><strong>Pro tip:</strong> Use ChatGPT/Claude as your brainstorming partner. Dump everything - no structure needed. The goal is to explore the problem space before jumping to solutions.</p>
</div>
</div>
<div class="w-7/12 flex items-center justify-center">
<img src="/brainstorm.png" class="max-h-[380px] rounded-lg border border-code-border" />
</div>
</div>

---
layout: default
---

# Our Spec Template: From Ideas to Implementation

<div class="bg-code-background p-2 rounded border border-code-border mb-3" style="font-size: 0.6rem; line-height: 1.3;">
<pre style="margin: 0; white-space: pre-wrap;">Create or update the # Current Spec section based on @BRAINSTORM.md:
• My app is for [user description] to let them [solve problem x, have fun playing y]
• The fidelity of my application: [prototype, alpha, beta, production]
• The form factor: [web app, mobile app, desktop app, CLI tool, API, browser extension]
• Key features: [shared calendar, todo list, welcome message]
• Technology choices: [language, framework, packages, cloud services]
→ Create spec ready for AI coding agent to break down into phased task list</pre>
</div>

<div class="grid grid-cols-2 gap-2">
  <div v-click class="bg-code-background p-2 rounded border border-accent-yellow">
    <h3 class="text-xs font-bold text-accent-yellow">🎯 User Description</h3>
    <p style="font-size: 0.65rem; line-height: 1.2;">Be specific! "Researchers who read 50+ papers/week" beats "people who read stuff"</p>
  </div>
  
  <div v-click class="bg-code-background p-2 rounded border border-accent-teal">
    <h3 class="text-xs font-bold text-accent-teal">📊 Fidelity Levels</h3>
    <p style="font-size: 0.65rem; line-height: 1.2;"><strong>Prototype:</strong> Prove it works • <strong>Beta:</strong> Friends • <strong>Prod:</strong> Paying users</p>
  </div>
  
  <div v-click class="bg-code-background p-2 rounded border border-accent-blue">
    <h3 class="text-xs font-bold text-accent-blue">📱 Form Factor</h3>
    <p style="font-size: 0.65rem; line-height: 1.2;">Choose ONE primary. This drives all technical decisions downstream.</p>
  </div>
  
  <div v-click class="bg-code-background p-2 rounded border border-accent-red">
    <h3 class="text-xs font-bold text-accent-red">✅ Why This Works</h3>
    <p style="font-size: 0.65rem; line-height: 1.2;">Forces clarity on WHO, WHAT, and HOW before any code is written</p>
  </div>
</div>

---
layout: default
---

# Let's Build Something Together: The Bulletizer

<div class="text-center text-xl text-accent-yellow mb-6">
  Live Demo: Adding Smart Summarization to tnyOffice in 15 Minutes
</div>

<div class="grid grid-cols-2 gap-6">
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-blue mb-3">The Job We'll Solve</h3>
    <p class="text-sm mb-2">
      "I need to drop ANY content and get 3-5 clear bullets"
    </p>
    <ul class="text-xs space-y-1 text-gray-400">
      <li>Current: Manual reading & summarizing</li>
      <li>Pain: Screenshots, PDFs, walls of text</li>
      <li>Success: Instant, accurate bullet points</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-teal mb-3">Our Thoughtful Approach</h3>
    <ol class="text-sm space-y-2">
      <li><strong>Define Intent:</strong> What makes good bullets?</li>
      <li><strong>Plan First:</strong> Smallest working kernel</li>
      <li><strong>Start Simple:</strong> Text → bullets only</li>
      <li><strong>Then Expand:</strong> Add images, PDFs, audio</li>
    </ol>
  </div>
</div>

<div v-click class="mt-6 text-center">
  <div class="bg-code-background p-4 rounded-lg border-2 border-accent-yellow">
    <p class="text-lg font-bold">Planning before prompting = Avoiding the "Building Everything" trap</p>
  </div>
</div>


---
layout: default
---

# From Brainstorm to Spec: Making It Real

<div class="grid grid-cols-2 gap-4 mt-4">
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-base font-bold text-accent-blue mb-3">The Spec Questions</h3>
    <ul class="text-sm space-y-2">
      <li><strong>Job:</strong> What specific task are we solving?</li>
      <li><strong>User:</strong> Who has this problem most acutely?</li>
      <li><strong>Success:</strong> How do we know it's working?</li>
      <li><strong>Constraints:</strong> What are the non-negotiables?</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-base font-bold text-accent-teal mb-3">Bulletizer Spec Example</h3>
    <ul class="text-sm space-y-2">
      <li><strong>Job:</strong> Extract 3-5 key points from any content</li>
      <li><strong>User:</strong> Researchers, students, note-takers</li>
      <li><strong>Success:</strong> < 2 seconds, accurate summaries</li>
      <li><strong>Constraints:</strong> Works offline, preserves meaning</li>
    </ul>
  </div>
</div>

<div v-click class="mt-6 text-center">
  <div class="bg-code-background p-4 rounded-lg border-2 border-accent-yellow">
    <p class="text-base font-bold">Good specs turn fuzzy ideas into buildable features</p>
  </div>
</div>


---
layout: default
---

# Common Pitfalls & How to Avoid Them

<div class="grid grid-cols-2 gap-2 mt-1">
  <div v-click class="bg-code-background p-2 rounded border border-accent-red">
    <h3 class="text-xs font-bold text-accent-red">❌ Building Everything</h3>
    <p class="text-xs leading-tight">Just because you can doesn't mean you should</p>
    <p class="text-xs text-accent-yellow mt-1">✓ Validate the job first</p>
  </div>
  
  <div v-click class="bg-code-background p-2 rounded border border-accent-red">
    <h3 class="text-xs font-bold text-accent-red">❌ Overengineering</h3>
    <p class="text-xs leading-tight">Adding features because AI makes it easy</p>
    <p class="text-xs text-accent-yellow mt-1">✓ One job, done perfectly</p>
  </div>
  
  <div v-click class="bg-code-background p-2 rounded border border-accent-red">
    <h3 class="text-xs font-bold text-accent-red">❌ Ignoring Taste</h3>
    <p class="text-xs leading-tight">Shipping mediocre products fast</p>
    <p class="text-xs text-accent-yellow mt-1">✓ Your standards are your moat</p>
  </div>
  
  <div v-click class="bg-code-background p-2 rounded border border-accent-red">
    <h3 class="text-xs font-bold text-accent-red">❌ Poor Prompting</h3>
    <p class="text-xs leading-tight">Vague instructions = wasted cycles</p>
    <p class="text-xs text-accent-yellow mt-1">✓ Specific intent + constraints</p>
  </div>
</div>

<div v-click class="mt-3 text-center">
  <div class="bg-code-background p-2 rounded-lg border-2 border-accent-teal">
    <p class="text-sm font-bold text-accent-teal">Remember: Speed without taste = fast failure</p>
  </div>
</div>

---
layout: default
---

# Intent-First Development: The Bulletizer

<div class="text-center text-lg text-gray-400 mb-4">Building thoughtfully with clear intent before code</div>

<div class="grid grid-cols-3 gap-3">
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-sm font-bold text-accent-blue mb-2">Step 1: Intent & Planning</h3>
    <ul class="text-xs space-y-1">
      <li>Define: 3-5 bullets output</li>
      <li>Scope: Text input first</li>
      <li>Constraints: < 2s response</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-sm font-bold text-accent-yellow mb-2">Step 2: Smallest Kernel</h3>
    <ul class="text-xs space-y-1">
      <li>Claude: Design API contract</li>
      <li>Cursor: Basic text → bullets</li>
      <li>Test with real content</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-sm font-bold text-accent-teal mb-2">Step 3: Expand Carefully</h3>
    <ul class="text-xs space-y-1">
      <li>Add image support (OCR)</li>
      <li>Add PDF extraction</li>
      <li>Add audio (later)</li>
    </ul>
  </div>
</div>

<div v-click class="mt-6">
  <div class="bg-code-background p-4 rounded-lg border-2 border-accent-red">
    <h3 class="text-base font-bold text-accent-red mb-2">Live Bulletizer Workflow</h3>
    <div class="text-sm space-y-1">
      <p>1. <strong>Human:</strong> "We need content → 3-5 bullets for note-taking"</p>
      <p>2. <strong>Claude:</strong> Plans API: input types, processing pipeline, output format</p>
      <p>3. <strong>Cursor:</strong> Implements text processor with prompt engineering</p>
      <p>4. <strong>Test:</strong> Chemistry textbook screenshot → perfect bullets!</p>
    </div>
  </div>
</div>

---
layout: center
---

# Want to get even more hands on?

<div class="text-center mt-4">
  <div v-click class="text-xl text-accent-yellow mb-4">
    3-Day Intensive Maven Course • Coming Soon
  </div>
  
  <div v-click class="mb-4">
    <p class="text-2xl font-bold text-accent-teal">PMing Agents to Create Software</p>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border-2 border-accent-yellow inline-block">
    <p class="text-base mb-2">What you'll leave with:</p>
    <ul class="text-sm text-left space-y-1">
      <li>Your own micro-SaaS shipped live</li>
      <li>In depth agent first workflows</li>
      <li>The SPECIFY framework mastered</li>
      <li>Direct access to the SpecStory book on Agentic Development</li>
    </ul>
  </div>
  
  <div v-click class="mt-4 text-base">
    <p class="text-accent-blue">Questions? Hit us up!</p>
    <p class="text-xs text-gray-400">greg@specstory.com | jake@specstory.com</p>
  </div>
</div>