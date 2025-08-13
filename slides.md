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

## From Human Craft to Agent Orchestration

<div class="absolute bottom-5 right-5 text-sm opacity-70">
  Greg Ceccarelli • 2025
</div>

---
layout: center
---

# The Fundamental Shift

<div class="flex flex-col items-center justify-center mt-6">
  <div v-click class="text-3xl font-bold text-accent-red mb-8">
    Traditional: "We can only build so much"
  </div>
  
  <div v-click class="text-3xl font-bold text-accent-teal mb-8">
    Agentic Reality: "We can build anything - but should we?"
  </div>
  
  <div v-click class="text-2xl font-bold text-accent-yellow mt-4">
    When building becomes infinite,<br/>
    taste becomes THE differentiator
  </div>
</div>

---
layout: default
---

# About Me

<div class="grid grid-cols-2 gap-8 items-center">
  <div class="flex justify-center">
    <img src="/greg.png" class="w-64 h-64 rounded-full object-cover" />
  </div>
  
  <div>
    <h2 class="text-3xl font-bold text-accent-yellow mb-4">Hello! I'm Greg</h2>
    <p class="text-xl mb-2">Co-founder of SpecStory</p>
    <p class="text-lg mb-4 text-gray-300">Previously CPO at Pluralsight and Data at Dropbox, GitHub, Google</p>
    
    <div class="space-y-2 text-base">
      <p>🐦 X: @gregce10</p>
      <p>📧 greg@specstory.com</p>
      <p>🌐 specstory.com</p>
    </div>
  </div>
</div>

---
layout: default
---

# Part 1: Eternal Truths of Product Thinking

<div class="grid grid-cols-2 gap-8 mt-10">
  <div v-click>
    <h2 class="text-accent-yellow mb-4">Steve Jobs on Taste</h2>
    <div class="bg-code-background p-4 rounded-lg border border-code-border">
      <p class="text-sm mb-3">"Ultimately, it comes down to taste. It comes down to trying to expose yourself to the best things that humans have done and then try to bring those things into what you're doing."</p>
      <ul class="text-sm">
        <li>Not subjective preference</li>
        <li>Calibrated judgment</li>
        <li>Cross-disciplinary pattern recognition</li>
        <li>Stubborn standards</li>
      </ul>
    </div>
  </div>
  
  <div v-click>
    <h2 class="text-accent-teal mb-4">Jobs-to-be-Done</h2>
    <div class="bg-code-background p-4 rounded-lg border border-code-border">
      <p class="text-sm mb-3">"People don't simply buy products; they pull them into their lives to make progress."</p>
      <p class="text-lg text-accent-blue font-bold mb-2">Three Dimensions:</p>
      <ul class="text-sm">
        <li><strong>Functional:</strong> The practical task</li>
        <li><strong>Emotional:</strong> How they want to feel</li>
        <li><strong>Social:</strong> How they want to be perceived</li>
      </ul>
    </div>
  </div>
</div>

---
layout: default
---

# The Four Universal Product Risks

<div class="grid grid-cols-2 gap-6 mt-8">
  <div v-click class="bg-code-background p-6 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-blue mb-3">🎯 Desirability Risk</h3>
    <p class="text-lg">Do people want this?</p>
  </div>
  
  <div v-click class="bg-code-background p-6 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-yellow mb-3">💰 Viability Risk</h3>
    <p class="text-lg">Can we sustain this as a business?</p>
  </div>
  
  <div v-click class="bg-code-background p-6 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-teal mb-3">🔧 Feasibility Risk</h3>
    <p class="text-lg">Can we actually build and maintain this?</p>
  </div>
  
  <div v-click class="bg-code-background p-6 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-red mb-3">👤 Usability Risk</h3>
    <p class="text-lg">Can people successfully use this?</p>
  </div>
</div>

<div v-click class="text-center mt-8 text-2xl font-bold text-accent-yellow">
  Every product decision must navigate these risks
</div>

---
layout: default
---

# What Changes with Agentic Development

<div class="mt-4">
  <div v-click="1" class="mb-6">
    <h2 class="text-2xl font-bold text-accent-teal mb-3">From Sequential to Parallel</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-code-background p-3 rounded-lg border border-code-border">
        <p class="font-bold text-accent-red mb-1">Traditional</p>
        <p class="text-sm">Research → Prototype → Test → Build → Learn</p>
      </div>
      <div class="bg-code-background p-3 rounded-lg border border-code-border">
        <p class="font-bold text-accent-yellow mb-1">Agentic</p>
        <p class="text-sm">Everything simultaneously</p>
      </div>
    </div>
  </div>

  <div v-click="2">
    <h2 class="text-2xl font-bold text-accent-blue mb-3">New Capabilities</h2>
    <ul class="text-lg space-y-1">
      <li>✅ Run 100 experiments in parallel</li>
      <li>✅ Test every assumption concurrently</li>
      <li>✅ Build multiple complete solutions to compare</li>
      <li>✅ Learn from production-quality prototypes</li>
    </ul>
  </div>
