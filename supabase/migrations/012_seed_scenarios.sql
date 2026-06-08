-- Seed: 1 scenario + script + prompts + checklist + public settings per brand
-- Brand UUIDs match 011_seed_brands.sql

-- ─────────────────────────────────────────────
-- SCENARIOS
-- ─────────────────────────────────────────────
INSERT INTO scenarios (id, title, niche, hook, audience, emotion, palette, status, notes, brand_id) VALUES

-- 1. Finance
(
  'b0000000-0000-0000-0000-000000000001',
  'The Hidden Tax Trap Destroying Middle-Class Wealth',
  'tax',
  'Most people pay 40% more tax than they legally have to — and their accountant never told them.',
  'Working professionals aged 28–45 earning $60k–$150k',
  'Urgency, betrayal, empowerment',
  'gold_noir',
  'published',
  'Focus on bracket creep, W-2 vs 1099 deductions, and HSA strategy.',
  'a0000000-0000-0000-0000-000000000001'
),

-- 2. Horror
(
  'b0000000-0000-0000-0000-000000000002',
  'The Smile — A True Account of Room 237',
  'paranormal',
  'Three hotel employees quit the same week. None of them will say why. The guest in room 237 checked in alone — but housekeeping heard two voices every night.',
  'Horror fans aged 18–35 who love true ghost accounts',
  'Dread, curiosity, mounting terror',
  'blood_noir',
  'published',
  'Slow build. No jump scares — pure psychological dread. End on ambiguity.',
  'a0000000-0000-0000-0000-000000000002'
),

-- 3. Philosophy
(
  'b0000000-0000-0000-0000-000000000003',
  'You Have Never Made a Single Free Choice in Your Life',
  'existentialism',
  'Every decision you think you made freely was determined before you were born — and the implications are terrifying.',
  'Curious thinkers aged 20–40 open to challenging ideas',
  'Mind-blown, existential unease, wonder',
  'indigo_void',
  'published',
  'Cover hard determinism, compatibilism, and what free will actually means if it exists.',
  'a0000000-0000-0000-0000-000000000003'
),

-- 4. Psychology
(
  'b0000000-0000-0000-0000-000000000004',
  'The Dark Triad: How to Spot a Manipulator in 60 Seconds',
  'dark_psychology',
  'Narcissists, Machiavellians and psychopaths follow a predictable 3-step pattern — and once you see it, you cannot unsee it.',
  'Adults who have dealt with toxic people or want to protect themselves',
  'Revelation, alertness, controlled fear',
  'teal_shadow',
  'published',
  'Cover the three traits, real-world examples, and the love-bombing → devalue → discard cycle.',
  'a0000000-0000-0000-0000-000000000004'
),

-- 5. True Crime
(
  'b0000000-0000-0000-0000-000000000005',
  'The Zodiac Killer''s Last Message Was Never Cracked — Until Now',
  'cold_cases',
  'For 51 years the final Zodiac cipher sat unsolved. In 2024 a retired librarian cracked it from her kitchen table.',
  'True crime enthusiasts aged 25–50',
  'Tension, fascination, satisfying resolution',
  'crimson_dark',
  'published',
  'Walk through the Z340 cipher, the amateur codebreakers, and what the decoded message revealed.',
  'a0000000-0000-0000-0000-000000000005'
),

-- 6. History
(
  'b0000000-0000-0000-0000-000000000006',
  'The Night Rome Burned and Nero Played His Lyre',
  'ancient',
  'The greatest city on Earth was on fire for six days. The emperor''s response became the most infamous act of leadership in history.',
  'History enthusiasts aged 25–55',
  'Epic drama, disbelief, historical weight',
  'amber_epic',
  'published',
  'Cover the fire of 64 AD, Nero''s PR disaster, the Christians blamed, and how it reshaped Rome.',
  'a0000000-0000-0000-0000-000000000006'
),

-- 7. Science
(
  'b0000000-0000-0000-0000-000000000007',
  'The Universe Should Not Exist — Here''s Why It Does',
  'physics',
  'When the Big Bang happened, equal amounts of matter and antimatter were created. They should have annihilated each other. Something cheated — and we are that something.',
  'Curious minds aged 18–45 who love big questions',
  'Awe, wonder, intellectual excitement',
  'cyan_cosmos',
  'published',
  'Cover matter-antimatter asymmetry, CP violation, and the baryon asymmetry problem.',
  'a0000000-0000-0000-0000-000000000007'
),

