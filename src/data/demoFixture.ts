// Pre-generated sample course served on the anonymous /demo/:sessionId route.
// Static — no AI call at demo time, no API cost per visitor. Localised copy
// stays in public/locales/*.json under 'demo.*'; the fixture only carries
// structural data + representative excerpts.

export interface DemoLesson {
  id: string;
  title: string;
  duration_minutes: number;
  learning_objective: string;
  key_takeaways: string[];
  excerpt: string;
}

export interface DemoModule {
  id: string;
  index: string;      // "01", "02", ...
  title: string;
  learning_objective: string;
  duration: string;
  lessons: DemoLesson[];
}

export interface DemoDeliverable {
  slug: 'trainer_guide' | 'participant_manual' | 'slide_deck' | 'exercises' | 'trainer_flow';
  title: string;
  description: string;
  excerpt: string;
}

export interface DemoCourse {
  title: string;
  subject: string;
  audience: string;
  level: string;
  duration: string;
  tone: string;
  environment: string;
  learning_outcome: string;
  modules: DemoModule[];
  deliverables: DemoDeliverable[];
}

export const DEMO_COURSE: DemoCourse = {
  title: 'Difficult Conversations for Middle Managers',
  subject: 'Interpersonal leadership',
  audience: 'First-time managers, 6–24 months in role',
  level: 'Intermediate',
  duration: 'Half-day (4h)',
  tone: 'Direct, warm, low-jargon',
  environment: 'In-person workshop, up to 16 participants',
  learning_outcome:
    'By the end of the session, participants can plan and open a difficult conversation with a direct report using a four-step frame, and can recover from three common derailments.',
  modules: [
    {
      id: 'm1',
      index: '01',
      title: 'Why we avoid the conversation we know we owe',
      learning_objective:
        'Name the three costs of avoidance and describe one conversation the participant is currently avoiding.',
      duration: '45m',
      lessons: [
        {
          id: 'm1l1',
          title: 'The three costs of postponement',
          duration_minutes: 15,
          learning_objective: 'List the personal, team, and organisational costs of a postponed conversation.',
          key_takeaways: [
            'The cost of postponement compounds — it does not stay the same.',
            'People read silence as endorsement.',
            'The person you are avoiding usually knows.',
          ],
          excerpt:
            "Most conversations you're avoiding aren't unclear — they're clear and uncomfortable. The frame here is not communication skill, it's the will to spend three minutes of adrenaline to save three months of drift.",
        },
        {
          id: 'm1l2',
          title: 'Small exercise: your one conversation',
          duration_minutes: 15,
          learning_objective: 'Identify one specific conversation the participant is postponing, with the person and the topic named on paper.',
          key_takeaways: [
            'Write the person\'s name. Not the role.',
            'Write the topic in one sentence, verb first.',
            'Write what you fear will happen if you open it.',
          ],
          excerpt:
            'Take the card. Do not share it with anyone in the room. Fold it, put it in your pocket. By the end of the day we will unfold it.',
        },
        {
          id: 'm1l3',
          title: 'Debrief',
          duration_minutes: 15,
          learning_objective: 'Reframe the fear identified in the exercise as data about the conversation to be had.',
          key_takeaways: [
            'Fear is a pointer, not a stop sign.',
            'The story you tell yourself is not the story.',
            'Precision reduces adrenaline more than rehearsal does.',
          ],
          excerpt:
            'Notice how nearly every fear on your card is a story about how the OTHER person will react. That is your first instrument — because the story is guessable, and if it is guessable, it is testable.',
        },
      ],
    },
    {
      id: 'm2',
      index: '02',
      title: 'The four-step frame',
      learning_objective:
        'Draft the opening of one difficult conversation using the Fact → Impact → Question → Silence frame.',
      duration: '75m',
      lessons: [
        {
          id: 'm2l1',
          title: 'Fact — the sentence they cannot argue with',
          duration_minutes: 20,
          learning_objective: 'Compose an opening sentence that names an observable behaviour, not a character.',
          key_takeaways: [
            '"Yesterday at 3pm you sent the reply-all" — fact.',
            '"You are careless" — character.',
            'Fact you can point at. Character you have to defend.',
          ],
          excerpt:
            "Every conversation that goes off the rails goes off in the first sentence. The first sentence is not your opinion — it is a fact you both saw. If they can dispute it, you have the wrong sentence.",
        },
        {
          id: 'm2l2',
          title: 'Impact — the missing half',
          duration_minutes: 20,
          learning_objective: 'Attach a specific impact to the fact using the "what this means for us" pattern.',
          key_takeaways: [
            'Impact is what the fact costs — money, trust, time, morale.',
            'Impact grounds the conversation in shared consequence.',
            'Without impact, the fact reads as nitpicking.',
          ],
          excerpt:
            'Fact and impact together turn "you sent the reply-all" into "you sent the reply-all, and the client asked me whether we have a process for this."',
        },
        {
          id: 'm2l3',
          title: 'Question — hand them the pen',
          duration_minutes: 20,
          learning_objective: 'End the opening with a question that returns agency to the other person.',
          key_takeaways: [
            'Ask, do not tell.',
            'The question is an invitation, not a trap.',
            'Best question: "What do you see?"',
          ],
          excerpt:
            'You have named a fact and its impact. You have not yet said what should happen. You are about to. Do not. Ask. Silence next.',
        },
        {
          id: 'm2l4',
          title: 'Silence — the hardest step',
          duration_minutes: 15,
          learning_objective: 'Hold silence for at least seven seconds after asking the question.',
          key_takeaways: [
            'Seven seconds feels like forty.',
            'Whoever breaks silence first surrenders the frame.',
            'Silence is where the actual answer lives.',
          ],
          excerpt:
            'This is the step you will fail on. You will fill the silence with a suggestion, a softener, a joke. Do not. Count. If you feel it, sip water.',
        },
      ],
    },
    {
      id: 'm3',
      index: '03',
      title: 'Recovering from the three most common derailments',
      learning_objective:
        'Identify tears, anger, and deflection as predictable derailments and respond to each with a rehearsed line.',
      duration: '60m',
      lessons: [
        {
          id: 'm3l1',
          title: 'When they cry',
          duration_minutes: 20,
          learning_objective: 'Respond to tears without collapsing the conversation or dismissing the emotion.',
          key_takeaways: [
            'Tears are not a stop signal.',
            'Offer water, hold silence, do not apologise for the fact.',
            'Resume only when they signal readiness.',
          ],
          excerpt:
            "Line to rehearse: 'Take the time you need. The conversation is important; we can pause but not skip it.'",
        },
        {
          id: 'm3l2',
          title: 'When they get angry',
          duration_minutes: 20,
          learning_objective: 'Absorb anger without matching it or backing down from the fact.',
          key_takeaways: [
            'Match volume and you lose the frame.',
            'Name the emotion, hold the fact.',
            'One breath before every reply.',
          ],
          excerpt:
            "Line to rehearse: 'I can see this lands hard. I am not questioning your intent — I am telling you what happened and what it cost.'",
        },
        {
          id: 'm3l3',
          title: 'When they deflect',
          duration_minutes: 20,
          learning_objective: 'Recognise the four common deflection patterns and return the conversation to the topic.',
          key_takeaways: [
            'Deflection is polite avoidance.',
            'Return, do not confront the deflection.',
            'Line: "Let us come back to that. First —"',
          ],
          excerpt:
            "Deflections read as: 'yes but also...', 'the real problem is...', 'to be fair, everyone...', or the classic 'I hear you.' You: 'Let us come back to that. First — what do you see?'",
        },
      ],
    },
  ],
  deliverables: [
    {
      slug: 'trainer_guide',
      title: 'Trainer Guide',
      description: 'Verbatim scripts for every module, timing markers, transitions between sections.',
      excerpt:
        "→ 10:00 (5m) — Open module 2. Whiteboard the four steps as headers only. Do not fill them yet.\n→ 10:05 (15m) — Lesson 1: the sentence they cannot argue with. Read the two example openings on p.7. Ask, hand up:\n   'Which one names the person, and which one names the behaviour?'",
    },
    {
      slug: 'participant_manual',
      title: 'Participant Manual',
      description: 'Theory, worked examples, reflection prompts, and workspace for the day.',
      excerpt:
        "MODULE 2 — Draft your opening sentence.\n\nThink of the conversation you wrote on your card in module 1.\n\nFact: __________________________________________\nImpact: ________________________________________\nQuestion: ______________________________________\n\nThen hold your seven seconds.",
    },
    {
      slug: 'slide_deck',
      title: 'Slide Deck',
      description: 'One editable file. Layered. Speaker notes embedded on every slide.',
      excerpt:
        "SLIDE 12 · SPLIT-LEFT · Titled 'Fact vs character'\n\nLeft column   Right column\n-----------   -----------\nYesterday     You are\nat 3pm you    careless.\nsent the\nreply-all.\n\nSpeaker notes: 'Give the room twenty seconds. Ask which sentence they would rather receive as a report.'",
    },
    {
      slug: 'exercises',
      title: 'Exercise Sheets',
      description: 'Scenario-based, self-contained, debrief questions on the back of every card.',
      excerpt:
        "EXERCISE 3 · Fifteen minutes · Pairs.\n\nScenario: A team member has been rewriting the meeting notes to remove their own action items. You have observed this three times. Draft the four-step opening you would use in a private one-to-one.\n\nDebrief on the back.",
    },
    {
      slug: 'trainer_flow',
      title: 'Trainer Flow',
      description: 'The choreography of the day — where you stand, when you sit, when to break.',
      excerpt:
        "13:15 · Return from lunch. Stand behind the flipchart, not at the door.\n13:20 · Recap the four-step frame from memory. Do NOT open the deck.\n13:25 · Cold call: one participant demonstrates their opening. You take the seat of the direct report.\n13:35 · Break — quiet music, do not chase conversations.",
    },
  ],
};
