# Product Thinking for Agentic Development: Maven Lightning Lesson

## 🎬 **[Watch the slides live](https://specstoryai.github.io/product-thinking-for-agentic-development/)**

<div align="left">
  <img src="./lightning-talk-slides/public/specstoryicon.png" alt="SpecStory Logo" width="100" />
</div>

Master the art of building software with AI agents through real-world patterns, live coding, and proven techniques from 200+ production conversations. This Maven lightning lesson transforms how you think about and work with AI coding assistants like Claude Code, Cursor, and Copilot.

## 🎓 Maven Lightning Lesson

Learn how infinite building capacity transforms product creation in this lightning lesson featuring:

- **📊 [View the Lightning Lesson Slides](https://specstoryai.github.io/product-thinking-for-agentic-development/)** - Interactive Slidev presentation covering the transformation from human craft to agent orchestration
- **🎥 Lightning Lesson Recording** - *January 18, 2025 at 2 PM EDT*
- **👥 Instructors**: [Greg Ceccarelli](https://www.linkedin.com/in/gregceccarelli/) & [Jake Levirne](https://www.linkedin.com/in/jakelevirne/)

## 🚀 Live Demo: tnyOffice Built in Real-Time

During the lesson, we build **tnyOffice** - a collaborative markdown editor with real-time sync (like Google Docs) - demonstrating the power of agentic development:

### What We Build
- **Full-stack collaborative app** with WebSocket real-time sync
- **Automerge CRDTs** for conflict-free collaboration
- **SQLite persistence** with automatic backups
- **Next.js frontend** with modern UI
- **TypeScript API** deployed to Fly.io

### See It In Action
The complete tnyOffice application is included in this repository:
- 📁 **Source Code**: [`./tnyOffice/`](./tnyOffice/)
- 🌐 **Live API**: https://tny-office-api.fly.dev
- 📝 **WebSocket Sync**: wss://tny-office-api.fly.dev/automerge-sync

## 📚 Handouts & Resources

### Pattern Reference Guides
Download our comprehensive handouts distilled from 200+ real-world AI coding sessions:

1. **[Patterns of Prompting Handout](./handouts/pdfs/specstory-patterns-of-prompting-handout.pdf)** - Master the art of prompting with proven patterns
   - Context-Intent-Constraint (CIC) formula
   - The Pivot Protocol (2-3 attempts max)
   - Quality Language that ships features
   - Progressive Disclosure techniques
   - 8 core patterns with practice scenarios

2. **[25 Lessons Learned Handout](./handouts/pdfs/specstory-25-lessons-handout.pdf)** - Hard-won insights from building production micro-SaaS
   - Ideation & requirements gathering
   - Technology stack decisions
   - Architecture fundamentals
   - Working with AI agents
   - Development workflow optimization

### Interactive Materials
- 🖼️ **[Markdown versions](./handouts/)** for easy reference while coding
- 💾 **[SpecStory Extension](https://docs.specstory.com)** to save your conversation history

## 🏃‍♂️ Running the Slides Locally

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/specstoryai/product-thinking-for-agentic-development.git
cd product-thinking-for-agentic-development/lightning-talk-slides

# Install dependencies
npm install
# or
pnpm install
```

### Development
```bash
# Navigate to slides directory
cd lightning-talk-slides

# Start the slide deck locally
npm run dev
# or
pnpm dev

# Visit http://localhost:3030
```

### Building for Production
```bash
# Build static slides
npm run build
# or
pnpm build

# Export to PDF
npm run export
# or
pnpm export
```

## 📁 Project Structure

```
product-thinking-for-agentic-development/
├── README.md                    # This file
├── lightning-talk-slides/       # Slidev presentation source
│   ├── slides.md               # Main presentation content
│   ├── package.json            # Dependencies
│   ├── public/                 # Presentation assets
│   │   ├── specstoryicon.png  # SpecStory branding
│   │   ├── greg.png           # Instructor photos
│   │   ├── jake.jpg
│   │   └── qr-*.png           # QR codes for resources
│   ├── components/             # Vue components for slides
│   ├── pages/                  # Additional slide pages
│   ├── snippets/               # Code snippets
│   └── dist/                   # Built slides (gitignored)
├── handouts/                    # PDF and markdown handouts
│   ├── pdfs/
│   │   ├── specstory-patterns-of-prompting-handout.pdf
│   │   └── specstory-25-lessons-handout.pdf
│   ├── specstory-patterns-of-prompting-handout.md
│   └── specstory-25-lessons-handout.md
└── tnyOffice/                   # Live demo application
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

## 🎯 Key Concepts Covered

### From Human Craft to Agent Orchestration
1. **The Transformation** - How AI changes the developer experience
2. **Product Thinking** - Focusing on outcomes over implementation
3. **Pattern Recognition** - Proven prompting patterns that ship features
4. **Live Building** - Real-time demonstration of agentic development

### Core Patterns You'll Master
- **Context-Intent-Constraint (CIC)** - The formula for clear direction
- **Progressive Disclosure** - Managing complexity gradually
- **The Pivot Protocol** - Knowing when to change approach
- **Quality Language** - Using aesthetic language to guide technical decisions

### Practical Skills
- Setting up effective development environments
- Managing AI agent context and memory
- Debugging and error recovery strategies
- Building production-ready applications rapidly

## 🤝 About the Instructors

### Greg Ceccarelli
- Chief Product Officer at SpecStory
- Built tny.dev through 159 AI-assisted conversations
- Pioneer in agentic development methodologies

### Jake Levirne  
- Head of Software Engineering at SpecStory
- Creator of tnyOffice and multiple micro-SaaS products
- Expert in AI-assisted rapid prototyping

## 📬 Connect & Learn More

- 🌐 **Website**: [specstory.com](https://specstory.com)
- 📧 **Contact**: greg@specstory.com | jake@specstory.com
- 🛠️ **SpecStory Extension**: [docs.specstory.com](https://docs.specstory.com)
- 💼 **LinkedIn**: [Greg](https://www.linkedin.com/in/gregceccarelli/) | [Jake](https://www.linkedin.com/in/jakelevirne/)

## 🚀 Deployment

This presentation is automatically deployed to GitHub Pages on every push to the main branch. The deployment workflow:

1. GitHub Actions builds the Slidev presentation
2. Static files are generated and optimized
3. Deployed to: https://specstoryai.github.io/product-thinking-for-agentic-development/

To deploy your own fork:
1. Enable GitHub Pages in repository settings
2. Set source to GitHub Actions
3. Push to main branch

## 📜 License

MIT License - Feel free to use these materials for your own learning and teaching.

---

Built with ❤️ and Claude Code by the SpecStory team

*Transform how you build software with AI agents. Join us for the Maven lightning lesson and discover the patterns that ship products.*