-- 8. Mythology
(
  'b0000000-0000-0000-0000-000000000008',
  'Loki''s True Punishment Was Worse Than Death',
  'norse',
  'The gods did not kill Loki. They did something far more cruel — and he is still there, waiting, beneath the earth.',
  'Mythology fans and Norse culture enthusiasts aged 16–40',
  'Dread, dark wonder, mythic weight',
  'violet_myth',
  'published',
  'Cover Loki''s binding, Sigyn and the bowl, the earthquakes myth, and Ragnarok countdown.',
  'a0000000-0000-0000-0000-000000000008'
),

-- 9. Self Improvement
(
  'b0000000-0000-0000-0000-000000000009',
  'The 5 AM Club Is Lying to You — Do This Instead',
  'habits',
  'Waking up at 5 AM made millions of people more exhausted and less productive. The science points to a completely different answer.',
  'Ambitious professionals aged 22–40 optimising their performance',
  'Relief, curiosity, motivation',
  'ember_warm',
  'published',
  'Cover chronotypes, sleep pressure, ultradian rhythms, and time-of-day peak performance.',
  'a0000000-0000-0000-0000-000000000009'
),

-- 10. Technology
(
  'b0000000-0000-0000-0000-000000000010',
  'GPT-5 Just Made Half of All White-Collar Jobs Obsolete',
  'ai',
  'The jobs safe from automation in 2022 are the first ones falling in 2025 — and the replacement wave is only getting started.',
  'Professionals and students aged 20–45 thinking about career futures',
  'Urgency, disruption, strategic curiosity',
  'electric_blue',
  'published',
  'Cover the capability jump from GPT-4 to GPT-5, affected professions, and what skills still matter.',
  'a0000000-0000-0000-0000-000000000010'
)

ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────
-- SCRIPTS
-- ─────────────────────────────────────────────
INSERT INTO scripts (id, scenario_id, body, duration_sec) VALUES

-- Finance
(
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'Most people hand the government 40% more of their income than the law actually requires. Not because they want to. Because nobody told them the rules.

Here are three tax traps destroying middle-class wealth right now.

Trap one: bracket blindness. When you earn a raise and cross into the next bracket, only the dollars above the threshold get taxed at the higher rate. Yet 67% of Americans believe their entire income gets taxed at the new rate. That fear keeps them from negotiating salary, taking bonuses, or investing — all because of a myth.

Trap two: ignoring the HSA triple-stack. A Health Savings Account is the only account in existence that gives you a tax deduction going in, tax-free growth inside, and zero tax coming out — if used for medical expenses. Most people treat it like a spending account and drain it every year. The right move: pay medical bills out of pocket, let the HSA compound for 30 years, and retire with a tax-free six-figure medical fund.

Trap three: W-2 blindness. If you have a side business — even a small one — you can deduct a home office, a portion of your phone, mileage, software, education, and health insurance premiums. People with a 9-to-5 and a side hustle are sitting on thousands in legal deductions they never claim.

The tax code was not written for the people who earn money. It was written by the people who own things. Learning the code is not cheating — it is literacy.

Start with the HSA. Open one this week if you have a qualifying high-deductible health plan. Your future self will not regret it.',
  138
),

-- Horror
(
  'c0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000002',
  'Room 237 of the Hargrove Hotel in Portland, Oregon has been unoccupied since March 2019.

Not because it is haunted. The management is very clear about that.

Because of the smell.

It started with the guest in room 237. He checked in on a Tuesday. Alone — one name on the reservation, one key card issued. Standard check-in. The night auditor noted nothing unusual.

But at 2:17 AM, housekeeping received a noise complaint from room 236. Laughter. Two people laughing. The kind of laughter, the complaint read, that does not sound like it is about anything funny.

The housekeeper knocked on 237. No answer. She used the master key.

The room was empty. The bed had not been slept in. The bathroom was dry.

She wrote it off as sound bleed from another floor and went back to her station.

The same call came at 2:17 AM the following night. And the night after that.

On the fourth night, the housekeeper did not knock. She pressed her ear to the door and listened.

There were two voices. One was the guest. The other — she could not explain later — did not sound like it came from a human throat.

She handed in her notice the next morning. She refused to say why.

Two other staff members quit that week. Neither gave a reason.

The guest checked out on Sunday. Quietly. No complaints, no issues. He left a folded note on the pillow.

The cleaning crew found it. The manager read it, placed it in an envelope, and locked it in his office.

He has never told anyone what it said.

Room 237 has been used for storage ever since. The smell, staff say, is like copper and rain. And it is strongest at 2:17 in the morning.',
  172
),