</div>

---
layout: default
---

# The New Core Competencies

<div class="grid grid-cols-2 gap-6">
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-blue mb-3">1. Intent Articulation</h3>
    <p class="text-sm mb-2">Translate taste into precise instructions</p>
    <ul class="text-xs opacity-80">
      <li>• Writing quality specifications</li>
      <li>• Defining nuanced success metrics</li>
      <li>• Communicating the "why"</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-yellow mb-3">2. Rapid Judgment</h3>
    <p class="text-sm mb-2">Quality decisions at generation speed</p>
    <ul class="text-xs opacity-80">
      <li>• Quick pattern recognition</li>
      <li>• Decisive go/no-go calls</li>
      <li>• Maintaining standards under velocity</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-teal mb-3">3. System Orchestration</h3>
    <p class="text-sm mb-2">Design agent systems that compound quality</p>
    <ul class="text-xs opacity-80">
      <li>• Workflow design preserving taste</li>
      <li>• Multi-agent coordination</li>
      <li>• Quality gates and checkpoints</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-red mb-3">4. Learning Integration</h3>
    <p class="text-sm mb-2">Products that improve without you</p>
    <ul class="text-xs opacity-80">
      <li>• Designing learning objectives</li>
      <li>• Setting evolution boundaries</li>
      <li>• Monitoring for taste drift</li>
    </ul>
  </div>
</div>

---
layout: default
---

# The TASTE Framework

<div class="text-left max-w-4xl mx-auto mt-4">
  <div v-click class="mb-4 bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-teal mb-1">T - Target</h3>
    <p class="text-sm">Define the job-to-be-done precisely (functional, emotional, social)</p>
  </div>
  
  <div v-click class="mb-4 bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-blue mb-1">A - Articulate</h3>
    <p class="text-sm">Write explicit taste guidelines and quality standards</p>
  </div>
  
  <div v-click class="mb-4 bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-yellow mb-1">S - Spawn</h3>
    <p class="text-sm">Generate 10-20 complete solutions in parallel</p>
  </div>
  
  <div v-click class="mb-4 bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-red mb-1">T - Test</h3>
    <p class="text-sm">Validate every assumption with evidence, not opinions</p>
  </div>
  
  <div v-click class="mb-4 bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-teal mb-1">E - Evolve</h3>
    <p class="text-sm">Build products that improve themselves within taste boundaries</p>
  </div>
</div>

---
layout: default
---

# Pattern 1: The Taste Translator

```
Challenge: Agents can build anything but lack taste
Solution: Create detailed taste specifications

Implementation:
- Write style guides with examples
- Define quality through comparisons
- Create "good vs bad" pattern libraries
- Build evaluation criteria that capture nuance

Human Role: Chief Curator and Quality Guardian
```

<div v-click class="mt-8 bg-code-background p-4 rounded-lg border border-code-border">
  <p class="text-xl font-bold text-accent-yellow text-center">
    Your taste becomes the product's DNA
  </p>
</div>

---
layout: default
---

# Pattern 2: The Solution Factory

```
Challenge: Finding the best solution for the job
Solution: Generate and test many approaches simultaneously

Implementation:
- Create 20+ different solutions
- Each optimized for different job aspects
- Test all with real users
- Measure job success, not feature usage

Human Role: Solution Selector and Taste Arbiter
```

<div v-click class="mt-8 bg-code-background p-4 rounded-lg border border-code-border">
  <p class="text-xl font-bold text-accent-teal text-center">
    Explore the entire solution space at once
  </p>
</div>

---
layout: default
---

# The Weekly Practice

<div class="grid grid-cols-5 gap-3 mt-6">
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="font-bold text-accent-blue mb-2">Monday</h3>
    <p class="text-xs font-bold mb-1">Job Discovery</p>
    <ul class="text-xs opacity-80">
      <li>• Review usage data</li>
      <li>• Identify underserved jobs</li>
      <li>• Prioritize by gap</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="font-bold text-accent-yellow mb-2">Tuesday</h3>
    <p class="text-xs font-bold mb-1">Taste Calibration</p>
    <ul class="text-xs opacity-80">
      <li>• Review excellence</li>
      <li>• Update guidelines</li>
      <li>• Refine criteria</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="font-bold text-accent-teal mb-2">Wednesday</h3>
    <p class="text-xs font-bold mb-1">Solution Generation</p>
    <ul class="text-xs opacity-80">
      <li>• Spawn approaches</li>
      <li>• Target dimensions</li>
      <li>• Build prototypes</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="font-bold text-accent-red mb-2">Thursday</h3>
    <p class="text-xs font-bold mb-1">Parallel Testing</p>
    <ul class="text-xs opacity-80">
      <li>• Deploy to users</li>
      <li>• Measure success</li>
      <li>• Gather feedback</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="font-bold text-accent-blue mb-2">Friday</h3>
    <p class="text-xs font-bold mb-1">Selection & Learning</p>
    <ul class="text-xs opacity-80">
      <li>• Choose winners</li>
      <li>• Document why</li>
      <li>• Deploy & evolve</li>
    </ul>
  </div>
