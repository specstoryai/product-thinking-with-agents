Tips and tricks that should weave into the course (unordered):
When brainstorming, freeform works well. You’re not trying to write the spec on a blank page. You’re trying to get a bunch of related ideas down in one place.
Use voice. Talk until you run out of things to say, even if it’s for 5-10mins. This isn’t much text.
If you have recordings of interviews or team conversations, use those as well. But these typically need some light pre-editing if they cover unrelated topics.
Add screenshots of your app or other apps you like.
If you have background documentation, add it in.
Package choices require human review. Find the suggested packages. Look at them yourself, look for signals of health (recency of commits, number of downloads, GitHub stars). Look for demos of the package in use. Skim the documentation so you have good docs URLs to pass to the agent.
Package versions require human review. AI often picks outdated versions.
API (service) choices require human review and configuration.
Provider preference?
Major cloud providers
Minor cloud providers
AI services
Independent services
Cost
Ease of configuration
There are some parts where you’ll have to do a bunch of clicking around in the config interface. Is it clear, with AI assistance, what you’ll have to do?
Like packages, look for signals of health and demos of the API in use. Skim the docs.
Choose your form factor (web, mobile, desktop, watch app, etc) early on. You can always change it later, but without a choice the AI will either be all over the place or it’ll make a choice for you.
Language choice and “framework” choice don’t matter that much except for these factors:
AI capabilities. Avoid obscure languages.
Package ecosystem.
Understand core concepts relevant to your application and form factor.
Basic web architecture
Client (Browser), Backend Server, REST APIs, Databases, Routing, Authentication, Build/Deployment and Hosting
Basic mobile architecture
Client (Mobile App), Backend Server, REST APIs, Local Storage, Authentication, Push Notifications, App Lifecycle Management, Platform (iOS, Android, cross-platform), Device APIs & Permissions, App Distribution
Basic desktop architecture
Client (Desktop App), Native vs. Multi-platform, Local “Backend”, Local Storage, Authentication, Updates, Platform Support, OS Integration (file system, clipboard), App Lifecycle Management, Distribution
Context priming and context selection
Asking questions about the area of the app or codebase relevant to the spec you’re about to write.
It’s ok to sometimes intentionally leave ambiguity if you need help thinking through a choice. Sometimes you just ask the AI to help you think through the choice. Sometimes you intentionally leave a part of the spec blank and see what the AI comes up with during implementation or planning. If you don’t like it, either roll it back and try again with some tweaks based on what you realized or roll forward making changes to the thing until you like it.
For Users & Needs explorations, you can imagine and you can chat with AI about it. But it’s a 10x if you can talk to half a dozen people that might be your user if you could give them what they want.
<whole set of lessons learned about user research, types of interviews, open/closed ended questions, problem space exploration vs. solution space exploration>
Multi-modal: screenshots are your friend.
Sometimes it’s time to ask the agent to step back and re-think an approach. Ask it to do so explicitly. Not for no reason. And not every time, but when you sense it’s needed. How to sense?
Dead loops for more that 2-3 turns of the crank
The structure of your files / directories don’t look right
When you ask it to summarize what it’s done in your PLAN, something sounds wrong. You read it and say to yourself “wait a minute. What? Why?”
Understand some of the key details of your language / framework and dev tools. Does the thing you just did require a server restart? Clean rebuild? Neither and it’s fine to just allow hot reloading to work.
When in doubt, ask an AI – “with nextjs when do I need a server restart and when can I rely on the dev server to hot reload”. Or, “for the change we just made do you think i need to restart the server”
You could just always restart but that will slow you down. But if you don’t do it when needed you could be chasing ghosts.
How to dump the entire database schema out of Supabase (or other) and then feed that in as context when I’m prompting the agent to generate a new migration. [Greg]
Manage two projects at once. Yeah, we know, “humans can’t multi-task”. But managers have been doing it forever— pretend you’re managing a pair of engineers. Otherwise you’re just going to sit there staring at agent output twiddling your thumbs. 
Off by one errors. More generally, being able to spot or sniff when and why the AI is going off the rails.
Sean’s approach to CLAUDE.md and adversarial review
Jake approach in Tasks prototype checkbox bug to have AI write a simplified version of the feature to load up context on a “clean” approach and then prompt it to use what it learned to fix the bug in the complex workflow. 
Now turn your app into a product video using remotion
Button killing exercise from J Harmer (crewdriver)
Page speedup and seo optimization pagespeed.web.dev