-- Philosophy
(
  'c0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000003',
  'You did not choose to watch this video. You only think you did.

The neurons that fired when you decided to click were already set in motion by the meal you had this morning, the mood you woke up with, the childhood that shaped your tastes, and the genes you inherited from people who died before you were born.

This is hard determinism. The idea that every event — including every thought, every choice, every moment of apparent free will — is the inevitable result of prior causes stretching back to the beginning of the universe.

If it is true, then nobody has ever actually chosen anything. Every criminal who ever lived could not have done otherwise. Every hero was simply a machine running its program.

Most people find this unbearable. So they reject it.

But the physics is uncomfortable. The brain makes decisions before the conscious mind is aware of them — up to seven seconds before, in some experiments. You experience the choice after the brain has already committed. The feeling of deciding is a story your consciousness tells retroactively.

So where does that leave us?

Compatibilists — philosophers like Daniel Dennett — argue that free will and determinism can coexist. That what we mean by free will is not some magical ability to step outside the causal chain. It is the ability to act according to your own reasons, without coercion. The fact that those reasons were caused by prior events does not make them less yours.

Whether that satisfies you depends on what you were always going to believe.

Think about that.',
  155
),

-- Psychology
(
  'c0000000-0000-0000-0000-000000000004',
  'b0000000-0000-0000-0000-000000000004',
  'There is a personality cluster that researchers call the Dark Triad. Three traits that frequently appear together. And once you know the pattern, you will start seeing it everywhere.

The three traits are narcissism, Machiavellianism, and psychopathy.

Narcissism is an inflated sense of self-importance combined with a deep need for admiration. The narcissist is not just confident — they require constant validation, and they react to perceived slights with disproportionate rage or contempt.

Machiavellianism is the willingness to manipulate and exploit others to achieve personal goals. Named after the Renaissance political philosopher who argued that power justifies deception. The Machiavellian is patient. Strategic. They play long games.

Psychopathy is shallow emotion combined with high impulsivity and low remorse. The psychopath is not necessarily violent. Most are not. But they do not feel guilt the way you do — which makes them dangerous in relationships, boardrooms, and politics.

Now here is the three-step pattern.

Step one: love bombing. Excessive flattery, attention, and affection in the early stages. They make you feel like the most important person in the world. This builds dependency.

Step two: devaluation. Once dependency is established, the praise stops. Criticism starts. Subtle at first, then relentless. You begin to doubt yourself.

Step three: discard. When you are no longer useful — or when you resist — they move on without remorse. Sometimes suddenly. Often to someone they have been grooming in parallel.

Knowing the pattern does not make you immune. But it gives you a name for what is happening. And naming a thing is the first step to escaping it.',
  178
),

-- True Crime
(
  'c0000000-0000-0000-0000-000000000005',
  'b0000000-0000-0000-0000-000000000005',
  'On November 8 1969, the Zodiac Killer mailed a 340-character cipher to the San Francisco Chronicle. He had already killed at least five people. He promised the cipher contained his identity.

It sat unsolved for fifty-one years.

Professional cryptographers tried. The FBI tried. Amateurs tried for decades on internet forums. The Z340 resisted everything.

Then in December 2020, a team of three amateur codebreakers — a systems developer in Australia, a mathematician in Belgium, and a retired librarian in Virginia — cracked it using a computer algorithm designed to test transposition patterns across multiple languages simultaneously.

The message read: I hope you are having lots of fun in trying to catch me. I am not afraid of the gas chamber because it will send me to paradice early because I now have enough slaves to work for me.

No name. No identity. But the crack mattered because it confirmed the cipher was real — not a hoax — and that his other ciphers likely follow the same architecture.

The Z13 — thirteen characters mailed separately, believed to contain his name — has still never been decoded.

Some researchers believe the name is hidden inside a known cipher using a null cipher technique — where only certain letters, read in a specific pattern, spell the real message.

Others believe he never intended it to be cracked.

The Zodiac Killer was never caught. He was never identified. He stopped writing in 1974.

Or he stopped signing his letters.',
  168
),

-- History
(
  'c0000000-0000-0000-0000-000000000006',
  'b0000000-0000-0000-0000-000000000006',
  'On July 18th in the year 64 AD, fire broke out in the merchant shops beneath the Circus Maximus in Rome.

Within hours it had spread to seven of the city''s fourteen districts.

It burned for six days.

When it was finally contained, three districts had been completely destroyed. Seven more were rubble and ash. A million people were displaced. Two thousand years of accumulated history — temples, forums, records, homes — gone.

And where was the Emperor Nero?

Thirty-five miles away in Antium, where he was born.

The ancient historian Tacitus — writing just decades later — recorded that Nero returned to Rome not to lead relief efforts, but to survey the cleared land. Land he had long wanted. Land he would soon use to build his Domus Aurea: a palace complex so enormous it had an artificial lake, rotating dining rooms, and a 120-foot gilded statue of himself at the entrance.

Whether Nero started the fire is historically debated. The Roman historian Suetonius claimed he watched the blaze from a tower while singing a lament about the fall of Troy. The phrase fiddles while Rome burns is a mistranslation — the fiddle would not be invented for another thousand years — but the image it captures is accurate enough.

What is certain is what happened next. Nero needed a scapegoat. He found one in a small, strange religious sect that most Romans had never heard of.

He called them Christians.

The persecution that followed was the first state-sponsored violence against Christianity in history. It would not be the last.

And the palace Nero built on the ashes? After his death, the Romans tore it down and built the Colosseum on its lake.',
  198
),