</div>

<div v-click class="text-center mt-6 text-xl font-bold text-accent-yellow">
  From idea to production in one week, every week
</div>

---
layout: default
---

# Micro-SaaS: The Perfect Agentic Canvas

<div class="grid grid-cols-2 gap-8 mt-8">
  <div v-click>
    <h3 class="text-2xl mb-4 text-accent-teal">Why It Works</h3>
    <div class="bg-code-background p-4 rounded-lg border border-code-border">
      <ul class="text-sm space-y-2">
        <li>✅ Single job focus</li>
        <li>✅ Rapid experimentation</li>
        <li>✅ Clear success metrics</li>
        <li>✅ Taste as the moat</li>
      </ul>
    </div>
  </div>
  
  <div v-click>
    <h3 class="text-2xl mb-4 text-accent-yellow">The Playbook</h3>
    <div class="bg-code-background p-4 rounded-lg border border-code-border">
      <ol class="text-sm space-y-2">
        <li>1. Find underserved job</li>
        <li>2. Generate 20 solutions</li>
        <li>3. Test with real users</li>
        <li>4. Pick winner (job success + taste)</li>
        <li>5. Launch & let evolve</li>
        <li>6. Move to next job</li>
      </ol>
    </div>
  </div>
</div>

<div v-click class="mt-8 text-center">
  <p class="text-2xl font-bold text-accent-blue">
    Build a portfolio of excellent single-job products
  </p>
</div>

---
layout: default
---

# New Metrics for the Agentic Age

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="font-bold text-accent-blue mb-3">Taste Metrics</h3>
    <ul class="text-sm">
      <li>• Quality Consistency</li>
      <li>• Taste Alignment %</li>
      <li>• Refinement Rate</li>
      <li>• Excellence Rate</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="font-bold text-accent-yellow mb-3">Velocity Metrics</h3>
    <ul class="text-sm">
      <li>• Ideas per Hour</li>
      <li>• Tests per Day</li>
      <li>• Learning Velocity</li>
      <li>• Evolution Rate</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="font-bold text-accent-teal mb-3">Efficiency Metrics</h3>
    <ul class="text-sm">
      <li>• Cost per Job Success</li>
      <li>• Human Leverage</li>
      <li>• Automation Coverage</li>
      <li>• Judgment Frequency</li>
    </ul>
  </div>
</div>

<div v-click class="text-center mt-8 text-xl font-bold text-accent-red">
  Traditional metrics still matter: Job Success Rate remains primary
</div>

---
layout: default
---

# The Pitfalls to Avoid

<div class="space-y-3 mt-4">
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-base font-bold text-accent-red mb-1">❌ Optimizing Metrics Over Taste</h3>
    <p class="text-xs"><strong>Problem:</strong> Agents maximize what's measured, missing quality</p>
    <p class="text-xs"><strong>Solution:</strong> Make taste explicit in evaluation criteria</p>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-base font-bold text-accent-yellow mb-1">❌ Infinite Building Without Judgment</h3>
    <p class="text-xs"><strong>Problem:</strong> Building everything because you can</p>
    <p class="text-xs"><strong>Solution:</strong> Strengthen "no" muscle, fewer better things</p>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-base font-bold text-accent-blue mb-1">❌ Taste Drift Through Automation</h3>
    <p class="text-xs"><strong>Problem:</strong> Quality degrades as system evolves</p>
    <p class="text-xs"><strong>Solution:</strong> Taste boundaries and regular calibration</p>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-base font-bold text-accent-teal mb-1">❌ Forgetting "Do Things That Don't Scale"</h3>
    <p class="text-xs"><strong>Problem:</strong> Automating before understanding</p>
    <p class="text-xs"><strong>Solution:</strong> Manual first, automate after</p>
  </div>
</div>

---
layout: default
---

# Live Demo Scenarios

