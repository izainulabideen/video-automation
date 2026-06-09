export interface StoryTemplate {
  id: string
  label: string
  title: string
  hook: string
  audience: string
  emotion: string
  palette: string
  niche: string
}

export const BRAND_TEMPLATES: Record<string, StoryTemplate[]> = {
  finance: [
    {
      id: 'fin_01', label: 'Wealth Trap',
      title: 'The Hidden Tax Trap That Costs Earners $30K a Year',
      hook: 'Most people earning over $100K are silently losing a third of it to a tax trap no one warned them about.',
      audience: 'High earners 28–45', emotion: 'Urgency, fear of loss',
      palette: 'midnight_gold', niche: 'tax_strategy',
    },
    {
      id: 'fin_02', label: 'Elite Secret',
      title: 'How the Ultra-Rich Pay 0% Tax (Legally)',
      hook: 'There\'s a legal strategy billionaires use that the IRS doesn\'t want you to know — hiding in plain sight.',
      audience: 'Ambitious professionals 25–40', emotion: 'Intrigue, empowerment',
      palette: 'midnight_gold', niche: 'wealth_secrets',
    },
    {
      id: 'fin_03', label: 'Debt Spiral',
      title: 'The Credit Card Trap That\'s Destroying the Middle Class',
      hook: 'Banks designed credit cards to keep you poor. Here\'s exactly how the math works against you.',
      audience: 'Middle-income earners 22–38', emotion: 'Anger, awakening',
      palette: 'warm_amber', niche: 'money_psychology',
    },
    {
      id: 'fin_04', label: 'Real Estate',
      title: 'Why 90% of Real Estate Investors Fail in Year 3',
      hook: 'The real estate crash doesn\'t happen at the market — it happens at the investor\'s bank statement.',
      audience: 'Aspiring real estate investors 28–45', emotion: 'Caution, wisdom',
      palette: 'cream_forest', niche: 'real_estate',
    },
    {
      id: 'fin_05', label: 'Stock Mistake',
      title: 'The One Investing Mistake That Wipes Out 10 Years of Gains',
      hook: 'A single emotionally-driven sell-off can undo a decade of compound growth in 48 hours.',
      audience: 'Retail investors 25–45', emotion: 'Fear, regret prevention',
      palette: 'steel_blue', niche: 'investing',
    },
  ],

  horror: [
    {
      id: 'hor_01', label: 'Haunted Place',
      title: 'The Hotel Where Guests Never Check Out',
      hook: 'Room 322 has been reserved since 1987. By a guest who died that night.',
      audience: 'Horror fans 18–35', emotion: 'Dread, curiosity',
      palette: 'blood_night', niche: 'other',
    },
    {
      id: 'hor_02', label: 'Psychological',
      title: 'The Man Who Lived Inside His Own Nightmare',
      hook: 'He couldn\'t tell if he was dreaming. Neither could his doctors.',
      audience: 'Thriller lovers 20–40', emotion: 'Unease, paranoia',
      palette: 'void_purple', niche: 'other',
    },
    {
      id: 'hor_03', label: 'Vanishing',
      title: 'The Village That Disappeared from Every Map',
      hook: 'Three hundred people, gone overnight. The government still denies it happened.',
      audience: 'Mystery & horror fans 18–40', emotion: 'Suspense, paranoia',
      palette: 'crimson_dusk', niche: 'other',
    },
    {
      id: 'hor_04', label: 'Body Horror',
      title: 'The Experiment That Turned Scientists into Monsters',
      hook: 'They were trying to cure disease. Instead, they created something that couldn\'t be uncured.',
      audience: 'Sci-fi horror fans 22–38', emotion: 'Revulsion, fascination',
      palette: 'toxic_green', niche: 'other',
    },
  ],

  philosophy: [
    {
      id: 'phi_01', label: 'Stoic Wisdom',
      title: 'Marcus Aurelius\' Secret for Enduring Unbearable Pain',
      hook: 'The most powerful emperor in history had one rule that kept him sane in chaos. Most learn it too late.',
      audience: 'Intellectuals 25–45', emotion: 'Calm clarity, wisdom',
      palette: 'deep_marble', niche: 'other',
    },
    {
      id: 'phi_02', label: 'Existential',
      title: 'Nietzsche\'s Warning About the Life You\'re Sleepwalking Through',
      hook: 'He said most people are already dead — they just haven\'t stopped moving yet.',
      audience: 'Thinkers 22–40', emotion: 'Unsettled awakening',
      palette: 'ink_night', niche: 'other',
    },
    {
      id: 'phi_03', label: 'Ethics Dilemma',
      title: 'The Trolley Problem Has a Real Answer — and It\'s Disturbing',
      hook: 'Every version of the trolley problem leads to the same conclusion about human nature.',
      audience: 'Philosophy students 20–45', emotion: 'Moral discomfort, intrigue',
      palette: 'cobalt_parch', niche: 'other',
    },
    {
      id: 'phi_04', label: 'Plato\'s Cave',
      title: 'Plato\'s Cave Is Still the Best Explanation of Modern Media',
      hook: 'We\'re all prisoners watching shadows on a wall. The only question is: who\'s projecting them?',
      audience: 'Critical thinkers 25–45', emotion: 'Clarity, urgency',
      palette: 'ivory_ink', niche: 'other',
    },
  ],

  psychology: [
    {
      id: 'psy_01', label: 'Cognitive Bias',
      title: 'The Cognitive Bias That Makes You Terrible at Risk',
      hook: 'Your brain systematically lies to you about danger — and evolution designed it that way.',
      audience: 'Curious professionals 25–45', emotion: 'Revelation, self-awareness',
      palette: 'mind_violet', niche: 'money_psychology',
    },
    {
      id: 'psy_02', label: 'Trauma Science',
      title: 'How Childhood Trauma Rewires the Adult Brain',
      hook: 'The stress you felt at age 7 is still running programs in your nervous system right now.',
      audience: 'Adults seeking healing 25–50', emotion: 'Empathy, hope',
      palette: 'warm_coral', niche: 'other',
    },
    {
      id: 'psy_03', label: 'Dark Psych',
      title: 'The 3 Manipulation Tactics Used by Every Narcissist',
      hook: 'They\'re not unique. They\'re running a playbook. Once you see it, you can\'t unsee it.',
      audience: 'Survivors, cautious daters 22–45', emotion: 'Recognition, protection',
      palette: 'dark_neuron', niche: 'other',
    },
    {
      id: 'psy_04', label: 'Neuroplasticity',
      title: 'Your Brain Can Rebuild Itself — But Most People Miss the Window',
      hook: 'Scientists proved the brain can change at any age. So why do most habits never stick?',
      audience: 'Self-improvers 22–45', emotion: 'Hope, urgency',
      palette: 'forest_calm', niche: 'other',
    },
  ],

  'true-crime': [
    {
      id: 'tc_01', label: 'Cold Case',
      title: 'The Murder That Baffled Police for 40 Years — Solved by a Gardener',
      hook: 'DNA was cracked. A detective obsessed. But it was a retired gardener who found the truth.',
      audience: 'True crime fans 22–50', emotion: 'Suspense, justice',
      palette: 'case_file', niche: 'other',
    },
    {
      id: 'tc_02', label: 'Serial Killer',
      title: 'The Killer Who Lived Next Door to 11 Victims Without Anyone Noticing',
      hook: 'His neighbors called him "the friendly one." Police had visited his house three times before.',
      audience: 'True crime enthusiasts 20–45', emotion: 'Horror, disbelief',
      palette: 'red_thread', niche: 'other',
    },
    {
      id: 'tc_03', label: 'Heist',
      title: 'The Bank Robbery That Made the FBI Look Stupid',
      hook: 'They stole $40 million and walked out the front door. Every security measure bypassed with a $20 solution.',
      audience: 'Action, crime fans 22–45', emotion: 'Amusement, awe',
      palette: 'interrogation', niche: 'other',
    },
    {
      id: 'tc_04', label: 'Wrongful',
      title: 'He Served 27 Years for a Crime DNA Proved He Didn\'t Commit',
      hook: 'The evidence was there from day one. Three judges ignored it. One intern finally found it.',
      audience: 'Justice-focused viewers 25–55', emotion: 'Outrage, relief',
      palette: 'newspaper', niche: 'other',
    },
  ],

  history: [
    {
      id: 'his_01', label: 'Empire Fall',
      title: 'The Day Rome Fell — And Why Nobody Noticed for 200 Years',
      hook: 'The greatest empire in history didn\'t collapse with a bang. It dissolved slowly while everyone looked away.',
      audience: 'History enthusiasts 25–55', emotion: 'Awe, perspective',
      palette: 'empire_crimson', niche: 'other',
    },
    {
      id: 'his_02', label: 'Hidden Hero',
      title: 'The Woman Who Saved 2,500 Children from the Nazis — Never Credited',
      hook: 'She buried the names in a jar beneath an apple tree. The world forgot her for 50 years.',
      audience: 'History fans 25–60', emotion: 'Inspiration, injustice',
      palette: 'aged_parchment', niche: 'other',
    },
    {
      id: 'his_03', label: 'Discovery',
      title: 'The Accidental Discovery That Changed Human History Overnight',
      hook: 'A farmer hit a rock in his field. What he found had been buried for 3,200 years.',
      audience: 'Curious minds 20–50', emotion: 'Wonder, excitement',
      palette: 'aged_parchment', niche: 'other',
    },
    {
      id: 'his_04', label: 'War Secret',
      title: 'The Secret Operation That Shortened WWII by Two Years',
      hook: 'It was so classified, the men who ran it couldn\'t tell their families. Even after they died.',
      audience: 'WWII history fans 28–65', emotion: 'Tension, pride',
      palette: 'colonial_navy', niche: 'other',
    },
  ],

  science: [
    {
      id: 'sci_01', label: 'Space Reveal',
      title: 'The Discovery That Proved We\'re Not Alone in the Universe',
      hook: 'NASA found something in the data they couldn\'t explain. They\'ve been quiet about it ever since.',
      audience: 'Space enthusiasts 18–45', emotion: 'Wonder, disbelief',
      palette: 'cosmic_dark', niche: 'other',
    },
    {
      id: 'sci_02', label: 'Anti-Aging',
      title: 'The Gene That Switches Off Aging — And How Close We Are',
      hook: 'Scientists turned it off in mice and they lived twice as long. Human trials just started.',
      audience: 'Science fans, biohackers 25–50', emotion: 'Hope, excitement',
      palette: 'neon_circuit', niche: 'other',
    },
    {
      id: 'sci_03', label: 'Quantum',
      title: 'Quantum Entanglement Proved Reality Is Not What You Think',
      hook: 'Two particles, separated by a trillion miles, reacting instantly. Einstein called it impossible.',
      audience: 'Physics fans 22–50', emotion: 'Mind-blown, curious',
      palette: 'spectrum', niche: 'other',
    },
    {
      id: 'sci_04', label: 'Climate',
      title: 'The Ocean Collapse Nobody Is Talking About',
      hook: 'The deep-ocean circulation that regulates all of Earth\'s weather is slowing down. Fast.',
      audience: 'Environmentally aware 22–50', emotion: 'Alarm, urgency',
      palette: 'ocean_deep', niche: 'other',
    },
  ],

  mythology: [
    {
      id: 'myth_01', label: 'Greek Epic',
      title: 'The God Zeus Was So Terrified Of, He Tried to Eat His Own Children',
      hook: 'A prophecy said his child would overthrow him. So he swallowed them whole. It still didn\'t work.',
      audience: 'Mythology fans 18–45', emotion: 'Drama, dark humor',
      palette: 'golden_realm', niche: 'other',
    },
    {
      id: 'myth_02', label: 'Norse Doom',
      title: 'Ragnarök: The End of Everything the Norse Gods Accepted',
      hook: 'They knew exactly when the world would end. The gods prepared for centuries. It still destroyed them.',
      audience: 'Norse mythology fans 20–45', emotion: 'Epic doom, courage',
      palette: 'golden_realm', niche: 'other',
    },
    {
      id: 'myth_03', label: 'Egyptian',
      title: 'The Secret Ritual That Turned Pharaohs into Gods',
      hook: 'The Egyptians didn\'t worship pharaohs as gods. They performed a ritual to actually make them one.',
      audience: 'Ancient history fans 22–50', emotion: 'Mystique, reverence',
      palette: 'lapis_sacred', niche: 'other',
    },
    {
      id: 'myth_04', label: 'Aztec Blood',
      title: 'The Blood Price: Why the Aztecs Sacrificed 20,000 People in One Day',
      hook: 'They believed the sun would die without it. And they were willing to pay any cost to keep it alive.',
      audience: 'Mythology, history fans 20–45', emotion: 'Horror, cultural fascination',
      palette: 'blood_sacrifice', niche: 'other',
    },
  ],

  'self-improvement': [
    {
      id: 'si_01', label: 'Morning Ritual',
      title: 'The 5 AM Habit That Made These CEOs Unreachable',
      hook: 'It\'s not about waking up early. It\'s about what happens in the first 90 minutes nobody interrupts.',
      audience: 'Ambitious professionals 22–45', emotion: 'Aspiration, motivation',
      palette: 'sunrise_grow', niche: 'other',
    },
    {
      id: 'si_02', label: 'Discipline',
      title: 'Why Most People Quit on Day 4 (And How to Be in the 3%)',
      hook: 'It\'s not willpower. Science found the exact mechanism that breaks discipline — and how to shut it down.',
      audience: 'People building habits 20–40', emotion: 'Challenge, empowerment',
      palette: 'slate_focus', niche: 'other',
    },
    {
      id: 'si_03', label: 'Focus Thief',
      title: 'The Attention Thief That Steals 40% of Your Peak Cognitive Hours',
      hook: 'It\'s not your phone. It\'s the thing you do before you pick up your phone.',
      audience: 'Knowledge workers 25–45', emotion: 'Revelation, urgency',
      palette: 'sky_clarity', niche: 'other',
    },
    {
      id: 'si_04', label: 'Millionaire Mindset',
      title: 'The One Belief That Separates Millionaires from Everyone Else',
      hook: 'It\'s not intelligence. It\'s not luck. Researchers tracked 3,000 people over 20 years and found one thing.',
      audience: 'Ambitious earners 22–45', emotion: 'Hope, conviction',
      palette: 'warm_bronze', niche: 'other',
    },
  ],

  technology: [
    {
      id: 'tech_01', label: 'Hidden AI',
      title: 'The AI Tool That Outperformed Every Human Expert — Nobody Knows It Exists',
      hook: 'It\'s not ChatGPT. It\'s not Gemini. The company that built it has no interest in you knowing.',
      audience: 'Tech-savvy professionals 22–45', emotion: 'Intrigue, urgency',
      palette: 'cyber_blue', niche: 'tech_careers',
    },
    {
      id: 'tech_02', label: 'Cyberattack',
      title: 'The Cyber Attack That Brought Down a Country\'s Power Grid in 6 Minutes',
      hook: 'It wasn\'t a missile. It wasn\'t a bomb. It was 40 lines of code from a hotel room in Moscow.',
      audience: 'Cybersecurity fans 20–45', emotion: 'Fear, fascination',
      palette: 'matrix_dark', niche: 'tech_careers',
    },
    {
      id: 'tech_03', label: 'Startup Win',
      title: 'The $0 Startup That Beat a Billion-Dollar Company at Their Own Game',
      hook: 'No funding. No team. One developer and a GitHub repo. They became the standard in 11 months.',
      audience: 'Builders, entrepreneurs 22–40', emotion: 'Inspiration, excitement',
      palette: 'terminal', niche: 'tech_careers',
    },
    {
      id: 'tech_04', label: 'Crypto Heist',
      title: 'The Crypto Heist That Exposed the Biggest Lie in Blockchain',
      hook: 'They said it was unhackable. They said the code was law. Then $600M disappeared in 13 seconds.',
      audience: 'Crypto, Web3 curious 22–40', emotion: 'Shock, skepticism',
      palette: 'neon_purple', niche: 'tech_careers',
    },
  ],
}