-- Science
(
  'c0000000-0000-0000-0000-000000000007',
  'b0000000-0000-0000-0000-000000000007',
  'When the universe began, the laws of physics produced exactly equal amounts of matter and antimatter.

Equal. Perfectly balanced.

Matter and antimatter annihilate each other on contact, producing pure energy. So if the Big Bang created equal parts of both, they should have annihilated each other completely. The universe should be nothing but light.

No stars. No planets. No atoms. No you.

And yet here we are. Which means something, somewhere, broke the symmetry.

Physicists call this the baryon asymmetry problem. For every billion matter-antimatter pairs that annihilated in the early universe, there was one extra particle of matter left over. Just one. That tiny excess — roughly one part in a billion — is literally everything that exists.

Every galaxy. Every sun. Every atom in your body. The entire observable universe is the rounding error of an almost-perfect annihilation.

The mechanism that caused this asymmetry is called CP violation — a subtle difference in how certain particles and antiparticles decay. We have observed it. We have measured it. But the amount of CP violation we can measure in the standard model of physics is not nearly large enough to account for the matter that exists.

Which means there is physics beyond what we currently know. There is a process, a particle, a force — something — that we have not discovered yet that tipped the scales.

We exist because the universe cheated.

And we still do not know how.',
  162
),

-- Mythology
(
  'c0000000-0000-0000-0000-000000000008',
  'b0000000-0000-0000-0000-000000000008',
  'The gods of Asgard did not kill Loki.

Killing Loki would have been merciful.

After Loki orchestrated the death of Baldr — the most beloved of all the gods — the Aesir hunted him across the nine realms. He transformed into a salmon and hid in a mountain river. They caught him with a net he had invented himself.

Then they took him underground.

They bound him with the entrails of his own son Narfi, transformed into iron chains. The chains were threaded through rock. His son Váli was transformed into a wolf who tore Narfi apart to provide the bindings.

They placed Loki on three jagged stones. Above his face, they positioned a serpent — hung so that its venom dripped down onto him. Drop by drop. Endlessly.

His wife Sigyn stayed. She held a bowl above his face to catch the venom. She has been holding it ever since.

But the bowl fills. She has to turn away to empty it. And in those moments, the venom hits his face.

When it does, Loki writhes.

The Norse people said this was the cause of earthquakes.

He is still there. Still bound. Still waiting.

Because Loki does not stay bound forever.

The prophecy of Ragnarok says that at the end of all things, the chains will break. Loki will rise. He will captain the ship Naglfar — built from the fingernails and toenails of the dead — and sail it to the final battle.

The gods know this. They bound him anyway.

They could not kill him. So they chose to delay the end.

The bowl is still filling.',
  183
),

-- Self Improvement
(
  'c0000000-0000-0000-0000-000000000009',
  'b0000000-0000-0000-0000-000000000009',
  'The 5 AM Club has sold millions of books. Thousands of productivity influencers swear by it. Wake up at 5, exercise, journal, conquer the day before it starts.

There is one problem. The science does not support it.

Chronobiology — the study of biological time — has established that roughly 40% of people are evening chronotypes. Their cortisol peaks later. Their reaction time, creative output, and working memory are all measurably worse in the early morning hours.

Forcing a natural night owl to wake at 5 AM is not discipline. It is sleep deprivation. And sleep deprivation costs you cognitive performance, emotional regulation, and physical recovery — the exact things you are trying to build.

The research on elite performance does not point to a universal wake time. It points to peak windows. Each person has a 2-to-4 hour window each day — typically in the late morning or early afternoon for most chronotypes — where core temperature, alertness, and processing speed converge at their highest point. This is called your peak performance window.

The 5 AM crowd accidentally stumbled on something real for morning chronotypes. They found their window and called it a virtue.

Here is the actual framework. First: identify your chronotype. The Munich Chronotype Questionnaire is free online. Second: protect the 2-hour window after your alertness peaks for your most cognitively demanding work. Third: sleep at a consistent time — the anchor of everything.

The goal is not to wake up earlier. The goal is to do your best work when your biology cooperates.

For some people that is 5 AM. For others it is 10. Both are correct.',
  172
),

