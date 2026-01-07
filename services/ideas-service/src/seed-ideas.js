const db = require('./db');

const ideas = [
  // 1. Leaf art for younger kids – sunny, simple
  {
    author_id: 1,
    title: 'Leaf Mandala Art',
    description:
      'Children collect different leaves in the schoolyard or park and create circular mandalas on large sheets of paper.',
    time_minutes: 30,
    time_label: '25–35 min',
    difficulty: 'easy',
    materials: 'Large paper, glue, tape, leaves, markers',
    subject: 'art',
    season: 'autumn',
    yard_context: 'some_green',
    instructions: [
      'Explain what a mandala is and show a simple example.',
      'Go outside and let children collect leaves in different shapes and colours.',
      'Back inside or outside on tables, draw a circle on A3 paper.',
      'Children arrange leaves from the centre outwards in patterns.',
      'Glue leaves down and let them add details with markers.',
      'End with a short gallery walk where children show their mandalas.',
    ],
    weather: 'sunny',
    min_age: 6,
    max_age: 9,
    image_url:
      'https://media.istockphoto.com/id/914559116/photo/abstract-green-background-flora-mandala-pattern-wild-climbing-vine-liana-plant-with.jpg?s=612x612&w=0&k=20&c=DBUOf42y2c22C5xE6t0-yLyU6iTOiQiI8JiOdb6z2Mg=',
    tags: ['Nature', 'Art', 'Fine Motor Skills'],
    categories: ['DIY', 'Group Project'],
  },

  // 2. Rainy indoor nature – worm detectives at the window / schoolyard
  {
    author_id: 1,
    title: 'Worm Detectives',
    description:
      'On a rainy day, children investigate worms and soil life in a small corner of the schoolyard and then sketch their findings.',
    time_minutes: 40,
    time_label: '30–45 min',
    difficulty: 'medium',
    materials: 'Plastic spoons, small containers, magnifying glasses, clipboards, paper, pencils',
    subject: 'science',
    season: 'spring',
    yard_context: 'green_blue',
    instructions: [
      'Explain that worms help keep soil healthy and ask what children already know.',
      'Take the group to a small muddy corner or patch of soil.',
      'Let pairs gently scoop some soil into containers and look for worms and other animals.',
      'Use magnifying glasses to observe movement and body parts.',
      'Go back inside and let children draw what they saw and label body parts.',
      'Discuss why worms are important for gardens and schoolyards.',
    ],
    weather: 'rainy',
    min_age: 7,
    max_age: 10,
    image_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7iDnckZTRGamWCVA1utXQHbEl-kmlSLM4KA&s',
    tags: ['Soil', 'Animals', 'Observation'],
    categories: ['Experiment', 'Outdoor Lesson'],
  },

  // 3. Tiny Forest treasure hunt – classic Dutch green schoolyard vibe
  {
    author_id: 2,
    title: 'Tiny Forest Treasure Hunt',
    description:
      'Children explore a green corner or small “tiny forest” and search for specific leaves, textures and colours using simple task cards.',
    time_minutes: 45,
    time_label: '40–50 min',
    difficulty: 'easy',
    materials: 'Printed task cards, pencils, clipboards, small bags',
    subject: 'nature',
    season: 'any',
    yard_context: 'green_blue',
    instructions: [
      'Prepare task cards with pictures or icons: “something rough”, “a heart-shaped leaf”, “something that smells nice”.',
      'Explain rules: no pulling up plants, only taking what has already fallen.',
      'Let small groups explore the green area and collect or sketch each item.',
      'Regroup and let them show their favourite find.',
      'Link each “treasure” to a short nature fact (e.g. evergreen vs. deciduous).',
    ],
    weather: 'cloudy',
    min_age: 7,
    max_age: 11,
    image_url: 'https://earthwatch.org.uk/wp-content/uploads/2023/08/Hammersmith-Park-TF.jpg',
    tags: ['Biodiversity', 'Exploration', 'Teamwork'],
    categories: ['Outdoor Lesson', 'Game'],
  },

  // 4. Polder water engineers – very NL, STEM + water management
  {
    author_id: 2,
    title: 'Polder Water Engineers',
    description:
      'Children build mini-dikes and canals in sand to experience how the Netherlands keeps feet dry and land protected from water.',
    time_minutes: 60,
    time_label: '45–60 min',
    difficulty: 'medium',
    materials: 'Sandbox or big tray with sand, bowls of water, small boards, stones, cups',
    subject: 'geography',
    season: 'spring',
    yard_context: 'green_blue',
    instructions: [
      'Show a simple map of the Netherlands with polders and dikes.',
      'Explain that children will be “water engineers” and must protect a small “village” in the sand.',
      'Let groups build sand dikes around a marked “village area”.',
      'Slowly pour water on the “sea side” and see where it leaks through.',
      'Allow groups to improve their design: higher dikes, extra canals, more curves.',
      'Reflect: which design worked best and why? Link to real Dutch water management.',
    ],
    weather: 'sunny',
    min_age: 9,
    max_age: 12,
    image_url: 'https://image.volkskrant.nl/128998556/feature-crop/1200/675/afbeelding',
    tags: ['STEM', 'Water', 'Dutch Context'],
    categories: ['Experiment', 'Group Project'],
  },

  // 5. Balcony Bird Café – great for parents at home too
  {
    author_id: 3,
    title: 'Balcony Bird Café',
    description:
      'Children and parents create a simple bird café with feeders on the balcony or in a small garden and keep a bird diary for one week.',
    time_minutes: 30,
    time_label: '20–30 min + home follow-up',
    difficulty: 'easy',
    materials:
      'Empty toilet rolls, peanut-free bird seed, string, apples, peanut-butter-free spread',
    subject: 'nature',
    season: 'winter',
    yard_context: 'no_green',
    instructions: [
      'Show pictures of common Dutch garden birds (sparrow, great tit, blackbird).',
      'Roll empty toilet rolls in a safe spread and then into bird seed.',
      'Hang the feeders on a balcony or in a tree using string.',
      'Give children a simple bird diary sheet with columns: date, time, number of birds, type (or drawing).',
      'Ask them to observe 5–10 minutes a day at home with parents.',
      'After a week, discuss: which birds did they see most often? What surprised them?',
    ],
    weather: 'cold',
    min_age: 6,
    max_age: 11,
    image_url:
      'https://i.ytimg.com/vi/B9tx_PHHIDI/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGUgXyg6MA8=&rs=AOn4CLAMYsUsoCbnnz-zFhp7qqxGcK35AQ',
    tags: ['Birds', 'Home Activity', 'Parents'],
    categories: ['DIY', 'Home Project'],
  },

  // 6. Litter Heroes – clean-up & citizenship
  {
    author_id: 1,
    title: 'Litter Heroes Around the School',
    description:
      'Children map litter hotspots around the school, pick up trash safely and discuss how to keep the area cleaner.',
    time_minutes: 50,
    time_label: '45–60 min',
    difficulty: 'medium',
    materials:
      'Gloves, trash grabbers (if available), garbage bags, printed school map, stickers or markers',
    subject: 'citizenship',
    season: 'any',
    yard_context: 'some_green',
    instructions: [
      'Discuss why litter is a problem for animals, people and water.',
      'Explain safety rules: gloves on, no sharp objects, ask an adult for dangerous items.',
      'Give each group a small section around the school and a map.',
      'Groups collect litter and mark spots with lots of trash on the map.',
      'Back in class, compare maps and identify “hotspots”.',
      'Brainstorm solutions: more bins, posters, class agreements, involving the municipality.',
    ],
    weather: 'cloudy',
    min_age: 8,
    max_age: 12,
    image_url:
      'https://www.ncw.co.uk/wp-content/uploads/2022/01/family-litter-picking-beach-dunes.jpg',
    tags: ['Sustainability', 'Citizenship', 'Teamwork'],
    categories: ['Outdoor Lesson', 'Action Project'],
  },

  // 7. Shadow Math Game – sunny, younger classes
  {
    author_id: 2,
    title: 'Shadow Math Game',
    description:
      'Children use chalk to trace their shadows and then measure and compare lengths, linking sun position to time of day.',
    time_minutes: 35,
    time_label: '30–40 min',
    difficulty: 'easy',
    materials: 'Playground chalk, tape measure or metre stick, clipboards, paper',
    subject: 'math',
    season: 'spring',
    yard_context: 'some_green',
    instructions: [
      'Go outside on a sunny day and let each child stand on a marked spot.',
      'In pairs, they trace each other’s shadow on the ground with chalk.',
      'Measure the length of the shadow and write the number near it.',
      'Compare: whose shadow is longest? Shortest?',
      'Optionally, repeat later in the day and compare how the shadow length changed.',
    ],
    weather: 'sunny',
    min_age: 7,
    max_age: 10,
    image_url: 'https://happymomhacks.com/wp-content/uploads/2020/04/shadow-tracing.jpg',
    tags: ['Math', 'Measurement', 'Sun'],
    categories: ['Outdoor Lesson', 'Game'],
  },

  // 8. Rainy Day Sound Walk – can be done in covered area or hallway
  {
    author_id: 3,
    title: 'Rainy Day Sound Walk',
    description:
      'Children listen carefully to the sounds of rain, wind, traffic and people, then create a sound map and short poem or rap.',
    time_minutes: 30,
    time_label: '25–35 min',
    difficulty: 'easy',
    materials: 'Paper, pencils, clipboards',
    subject: 'language',
    season: 'autumn',
    yard_context: 'indoor',
    instructions: [
      'Explain that they will be “sound detectives” and draw what they hear.',
      'Walk around the school building, under a roof or by open windows.',
      'Children make a simple map and use symbols to show where they hear sounds (rain, cars, doors, voices).',
      'Back in class, let them pick 3 favourite sounds and write a short poem, rap or list of phrases.',
      'Let a few children perform their sound poems for the class.',
    ],
    weather: 'rainy',
    min_age: 8,
    max_age: 11,
    image_url:
      'https://i.guim.co.uk/img/media/09da4fa03734265ebc5986dc08bdb6a5a0a6abfc/167_125_1642_985/master/1642.jpg?width=1200&quality=85&auto=format&fit=max&s=f7d60461ded4ea23b80c19c06c2afddc',
    tags: ['Listening', 'Creativity', 'Weather'],
    categories: ['Indoor Lesson', 'Creative Writing'],
  },

  // 9. Bug Hotel Builders – older kids, more tools / materials
  {
    author_id: 2,
    title: 'Build a Bug Hotel',
    description:
      'Children design and build a small bug hotel using recycled materials to attract insects to the schoolyard or garden.',
    time_minutes: 70,
    time_label: '60–75 min',
    difficulty: 'hard',
    materials:
      'Wooden crate or old box, bamboo sticks, bricks with holes, dry leaves, straw, pinecones, twine',
    subject: 'science',
    season: 'spring',
    yard_context: 'green_blue',
    instructions: [
      'Show pictures of simple bug hotels and discuss why insects need hiding places.',
      'In groups, sketch a small design for their hotel.',
      'Gather safe recycled materials and sort them by size and function.',
      'Fill the crate with different “rooms”: bamboo for bees, leaves for beetles, straw for other insects.',
      'Place the bug hotel in a quiet, sheltered spot.',
      'Plan follow-up visits where children record which animals they see.',
    ],
    weather: 'sunny',
    min_age: 9,
    max_age: 12,
    image_url:
      'https://brigitsgarden.ie/wp-content/uploads/2022/02/Cropped_Bug_Hotel_Final_Product-e1652788335631.jpg',
    tags: ['Insects', 'Recycled', 'STEM'],
    categories: ['DIY', 'Group Project'],
  },

  // 10. Weather Diary at Home – parents + kids, minimal tools
  {
    author_id: 3,
    title: 'One-Week Weather Diary',
    description:
      'Children keep a simple weather diary at home with parents, noting temperature, sky type and how it feels outside.',
    time_minutes: 20,
    time_label: '10–20 min per day',
    difficulty: 'easy',
    materials: 'Printed diary template or notebook, pencils, optional thermometer',
    subject: 'science',
    season: 'any',
    yard_context: 'no_green',
    instructions: [
      'Give each child a weather diary sheet with columns: date, time, sky, temperature (if possible), feeling (cold/warm).',
      'Explain weather words together: sunny, cloudy, rainy, windy, cold.',
      'Ask them to fill it in together with a parent or older sibling once a day for a week.',
      'After a week, discuss patterns in class: which day was windiest, rainiest, sunniest?',
      'Optional: draw a simple class bar chart of “sunny vs rainy” days.',
    ],
    weather: 'any',
    min_age: 7,
    max_age: 11,
    image_url:
      'https://img.freepik.com/free-photo/cute-girl-drawing-paper-bed_23-2148070466.jpg?semt=ais_hybrid&w=740&q=80',
    tags: ['Weather', 'Home Activity', 'Data'],
    categories: ['Home Project', 'Observation'],
  },

  // 11. Recycled Robot Competition – big creative project
  {
    author_id: 1,
    title: 'Recycled Robot Challenge',
    description:
      'Teams design and build robots from clean recycled materials and present their robot’s “superpower” to the class.',
    time_minutes: 80,
    time_label: '60–90 min',
    difficulty: 'medium',
    materials:
      'Clean cardboard boxes, bottles, caps, tape, scissors, markers, aluminium foil, string, glue',
    subject: 'design',
    season: 'any',
    yard_context: 'indoor',
    instructions: [
      'Explain the challenge: build a robot that solves a problem (cleaning plastic, saving energy, helping animals).',
      'Show examples of simple recycled robots for inspiration.',
      'Let teams plan a quick sketch of their robot and list needed materials.',
      'Give them time to build and decorate the robot.',
      'Each team presents: name, superpower and how it helps people or nature.',
      'Optional: let the class vote on “Most Creative”, “Most Useful”, “Most Funny” robot.',
    ],
    weather: 'any',
    min_age: 9,
    max_age: 12,
    image_url:
      'https://cdn.shopify.com/s/files/1/0857/2946/files/playful.childhood_robot_10_1024x1024.jpg?v=1720419481',
    tags: ['Recycled', 'Creativity', 'Teamwork'],
    categories: ['Competition', 'Group Project'],
  },

  // 12. Mindful Tree Time – calm outdoor exercise
  {
    author_id: 2,
    title: 'Mindful Tree Time',
    description:
      'Children choose a tree in or near the schoolyard, observe it quietly for a few minutes and write or draw what they notice and feel.',
    time_minutes: 25,
    time_label: '20–30 min',
    difficulty: 'easy',
    materials: 'Clipboards, paper, pencils, optional blankets',
    subject: 'wellbeing',
    season: 'summer',
    yard_context: 'some_green',
    instructions: [
      'Ask each child to pick a tree or bush and sit nearby, without talking.',
      'Guide them with quiet prompts: “What colours do you see?”, “What do you hear?”, “What do you feel in your body?”.',
      'After 5–10 minutes, let them write words or draw what they noticed.',
      'In a circle, invite volunteers to share one sentence or drawing.',
      'Discuss how being outside and quiet made them feel.',
    ],
    weather: 'sunny',
    min_age: 8,
    max_age: 12,
    image_url:
      'https://d2gesac5hma2c2.cloudfront.net/uploads/production/picture/image/31615/cropped_landscape_lg_600_tree3.jpg',
    tags: ['Mindfulness', 'Nature', 'Wellbeing'],
    categories: ['Outdoor Lesson', 'Reflection'],
  },
];

