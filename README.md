# Product Thinking for Agentic Development: Maven Lightning Lesson

**From Human Craft to Agent Orchestration:** Discover how infinite building capacity transforms product creation. At SpecStory, we ship production micro-SaaS products using 100% agentic development—and we'll show you exactly how we do it.

## 🎓 Maven Lightning Lesson

The fundamental shift is here: **"We can build anything - but should we?"** Learn how to apply product thinking essentials when AI agents eliminate traditional development constraints.

### What We Cover
- **Product Thinking Essentials**: Taste (calibrated judgment) + Jobs-to-be-Done framework
- **Specflow Framework**: Our proven approach from brainstorm → spec → implementation
- **Live Coding Demo**: Watch us add "The Bulletizer" feature to tnyOffice in real-time

### Lesson Details
- **📊 [View the Lightning Lesson Slides](https://specstoryai.github.io/product-thinking-with-agents/)** - Interactive Slidev presentation
- **🎥 Lightning Lesson Recording** - *August 19, 2025 at 2 PM EDT*
- **👥 Instructors**: [Greg Ceccarelli](https://www.linkedin.com/in/gregceccarelli/) & [Jake Levirne](https://www.linkedin.com/in/jakelevirne/)

## 🚀 Live Demo: The Bulletizer for tnyOffice

During the lesson, we demonstrate Product Thinking and **Spec Driven Development** by adding "The Bulletizer" - a smart summarization feature to tnyOffice in just 15 minutes:

### What We Build Live
- **The Bulletizer**: Drop ANY content → Get 3-5 clear bullet points
- **Smart Processing**: Handles text, images (OCR), PDFs
- **Instant Results**: < 2 second response time
- **Real Integration**: Added to existing tnyOffice editor

### The tnyOffice Platform
A collaborative markdown editor that demonstrates agentic development:
- **Full-stack app** with WebSocket real-time sync
- **Automerge CRDTs** for conflict-free collaboration
- **SQLite persistence** with automatic backups
- **Next.js frontend** with modern UI
- **TypeScript API** deployed to Fly.io

### See It In Action
- 📁 **Source Code**: [`./tnyOffice/`](./tnyOffice/)
- 🌐 **Live API**: https://tny-office-api.fly.dev

## 📚 Handouts & Resources

1. **[Patterns of Prompting Handout](./handouts/pdfs/specstory-patterns-of-prompting-handout.pdf)** - Master the art of prompting with proven patterns
   - Context-Intent-Constraint (CIC) formula
   - The Pivot Protocol (2-3 attempts max)
   - Quality Language that ships features
   - Progressive Disclosure techniques
   - 8 core patterns with practice scenarios

2. **[25 Lessons Learned Handout](./handouts/pdfs/specstory-25-lessons-handout.pdf)** - Hard-won insights from building production micro-SaaS agentically
   - Ideation & requirements gathering
   - Technology stack decisions
   - Architecture fundamentals
   - Working with AI agents
   - Development workflow optimization

- 🖼️ **[Markdown versions](./handouts/)** for easy reference while prompting

- 💾 **[SpecStory Extension](https://docs.specstory.com)** to save your conversation history


## 📁 Project Structure

```
product-thinking-for-agentic-development/
├── README.md                   # This file
├── lightning-talk-slides/      # Slidev presentation source
│   ├── slides.md               # Main presentation content
│   ├── package.json            # Dependencies
│   ├── public/                 # Presentation assets
│   │   ├── specstoryicon.png   
│   │   ├── greg.png            
│   │   ├── jake.jpg
│   │   └── qr-*.png           
│   ├── components/             # Vue components for slides
│   ├── pages/                  # Additional slide pages
│   ├── snippets/               # Code snippets
│   └── dist/                   # Built slides (gitignored)
├── handouts/                   # PDF and markdown handouts
│   ├── pdfs/
│   │   ├── specstory-patterns-of-prompting-handout.pdf
│   │   └── specstory-25-lessons-handout.pdf
│   ├── specstory-patterns-of-prompting-handout.md
│   └── specstory-25-lessons-handout.md
└── tnyOffice/                  # Live demo application
    ├── apps/
    │   ├── api/                # TypeScript API with Automerge
    │   └── docs/               # Next.js collaborative editor
    └── README.md               # Demo app documentation
```

## 🛠️ Tech Stack

### Presentation
- **[Slidev](https://sli.dev/)** - Developer-friendly slide deck framework
- **Vue 3** - For interactive components
- **GitHub Pages** - Automated deployment via GitHub Actions

### Live Demo (tnyOffice)
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Automerge** - CRDT for real-time collaboration
- **SQLite** - Lightweight persistent storage
- **WebSockets** - Real-time bidirectional communication
- **Fly.io** - Production deployment with WebSocket support
- **Tailwind CSS** - Utility-first styling

## 🤝 About the Instructors

### Jake Levirne
**Co-Founder of SpecStory | Past CPO Docker | Ex-DigitalOcean**

Jake Levirne is a product-obsessed founder who's built products and teams at Docker, DigitalOcean, IBM, and multiple high-growth startups. He's led zero-to-one bets, scaled products to millions of developers, and now he's on a mission to reinvent how software gets built. As founder of SpecStory, Jake helps teams go from vibes to validation—turning raw ideas into specs and specs into software, fast.

### Greg Ceccarelli
**Co-Founder of SpecStory | Past CPO Pluralsight | Ex-GitHub**

Greg Ceccarelli turns intent into software. He co-founded SpecStory on the premise intent is the new source code. He was the Chief Product Officer at Pluralsight. While at GitHub his ML team built Copilot's first Technical Preview. Recently he solo-built tny.dev—an agent-ready link shortener—entirely with AI. He co-authored the O'Reilly book "AI Essentials For Tech Executives" with Hamel Husain and writes weekly "Meditations on Tech" on Substack.

## 📬 Connect & Learn More

- 🌐 **Website**: [specstory.com](https://specstory.com)
- 📧 **Contact**: greg@specstory.com | jake@specstory.com
- 🛠️ **SpecStory Extension**: [docs.specstory.com](https://docs.specstory.com)
- 💼 **LinkedIn**: [Greg](https://www.linkedin.com/in/gregceccarelli/) | [Jake](https://www.linkedin.com/in/jakelevirne/)

## 📜 License

MIT License - Feel free to use these materials for your own learning and teaching.

---

Built with ❤️ and Claude Code by the SpecStory team

*Transform how you build software with AI agents. Join us for the Maven lightning lesson and discover the patterns that ship products.*