-- Technology
(
  'c0000000-0000-0000-0000-000000000010',
  'b0000000-0000-0000-0000-000000000010',
  'In 2022, the jobs considered safe from AI automation were the complex ones. The creative ones. The ones requiring judgment, nuance, and human context.

Legal analysis. Financial research. Medical documentation. Software architecture. Copywriting. Graphic design.

By 2025, those are the first jobs falling.

GPT-4 passed the bar exam at the 90th percentile. GPT-5 scores higher than 99% of human test-takers on standardized reasoning benchmarks. Entry-level lawyers, junior analysts, and associate-level consultants are not being replaced outright — they are being replaced at scale. One senior professional with AI tools now produces the output of eight junior ones.

This is not automation in the factory sense. It is compression. The demand for human labor in knowledge work is not disappearing — it is concentrating at the top and the edges.

The jobs that remain are the ones AI still cannot do reliably. Physical dexterity in unpredictable environments — plumbers, electricians, surgeons. High-stakes relationship trust — therapists, sales, executives. Novel creative direction — not execution, which AI now does cheaply, but taste-making and direction-setting.

And the people who will do best in this transition are not the ones who ignore AI. They are the ones who learn to direct it. Who develop judgment fast enough to supervise outputs that non-experts cannot evaluate.

The white-collar apocalypse is not coming. It is already here. It is just wearing a polished interface and moving quietly through corporate expense reports labeled productivity tools.

The question is not whether your job is affected. It is whether you are learning fast enough to be the one holding the prompts instead of being replaced by them.',
  182
)

ON CONFLICT (scenario_id) DO NOTHING;


-- ─────────────────────────────────────────────
-- PROMPTS (3 per scenario)
-- ─────────────────────────────────────────────
INSERT INTO prompts (scenario_id, scene_type, caption_word, prompt_text, ai_tool, sort_order) VALUES

-- Finance
('b0000000-0000-0000-0000-000000000001', 'hook',    'TRAP',    'Cinematic close-up of a tax document, red ink, dollar bills scattered, dramatic side lighting, dark moody background, photorealistic --ar 9:16 --v 6', 'midjourney', 0),
('b0000000-0000-0000-0000-000000000001', 'buildup', 'REVEAL',  'A piggy bank cracking open, gold coins spilling, government building blurred in background, symbolic, dark gold tones, cinematic --ar 9:16 --v 6', 'midjourney', 1),
('b0000000-0000-0000-0000-000000000001', 'payoff',  'FREEDOM', 'Person standing confidently at a glass window overlooking a city at night, warm gold light, wealth aesthetic, photorealistic --ar 9:16 --v 6', 'midjourney', 2),

-- Horror
('b0000000-0000-0000-0000-000000000002', 'hook',    'ROOM',    'Dark hotel corridor, single door with the number 237 illuminated, crimson light leaking under the door, fog, photorealistic horror --ar 9:16 --v 6', 'midjourney', 0),
('b0000000-0000-0000-0000-000000000002', 'buildup', 'VOICES',  'Empty hotel room interior, unmade bed, shadows forming humanoid shapes, eerie silence visualized, ultra-dark atmosphere --ar 9:16 --v 6', 'midjourney', 1),
('b0000000-0000-0000-0000-000000000002', 'payoff',  'NOTE',    'A folded white note on a hotel pillow, extreme close-up, one word visible but blurred, bone-chilling lighting --ar 9:16 --v 6', 'midjourney', 2),

-- Philosophy
('b0000000-0000-0000-0000-000000000003', 'hook',    'CHOICE',  'A human brain with glowing neural pathways, decision tree visualized as light threads, deep indigo background, conceptual art --ar 9:16 --v 6', 'midjourney', 0),
('b0000000-0000-0000-0000-000000000003', 'buildup', 'CAUSE',   'Domino chain reaction in space, each domino labelled with abstract concepts, infinite depth, indigo and violet tones --ar 9:16 --v 6', 'midjourney', 1),
('b0000000-0000-0000-0000-000000000003', 'payoff',  'TRUTH',   'Person at a crossroads floating in void, both paths identical, existential scale, minimal surrealism, deep purple --ar 9:16 --v 6', 'midjourney', 2),

-- Psychology
('b0000000-0000-0000-0000-000000000004', 'hook',    'MASK',    'A beautiful smiling mask floating in darkness, behind it a shadowed face with hollow eyes, teal accent lighting, sinister aesthetic --ar 9:16 --v 6', 'midjourney', 0),
('b0000000-0000-0000-0000-000000000004', 'buildup', 'PATTERN', 'Chessboard with human figures as pieces, one figure controlling others with invisible strings, dark teal cinematic --ar 9:16 --v 6', 'midjourney', 1),
('b0000000-0000-0000-0000-000000000004', 'payoff',  'ESCAPE',  'Person walking away from a shattered mirror, reflection shows manipulator figure, teal dawn light, empowering --ar 9:16 --v 6', 'midjourney', 2),