// Some sample comments + ratings (assumes users 1, 2, 3 exist in auth_db)
const comments = [
  {
    ideaIndex: 0, // Leaf Mandala Art
    user_id: 1,
    text: 'My group loved collecting leaves; great starter activity.',
    rating: 5,
  },
  {
    ideaIndex: 3, // Polder Water Engineers
    user_id: 2,
    text: 'Very nice link to Dutch geography, but it needs enough time.',
    rating: 4,
  },
  {
    ideaIndex: 5, // Litter Heroes
    user_id: 3,
    text: 'The kids were shocked by how much trash they found near school.',
    rating: 5,
  },
  {
    ideaIndex: 10, // Recycled Robot Challenge
    user_id: 1,
    text: 'Worked well as a long Friday afternoon project.',
    rating: 4,
  },
];

// Sample favourites
const favorites = [
  { user_id: 1, ideaIndex: 0 },
  { user_id: 1, ideaIndex: 3 },
  { user_id: 1, ideaIndex: 8 },
  { user_id: 2, ideaIndex: 5 },
  { user_id: 2, ideaIndex: 10 },
  { user_id: 3, ideaIndex: 1 },
];

async function seedIdeas() {
  try {
    console.log('🌱 Seeding ideas_db...');

    // 1) Clean tables so the seeder is rerunnable
    await db.query('SET FOREIGN_KEY_CHECKS=0');
    await db.query('TRUNCATE TABLE idea_comments');
    await db.query('TRUNCATE TABLE idea_tags');
    await db.query('TRUNCATE TABLE idea_categories');
    await db.query('TRUNCATE TABLE idea_favorites');
    await db.query('TRUNCATE TABLE ideas');
    await db.query('SET FOREIGN_KEY_CHECKS=1');

    const ideaIds = [];

    // 2) Insert ideas
    for (const idea of ideas) {
      const instructionsJson = JSON.stringify(idea.instructions || []);

      const [result] = await db.query(
        `INSERT INTO ideas (
          author_id,
          title,
          description,
          time_minutes,
          time_label,
          difficulty,
          materials,
          subject,
          season,
          yard_context,
          instructions_json,
          weather,
          min_age,
          max_age,
          image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idea.author_id,
          idea.title,
          idea.description,
          idea.time_minutes,
          idea.time_label,
          idea.difficulty,
          idea.materials,
          idea.subject,
          idea.season,
          idea.yard_context,
          instructionsJson,
          idea.weather,
          idea.min_age,
          idea.max_age,
          idea.image_url,
        ],
      );

      const ideaId = result.insertId;
      ideaIds.push(ideaId);

      // Tags
      for (const tag of idea.tags || []) {
        await db.query('INSERT INTO idea_tags (idea_id, tag) VALUES (?, ?)', [ideaId, tag]);
      }

      // Categories
      for (const category of idea.categories || []) {
        await db.query('INSERT INTO idea_categories (idea_id, category) VALUES (?, ?)', [
          ideaId,
          category,
        ]);
      }
    }

    // 3) Insert comments
    for (const c of comments) {
      const ideaId = ideaIds[c.ideaIndex];
      if (!ideaId) continue;

      await db.query(
        'INSERT INTO idea_comments (idea_id, user_id, text, rating) VALUES (?, ?, ?, ?)',
        [ideaId, c.user_id, c.text, c.rating],
      );
    }

    // 4) Insert favourites
    for (const f of favorites) {
      const ideaId = ideaIds[f.ideaIndex];
      if (!ideaId) continue;

      await db.query('INSERT IGNORE INTO idea_favorites (user_id, idea_id) VALUES (?, ?)', [
        f.user_id,
        ideaId,
      ]);
    }

    console.log('✅ ideas_db seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding ideas_db:', err);
  } finally {
    await db.end();
  }
}

seedIdeas();