<div class="max-w-4xl mx-auto space-y-3 mt-6">
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-blue mb-1">Demo 1: Job Discovery in Real-Time</h3>
    <p class="text-sm">Watch agents analyze user behavior and surface hidden jobs-to-be-done</p>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-yellow mb-1">Demo 2: The Taste Specification Process</h3>
    <p class="text-sm">Transform subjective quality into explicit guidelines agents can follow</p>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-teal mb-1">Demo 3: 20 Solutions in 20 Minutes</h3>
    <p class="text-sm">Generate, build, and deploy multiple solutions for the same job</p>
  </div>
  
  <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
    <h3 class="text-lg font-bold text-accent-red mb-1">Demo 4: Building a Complete Micro-SaaS</h3>
    <p class="text-sm">From job discovery to launched product in one session</p>
  </div>
</div>

---
layout: default
---

# The New Product Creator

<div class="max-w-4xl mx-auto mt-4">
  <div v-click class="mb-6 bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-yellow mb-3">The Eternal Truths Remain</h3>
    <ul class="text-sm space-y-1">
      <li>✨ Taste is the ultimate differentiator</li>
      <li>🎯 Products are hired to do jobs</li>
      <li>🔬 Discovery beats opinion</li>
      <li>🎨 Simple beats complex</li>
      <li>📈 Quality compounds</li>
    </ul>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-teal mb-3">But Everything About Execution Changes</h3>
    <ul class="text-sm space-y-1">
      <li>🔄 From building to curating</li>
      <li>⚡ From sequential to parallel</li>
      <li>🌱 From static to evolving</li>
      <li>🎭 From resource-constrained to taste-constrained</li>
    </ul>
  </div>
</div>

---
layout: default
---

# Your Path Forward

<div class="max-w-4xl mx-auto mt-4">
  <h2 class="text-2xl font-bold text-accent-yellow mb-6 text-center">The Winning Product Creator Will:</h2>
  
  <div class="space-y-2">
    <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
      <p class="text-base"><strong>1.</strong> Cultivate exceptional taste across domains</p>
    </div>
    
    <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
      <p class="text-base"><strong>2.</strong> Master job discovery through behavior</p>
    </div>
    
    <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
      <p class="text-base"><strong>3.</strong> Articulate quality in ways agents understand</p>
    </div>
    
    <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
      <p class="text-base"><strong>4.</strong> Orchestrate parallel experimentation at scale</p>
    </div>
    
    <div v-click class="bg-code-background p-3 rounded-lg border border-code-border">
      <p class="text-base"><strong>5.</strong> Build living products that improve themselves</p>
    </div>
  </div>
  
  <div v-click class="mt-6 text-center text-xl font-bold text-accent-teal">
    The future belongs not to those who can build,<br/>
    but to those who know what's worth building
  </div>
</div>

---
layout: default
---

# Key Takeaways

<div class="max-w-4xl mx-auto space-y-4 mt-6">
  <div v-click class="bg-accent-blue text-black p-4 rounded-lg">
    <h3 class="text-xl font-bold mb-2">🎯 Product thinking becomes MORE important</h3>
    <p class="text-base">When building becomes infinite, judgment becomes everything</p>
  </div>
  
  <div v-click class="bg-code-background p-4 rounded-lg border border-code-border">
    <h3 class="text-xl font-bold text-accent-yellow mb-2">🚀 Start This Week</h3>
    <ul class="text-base space-y-1">
      <li>• Pick one underserved job</li>
      <li>• Use the TASTE framework</li>
      <li>• Build 10 solutions in parallel</li>
      <li>• Ship the best one by Friday</li>
    </ul>
  </div>
  
  <div v-click class="text-center text-2xl font-bold text-accent-teal mt-6">
    Build products of unprecedented quality<br/>
    at unprecedented speed
  </div>
</div>

---
layout: default
---

# Thank You!

<div class="bg-code-background p-6 rounded-lg border border-code-border max-w-3xl mx-auto mt-8">
  <h2 class="text-2xl mb-6 text-accent-yellow font-bold text-center">Let's Connect & Build Together!</h2>
  
  <div class="grid grid-cols-2 gap-6 mb-6">
    <div class="bg-vulcan p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">🐦</div>
      <p class="font-bold text-accent-teal text-lg mb-1">Twitter</p>
      <a href="https://twitter.com/gregce10" class="text-base hover:text-accent-teal hover:underline">@gregce10</a>
    </div>
    
    <div class="bg-vulcan p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">📧</div>
      <p class="font-bold text-accent-blue text-lg mb-1">Email</p>
      <a href="mailto:greg@specstory.com" class="text-base hover:text-accent-blue hover:underline">greg@specstory.com</a>
    </div>
  </div>
  
  <div class="border-t border-gray-700 pt-4 text-center">
    <p class="text-lg text-accent-yellow font-semibold mb-2">
      🚀 Start building with agents this week!
    </p>
    <p class="text-base text-gray-400">
      Remember: Taste is your superpower in the age of infinite building
    </p>
  </div>
</div>