-- True Crime
('b0000000-0000-0000-0000-000000000005', 'hook',    'CIPHER',  'Close-up of the Z340 cipher letter, aged paper, red ink symbols, evidence tags, crime lab lighting, documentary realism --ar 9:16 --v 6', 'midjourney', 0),
('b0000000-0000-0000-0000-000000000005', 'buildup', 'DECODE',  'Computer screen in dark room displaying cipher patterns, hands typing, breakthrough moment, dark red ambient light --ar 9:16 --v 6', 'midjourney', 1),
('b0000000-0000-0000-0000-000000000005', 'payoff',  'UNSOLVED','Zodiac crosshair symbol dissolving into question marks, noir atmosphere, cold case aesthetic, crimson and shadow --ar 9:16 --v 6', 'midjourney', 2),

-- History
('b0000000-0000-0000-0000-000000000006', 'hook',    'FIRE',    'Ancient Rome burning at night, Colosseum silhouette, flames reflected in the Tiber river, epic cinematic scale, amber tones --ar 9:16 --v 6', 'midjourney', 0),
('b0000000-0000-0000-0000-000000000006', 'buildup', 'EMPEROR', 'Nero figure on a tower watching the city burn below, golden robe, detached expression, epic historical drama --ar 9:16 --v 6', 'midjourney', 1),
('b0000000-0000-0000-0000-000000000006', 'payoff',  'LEGACY',  'The Colosseum rising from ashes, construction underway, Roman citizens, dawn light breaking, historical epic --ar 9:16 --v 6', 'midjourney', 2),

-- Science
('b0000000-0000-0000-0000-000000000007', 'hook',    'MATTER',  'Matter and antimatter particles colliding and annihilating in deep space, one particle surviving, cyan energy burst --ar 9:16 --v 6', 'midjourney', 0),
('b0000000-0000-0000-0000-000000000007', 'buildup', 'BALANCE', 'Cosmic scales perfectly balanced then tipping by one particle, universe at stake, scientific surrealism, deep blue --ar 9:16 --v 6', 'midjourney', 1),
('b0000000-0000-0000-0000-000000000007', 'payoff',  'US',      'A single atom transforming into galaxies, stars, then a human eye, the entire universe in one gaze, awe-inspiring --ar 9:16 --v 6', 'midjourney', 2),

-- Mythology
('b0000000-0000-0000-0000-000000000008', 'hook',    'BOUND',   'Loki chained to rocks underground, serpent above dripping venom, wife holding a bowl, purple and black mythic art --ar 9:16 --v 6', 'midjourney', 0),
('b0000000-0000-0000-0000-000000000008', 'buildup', 'VENOM',   'The bowl overflowing, venom drop falling in slow motion, the ground shaking, Norse horror aesthetic, deep violet --ar 9:16 --v 6', 'midjourney', 1),
('b0000000-0000-0000-0000-000000000008', 'payoff',  'RAGNAROK','Loki breaking free, chains shattering, cosmic fire and frost, Naglfar ship in background, epic mythic scale --ar 9:16 --v 6', 'midjourney', 2),

-- Self Improvement
('b0000000-0000-0000-0000-000000000009', 'hook',    'ALARM',   'Alarm clock at 5 AM shattered on the floor, person sleeping peacefully, warm morning light, anti-hustle aesthetic --ar 9:16 --v 6', 'midjourney', 0),
('b0000000-0000-0000-0000-000000000009', 'buildup', 'PEAK',    'Brain activity graph showing a distinct peak window in the morning, person in deep focus state, warm amber tones --ar 9:16 --v 6', 'midjourney', 1),
('b0000000-0000-0000-0000-000000000009', 'payoff',  'FLOW',    'Person in complete flow state at their desk, warm natural light, calm productive energy, orange-gold morning --ar 9:16 --v 6', 'midjourney', 2),

-- Technology
('b0000000-0000-0000-0000-000000000010', 'hook',    'REPLACE', 'Office desk slowly being replaced by a glowing AI interface, empty chair, cold blue light, corporate dystopia --ar 9:16 --v 6', 'midjourney', 0),
('b0000000-0000-0000-0000-000000000010', 'buildup', 'COMPRESS','One person at a desk with eight holographic AI assistants, hyper-productive, electric blue ambience --ar 9:16 --v 6', 'midjourney', 1),
('b0000000-0000-0000-0000-000000000010', 'payoff',  'DIRECT',  'Human hand directing an AI interface like a conductor, in control, confident, electric blue and white --ar 9:16 --v 6', 'midjourney', 2);


-- ─────────────────────────────────────────────
-- CHECKLIST ITEMS (5 per scenario)
-- ─────────────────────────────────────────────
INSERT INTO checklist_items (scenario_id, label, is_done, sort_order) VALUES

-- Finance
('b0000000-0000-0000-0000-000000000001', 'Script written & approved', true, 0),
('b0000000-0000-0000-0000-000000000001', 'Prompts generated', true, 1),
('b0000000-0000-0000-0000-000000000001', 'Graphics rendered in Midjourney', true, 2),
('b0000000-0000-0000-0000-000000000001', 'Video edited & exported', true, 3),
('b0000000-0000-0000-0000-000000000001', 'Published to all platforms', true, 4),

-- Horror
('b0000000-0000-0000-0000-000000000002', 'Script written & approved', true, 0),
('b0000000-0000-0000-0000-000000000002', 'Prompts generated', true, 1),
('b0000000-0000-0000-0000-000000000002', 'Graphics rendered in Midjourney', true, 2),
('b0000000-0000-0000-0000-000000000002', 'Video edited & exported', true, 3),
('b0000000-0000-0000-0000-000000000002', 'Published to all platforms', true, 4),

-- Philosophy
('b0000000-0000-0000-0000-000000000003', 'Script written & approved', true, 0),
('b0000000-0000-0000-0000-000000000003', 'Prompts generated', true, 1),
('b0000000-0000-0000-0000-000000000003', 'Graphics rendered in Midjourney', true, 2),
('b0000000-0000-0000-0000-000000000003', 'Video edited & exported', true, 3),
('b0000000-0000-0000-0000-000000000003', 'Published to all platforms', true, 4),

-- Psychology
('b0000000-0000-0000-0000-000000000004', 'Script written & approved', true, 0),
('b0000000-0000-0000-0000-000000000004', 'Prompts generated', true, 1),
('b0000000-0000-0000-0000-000000000004', 'Graphics rendered in Midjourney', true, 2),
('b0000000-0000-0000-0000-000000000004', 'Video edited & exported', true, 3),
('b0000000-0000-0000-0000-000000000004', 'Published to all platforms', true, 4),

-- True Crime
('b0000000-0000-0000-0000-000000000005', 'Script written & approved', true, 0),
('b0000000-0000-0000-0000-000000000005', 'Prompts generated', true, 1),
('b0000000-0000-0000-0000-000000000005', 'Graphics rendered in Midjourney', true, 2),
('b0000000-0000-0000-0000-000000000005', 'Video edited & exported', true, 3),
('b0000000-0000-0000-0000-000000000005', 'Published to all platforms', true, 4),

-- History
('b0000000-0000-0000-0000-000000000006', 'Script written & approved', true, 0),
('b0000000-0000-0000-0000-000000000006', 'Prompts generated', true, 1),
('b0000000-0000-0000-0000-000000000006', 'Graphics rendered in Midjourney', true, 2),
('b0000000-0000-0000-0000-000000000006', 'Video edited & exported', true, 3),
('b0000000-0000-0000-0000-000000000006', 'Published to all platforms', true, 4),

-- Science
('b0000000-0000-0000-0000-000000000007', 'Script written & approved', true, 0),
('b0000000-0000-0000-0000-000000000007', 'Prompts generated', true, 1),
('b0000000-0000-0000-0000-000000000007', 'Graphics rendered in Midjourney', true, 2),
('b0000000-0000-0000-0000-000000000007', 'Video edited & exported', true, 3),
('b0000000-0000-0000-0000-000000000007', 'Published to all platforms', true, 4),

-- Mythology
('b0000000-0000-0000-0000-000000000008', 'Script written & approved', true, 0),
('b0000000-0000-0000-0000-000000000008', 'Prompts generated', true, 1),
('b0000000-0000-0000-0000-000000000008', 'Graphics rendered in Midjourney', true, 2),
('b0000000-0000-0000-0000-000000000008', 'Video edited & exported', true, 3),
('b0000000-0000-0000-0000-000000000008', 'Published to all platforms', true, 4),

-- Self Improvement
('b0000000-0000-0000-0000-000000000009', 'Script written & approved', true, 0),
('b0000000-0000-0000-0000-000000000009', 'Prompts generated', true, 1),
('b0000000-0000-0000-0000-000000000009', 'Graphics rendered in Midjourney', true, 2),
('b0000000-0000-0000-0000-000000000009', 'Video edited & exported', true, 3),
('b0000000-0000-0000-0000-000000000009', 'Published to all platforms', true, 4),

-- Technology
('b0000000-0000-0000-0000-000000000010', 'Script written & approved', true, 0),
('b0000000-0000-0000-0000-000000000010', 'Prompts generated', true, 1),
('b0000000-0000-0000-0000-000000000010', 'Graphics rendered in Midjourney', true, 2),
('b0000000-0000-0000-0000-000000000010', 'Video edited & exported', true, 3),
('b0000000-0000-0000-0000-000000000010', 'Published to all platforms', true, 4);


-- ─────────────────────────────────────────────
-- PUBLIC SETTINGS (all public, all sections shown)
-- ─────────────────────────────────────────────
INSERT INTO public_settings (scenario_id, is_public, show_script, show_graphics, show_video, show_platform_links) VALUES
('b0000000-0000-0000-0000-000000000001', true, true, true, true, true),
('b0000000-0000-0000-0000-000000000002', true, true, true, true, true),
('b0000000-0000-0000-0000-000000000003', true, true, true, true, true),
('b0000000-0000-0000-0000-000000000004', true, true, true, true, true),
('b0000000-0000-0000-0000-000000000005', true, true, true, true, true),
('b0000000-0000-0000-0000-000000000006', true, true, true, true, true),
('b0000000-0000-0000-0000-000000000007', true, true, true, true, true),
('b0000000-0000-0000-0000-000000000008', true, true, true, true, true),
('b0000000-0000-0000-0000-000000000009', true, true, true, true, true),
('b0000000-0000-0000-0000-000000000010', true, true, true, true, true)
ON CONFLICT (scenario_id) DO NOTHING;


-- ─────────────────────────────────────────────
-- VIDEOS (platform links + performance stats)
-- ─────────────────────────────────────────────
INSERT INTO videos (scenario_id, status, duration_sec, platform_urls, performance) VALUES
('b0000000-0000-0000-0000-000000000001', 'published', 138, '{"youtube": "https://youtube.com", "tiktok": "https://tiktok.com", "instagram": "https://instagram.com"}'::jsonb, '{"views": 284000, "likes": 19400, "shares": 3200}'::jsonb),
('b0000000-0000-0000-0000-000000000002', 'published', 172, '{"youtube": "https://youtube.com", "tiktok": "https://tiktok.com", "instagram": "https://instagram.com"}'::jsonb, '{"views": 512000, "likes": 48100, "shares": 9700}'::jsonb),
('b0000000-0000-0000-0000-000000000003', 'published', 155, '{"youtube": "https://youtube.com", "tiktok": "https://tiktok.com", "instagram": "https://instagram.com"}'::jsonb, '{"views": 196000, "likes": 22300, "shares": 4100}'::jsonb),
('b0000000-0000-0000-0000-000000000004', 'published', 178, '{"youtube": "https://youtube.com", "tiktok": "https://tiktok.com", "instagram": "https://instagram.com"}'::jsonb, '{"views": 441000, "likes": 39800, "shares": 7600}'::jsonb),
('b0000000-0000-0000-0000-000000000005', 'published', 168, '{"youtube": "https://youtube.com", "tiktok": "https://tiktok.com", "instagram": "https://instagram.com"}'::jsonb, '{"views": 387000, "likes": 31200, "shares": 6800}'::jsonb),
('b0000000-0000-0000-0000-000000000006', 'published', 198, '{"youtube": "https://youtube.com", "tiktok": "https://tiktok.com", "instagram": "https://instagram.com"}'::jsonb, '{"views": 623000, "likes": 54700, "shares": 11200}'::jsonb),
('b0000000-0000-0000-0000-000000000007', 'published', 162, '{"youtube": "https://youtube.com", "tiktok": "https://tiktok.com", "instagram": "https://instagram.com"}'::jsonb, '{"views": 318000, "likes": 28900, "shares": 5400}'::jsonb),
('b0000000-0000-0000-0000-000000000008', 'published', 183, '{"youtube": "https://youtube.com", "tiktok": "https://tiktok.com", "instagram": "https://instagram.com"}'::jsonb, '{"views": 274000, "likes": 25600, "shares": 4900}'::jsonb),
('b0000000-0000-0000-0000-000000000009', 'published', 172, '{"youtube": "https://youtube.com", "tiktok": "https://tiktok.com", "instagram": "https://instagram.com"}'::jsonb, '{"views": 492000, "likes": 43100, "shares": 8300}'::jsonb),
('b0000000-0000-0000-0000-000000000010', 'published', 182, '{"youtube": "https://youtube.com", "tiktok": "https://tiktok.com", "instagram": "https://instagram.com"}'::jsonb, '{"views": 731000, "likes": 67400, "shares": 14800}'::jsonb)
ON CONFLICT (scenario_id) DO NOTHING;
