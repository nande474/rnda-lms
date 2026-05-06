import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@rnda.org.za" },
    update: {},
    create: {
      name: "RNDA Admin",
      email: "admin@rnda.org.za",
      role: "ADMIN",
    },
  });

  // Create teachers
  const mathTeacher = await prisma.user.upsert({
    where: { email: "math@rnda.org.za" },
    update: {},
    create: { name: "Ms. Khumalo", email: "math@rnda.org.za", role: "TEACHER" },
  });

  const scienceTeacher = await prisma.user.upsert({
    where: { email: "science@rnda.org.za" },
    update: {},
    create: { name: "Mr. Dlamini", email: "science@rnda.org.za", role: "TEACHER" },
  });

  const techTeacher = await prisma.user.upsert({
    where: { email: "tech@rnda.org.za" },
    update: {},
    create: { name: "Ms. Nkosi", email: "tech@rnda.org.za", role: "TEACHER" },
  });

  const coursesData = [
    // Grade 5
    {
      title: "Introduction to Numbers and Operations",
      description: "Build a solid foundation in whole numbers, fractions, and basic operations.",
      subject: "MATHEMATICS",
      grade: 5,
      teacherId: mathTeacher.id,
      published: true,
      lessons: [
        { title: "Understanding Whole Numbers", content: "Whole numbers are the counting numbers starting from 0: 0, 1, 2, 3...\n\nIn this lesson we explore:\n- Place value (ones, tens, hundreds, thousands)\n- Reading and writing large numbers\n- Comparing and ordering numbers\n\nActivity: Write the number 4,372 in words and identify the place value of each digit.", duration: 30 },
        { title: "Addition and Subtraction", content: "Addition combines two or more numbers to find the total.\nSubtraction finds the difference between numbers.\n\nKey strategies:\n- Column method for large numbers\n- Estimation before calculating\n- Checking answers by reversing the operation\n\nPractice: Calculate 5,847 + 3,264 and 9,000 - 4,356.", duration: 35 },
        { title: "Introduction to Fractions", content: "A fraction represents a part of a whole.\n\nParts of a fraction:\n- Numerator: the top number (how many parts we have)\n- Denominator: the bottom number (total equal parts)\n\nExample: 3/4 means 3 out of 4 equal parts.\n\nActivity: Shade 2/3 of a shape and write the fraction for shaded portions.", duration: 40 },
      ],
    },
    {
      title: "Basic Life Science: Plants and Animals",
      description: "Discover the living world — from plant cells to animal adaptations.",
      subject: "LIFE_SCIENCE",
      grade: 5,
      teacherId: scienceTeacher.id,
      published: true,
      lessons: [
        { title: "What Makes Something Alive?", content: "Living things share common characteristics:\n1. They grow and develop\n2. They reproduce\n3. They respond to their environment\n4. They need food, water, and air\n5. They are made of cells\n\nNon-living things (rocks, water) do not have all these characteristics.\n\nDiscussion: Can you think of 5 living and 5 non-living things around you?", duration: 25 },
        { title: "Plant Parts and Their Functions", content: "Every plant has key parts with specific jobs:\n\n🌱 ROOTS: Absorb water and minerals from soil; anchor the plant\n🌿 STEM: Transports water and nutrients; supports the plant\n🍃 LEAVES: Make food using sunlight (photosynthesis)\n🌸 FLOWERS: Reproduction — attract pollinators\n🍎 FRUITS/SEEDS: Protect and spread seeds\n\nExperiment: Place a white flower in colored water and observe what happens after 24 hours.", duration: 30 },
        { title: "Animal Adaptations", content: "Adaptations are special features that help animals survive in their environment.\n\nExamples:\n- A camel's hump stores fat (not water) for energy in the desert\n- A fish has gills to breathe underwater\n- A chameleon changes color to camouflage itself\n- A polar bear has thick fur and fat for cold Arctic temperatures\n\nChallenge: Design your own animal adapted to a very hot, dry environment. Draw it and label its adaptations.", duration: 35 },
      ],
    },
    // Grade 6
    {
      title: "Geometry and Measurement",
      description: "Master shapes, angles, perimeter, area, and volume.",
      subject: "MATHEMATICS",
      grade: 6,
      teacherId: mathTeacher.id,
      published: true,
      lessons: [
        { title: "2D Shapes and Their Properties", content: "Two-dimensional (2D) shapes are flat shapes with length and width.\n\nKey shapes:\n- Triangle: 3 sides, 3 angles (sum = 180°)\n- Rectangle: 4 sides, all angles = 90°\n- Circle: no straight sides, all points equidistant from centre\n- Hexagon: 6 equal sides (like a honeycomb!)\n\nActivity: Find real-life examples of each shape in your home or school.", duration: 30 },
        { title: "Perimeter and Area", content: "PERIMETER is the total distance around a shape.\nAREA is the amount of space inside a shape.\n\nFormulas:\n📏 Rectangle: P = 2(l + w), A = l × w\n📐 Triangle: P = a + b + c, A = ½ × base × height\n⭕ Circle: Circumference = 2πr, Area = πr²\n\nExample: A rectangle is 8 cm long and 5 cm wide.\nPerimeter = 2(8+5) = 26 cm\nArea = 8 × 5 = 40 cm²", duration: 40 },
        { title: "Introduction to Volume", content: "Volume measures the amount of 3D space an object occupies.\n\nVolume of a rectangular prism (box):\nV = length × width × height\n\nExample: A box is 4 cm × 3 cm × 2 cm\nV = 4 × 3 × 2 = 24 cm³\n\nUnits: cm³ (cubic centimetres) or m³ (cubic metres)\n\nReal life: How much water fills a swimming pool? How much space is in a fridge?", duration: 35 },
      ],
    },
    // Grade 7
    {
      title: "Introduction to Algebra",
      description: "Unlock the language of mathematics — variables, expressions, and equations.",
      subject: "MATHEMATICS",
      grade: 7,
      teacherId: mathTeacher.id,
      published: true,
      lessons: [
        { title: "Variables and Expressions", content: "In algebra, a VARIABLE is a letter that represents an unknown number.\n\nAn EXPRESSION is a combination of numbers, variables, and operations:\n- 3x (3 times x)\n- 2a + 5 (2 times a, plus 5)\n- y² (y squared)\n\nSimplifying: Collect like terms.\n3x + 2x + 4 = 5x + 4\n\nThink of x as a mystery bag of apples. 3x means 3 bags.", duration: 35 },
        { title: "Solving Linear Equations", content: "An EQUATION says two things are equal.\nTo solve: find the value of the variable.\n\nGolden rule: Whatever you do to one side, do to the other side.\n\nExample: 2x + 3 = 11\nSubtract 3 both sides: 2x = 8\nDivide both sides by 2: x = 4 ✓\n\nCheck: 2(4) + 3 = 11 ✓\n\nPractice: Solve 5y - 7 = 18", duration: 40 },
        { title: "Patterns and Sequences", content: "A SEQUENCE is an ordered list of numbers following a pattern.\n\nArithmetic sequences: add/subtract the same number each time\n2, 5, 8, 11, 14... (add 3 each time → common difference = 3)\n\nGeometric sequences: multiply by the same number each time\n2, 6, 18, 54... (multiply by 3 each time → common ratio = 3)\n\nTerm formula for arithmetic: Tₙ = a + (n-1)d\nwhere a = first term, d = common difference\n\nFind the 10th term of: 4, 7, 10, 13...", duration: 35 },
      ],
    },
    {
      title: "Atoms, Molecules and Matter",
      description: "Dive into the building blocks of everything around us.",
      subject: "PHYSICAL_SCIENCE",
      grade: 7,
      teacherId: scienceTeacher.id,
      published: true,
      lessons: [
        { title: "What is Matter?", content: "Matter is anything that has mass and takes up space.\n\nStates of Matter:\n🧊 SOLID: fixed shape and volume; particles packed tightly and vibrate in place\n💧 LIQUID: fixed volume, no fixed shape; particles slide past each other\n💨 GAS: no fixed shape or volume; particles move freely and fast\n\nChanges of state:\n- Melting: solid → liquid (add heat)\n- Evaporation: liquid → gas (add heat)\n- Condensation: gas → liquid (remove heat)\n- Freezing: liquid → solid (remove heat)\n\nWhy does ice cream melt on a hot day?", duration: 30 },
        { title: "Atoms and the Periodic Table", content: "ATOMS are the tiny building blocks of all matter.\n\nStructure of an atom:\n⚛️ Nucleus: contains protons (+) and neutrons (no charge)\n🔄 Electrons: negatively charged, orbit the nucleus\n\nThe PERIODIC TABLE organises all known elements.\n- Each element has a unique symbol (e.g., H = Hydrogen, O = Oxygen, Fe = Iron)\n- Elements in the same column (group) have similar properties\n- Metals are on the left; non-metals on the right\n\nMost common element in the universe: Hydrogen (H)", duration: 40 },
        { title: "Physical and Chemical Changes", content: "PHYSICAL CHANGE: the substance changes form but not its chemical composition.\nExamples: cutting paper, melting ice, dissolving sugar\nKey: the change is reversible!\n\nCHEMICAL CHANGE: a new substance is formed.\nExamples: burning wood, rusting iron, cooking an egg\nSigns of chemical change:\n- Color change\n- Gas produced (bubbles)\n- Temperature change\n- New smell\n\nExperiment: Mix vinegar and baking soda. Observe and explain what type of change occurs.", duration: 35 },
      ],
    },
    // Grade 8
    {
      title: "Computer Science Fundamentals",
      description: "Learn how computers work, from binary to algorithms.",
      subject: "COMPUTER_SCIENCE",
      grade: 8,
      teacherId: techTeacher.id,
      published: true,
      lessons: [
        { title: "How Computers Work", content: "A computer is an electronic device that processes data.\n\nKey components:\n🖥️ CPU (Central Processing Unit): the 'brain' — performs calculations\n💾 RAM (Random Access Memory): temporary storage for running programs\n💿 Storage (HDD/SSD): permanent data storage\n⌨️ Input devices: keyboard, mouse, microphone\n🖥️ Output devices: monitor, speakers, printer\n\nThe CPU follows instructions incredibly fast — modern CPUs perform billions of operations per second!\n\nWhy is RAM important? When you open too many browser tabs, your computer slows down — you've used up your RAM.", duration: 30 },
        { title: "Binary and Number Systems", content: "Computers store all data as 1s and 0s — called BINARY (base 2).\n\nWhy binary? Electronic circuits have two states: ON (1) or OFF (0).\n\nConverting binary to decimal:\n1011 in binary:\n1×2³ + 0×2² + 1×2¹ + 1×2⁰\n= 8 + 0 + 2 + 1 = 11 in decimal\n\nConverting decimal to binary:\n13 ÷ 2 = 6 r 1\n6 ÷ 2 = 3 r 0\n3 ÷ 2 = 1 r 1\n1 ÷ 2 = 0 r 1\nRead remainders bottom to top: 1101\n\nChallenge: Convert 42 to binary.", duration: 40 },
        { title: "Introduction to Algorithms", content: "An ALGORITHM is a step-by-step set of instructions to solve a problem.\n\nProperties of a good algorithm:\n✅ Clear and unambiguous\n✅ Has a definite start and end\n✅ Produces the correct output\n\nExample — Making a sandwich:\n1. Get two slices of bread\n2. Spread butter on one slice\n3. Add filling\n4. Place second slice on top\n5. Done!\n\nIn computing: algorithms sort data, search databases, compress files, and power AI.\n\nActivity: Write an algorithm (in plain English) to find the largest number in a list of 5 numbers.", duration: 35 },
      ],
    },
    // Grade 9
    {
      title: "Functions and Graphs",
      description: "Understand relationships between variables through functions and their graphs.",
      subject: "MATHEMATICS",
      grade: 9,
      teacherId: mathTeacher.id,
      published: true,
      lessons: [
        { title: "What is a Function?", content: "A FUNCTION is a relationship where each input has exactly one output.\n\nFunction notation: f(x) = ...\nf(3) means: substitute x = 3 into the function.\n\nExample: f(x) = 2x + 1\nf(3) = 2(3) + 1 = 7\nf(0) = 2(0) + 1 = 1\nf(-2) = 2(-2) + 1 = -3\n\nThe SET OF INPUTS is called the domain.\nThe SET OF OUTPUTS is called the range.\n\nIs this a function? Input: student, Output: student number → YES (each student has one number)", duration: 35 },
        { title: "Linear Functions and Straight Line Graphs", content: "A LINEAR FUNCTION has the form: y = mx + c\n\nm = gradient (slope) = rise/run = (y₂-y₁)/(x₂-x₁)\nc = y-intercept (where the line crosses the y-axis)\n\nExample: y = 2x + 3\nGradient = 2 (for every 1 unit right, go 2 units up)\ny-intercept = 3 (line crosses y-axis at (0,3))\n\nTo draw:\n1. Plot y-intercept: (0, 3)\n2. Use gradient to find another point: (1, 5)\n3. Draw a straight line through both points\n\nWhat does a negative gradient look like?", duration: 40 },
        { title: "Quadratic Functions and Parabolas", content: "A QUADRATIC FUNCTION has the form: y = ax² + bx + c\n\nIts graph is a U-shaped curve called a PARABOLA.\n\nKey features:\n📍 Turning point (vertex): the minimum or maximum\n📍 Axis of symmetry: vertical line through the vertex\n📍 x-intercepts (roots): where the parabola crosses the x-axis\n📍 y-intercept: where it crosses the y-axis (x=0)\n\nIf a > 0: parabola opens UP (happy face ☺)\nIf a < 0: parabola opens DOWN (sad face ☹)\n\nExample: y = x² - 4\nRoots: x = ±2, Vertex: (0, -4)", duration: 45 },
      ],
    },
    // Grade 10
    {
      title: "Euclidean Geometry",
      description: "Prove geometric theorems and solve angle and circle problems.",
      subject: "MATHEMATICS",
      grade: 10,
      teacherId: mathTeacher.id,
      published: true,
      lessons: [
        { title: "Lines, Angles and Triangles", content: "TYPES OF ANGLES:\n- Acute: < 90°\n- Right: = 90°\n- Obtuse: 90° < angle < 180°\n- Straight: = 180°\n- Reflex: > 180°\n\nANGLE RELATIONSHIPS:\n- Complementary: sum = 90°\n- Supplementary: sum = 180°\n- Vertically opposite: equal (formed by crossing lines)\n- Co-interior angles: sum = 180° (parallel lines)\n- Alternate angles: equal (parallel lines, Z-shape)\n\nTRIANGLE PROPERTIES:\n- Sum of angles = 180°\n- Exterior angle = sum of two non-adjacent interior angles\n\nProve: If two sides of a triangle are equal, the base angles are equal.", duration: 40 },
        { title: "Congruence and Similarity", content: "CONGRUENT shapes: exactly the same shape AND size (≅)\nSIMILAR shapes: same shape, different size (|||)\n\nTests for congruent triangles:\n✓ SSS: three sides equal\n✓ SAS: two sides and included angle equal\n✓ AAS: two angles and a side equal\n✓ RHS: right angle, hypotenuse, side\n\nTests for similar triangles:\n✓ AA: two angles equal\n✓ SSS: sides proportional\n✓ SAS: two sides proportional and included angle equal\n\nIf triangle ABC ||| triangle DEF, and AB = 6, DE = 9, what is the scale factor?", duration: 45 },
        { title: "Circle Theorems", content: "Key circle theorems:\n\n⭕ Angle at centre = 2 × angle at circumference (same arc)\n⭕ Angles in same segment are equal\n⭕ Angle in semicircle = 90°\n⭕ Opposite angles of cyclic quadrilateral sum to 180°\n⭕ Tangent ⊥ radius at point of contact\n\nProof strategy:\n1. Identify what is given\n2. State what you need to prove\n3. Add construction lines if needed\n4. Give reasons for each step\n\nPractice: O is the centre. If angle AOB = 80°, find angle ACB where C is on the circle.", duration: 50 },
      ],
    },
    // Grade 11
    {
      title: "Trigonometry",
      description: "Master trig ratios, identities, and solving triangles.",
      subject: "MATHEMATICS",
      grade: 11,
      teacherId: mathTeacher.id,
      published: true,
      lessons: [
        { title: "Trigonometric Ratios", content: "In a RIGHT-ANGLED triangle:\n\nsin θ = opposite/hypotenuse\ncos θ = adjacent/hypotenuse\ntan θ = opposite/adjacent\n\nMemory aid: SOH-CAH-TOA\n\nSpecial angles:\n| Angle | sin | cos | tan |\n|-------|-----|-----|-----|\n|  30°  | 1/2 | √3/2| 1/√3|\n|  45°  | 1/√2|1/√2 |  1  |\n|  60°  | √3/2| 1/2 |  √3 |\n\nExample: In right triangle, opposite = 5, hypotenuse = 13.\nsin θ = 5/13, so θ = sin⁻¹(5/13) ≈ 22.6°", duration: 40 },
        { title: "Trig in Any Triangle: Sine and Cosine Rules", content: "For NON-right triangles we use:\n\nSINE RULE: a/sin A = b/sin B = c/sin C\nUse when: two angles and a side, or two sides and a non-included angle\n\nCOSINE RULE: a² = b² + c² - 2bc·cos A\nUse when: three sides, or two sides and the included angle\n\nExample (Sine Rule):\nIn triangle ABC: A = 40°, B = 75°, a = 8 cm\nFind b:\n8/sin40° = b/sin75°\nb = 8 × sin75°/sin40° ≈ 12.0 cm\n\nApplication: Surveyors use these rules to measure land!", duration: 45 },
        { title: "Trigonometric Identities", content: "IDENTITIES are equations true for all values.\n\nFundamental identities:\n1. sin²θ + cos²θ = 1\n2. tan θ = sin θ/cos θ\n3. 1/cos θ = sec θ\n4. 1/sin θ = cosec θ\n\nDerived from identity 1:\n- sin²θ = 1 - cos²θ\n- cos²θ = 1 - sin²θ\n\nProving identities:\n- Work on ONE side only\n- Use known identities to transform it\n- Do NOT cross multiply\n\nProve: (1 - sin²θ)/cos θ = cos θ\nLHS = cos²θ/cos θ = cos θ = RHS ✓", duration: 45 },
      ],
    },
    // Grade 12
    {
      title: "Calculus: Differentiation",
      description: "Understand rates of change and master differentiation techniques.",
      subject: "MATHEMATICS",
      grade: 12,
      teacherId: mathTeacher.id,
      published: true,
      lessons: [
        { title: "Limits and the Concept of a Derivative", content: "The DERIVATIVE measures the rate of change of a function.\n\nThe GRADIENT of a curve at a point = the gradient of the tangent at that point.\n\nDefinition from first principles:\nf'(x) = lim[h→0] [f(x+h) - f(x)] / h\n\nExample: f(x) = x²\nf'(x) = lim[h→0] [(x+h)² - x²] / h\n= lim[h→0] [x² + 2xh + h² - x²] / h\n= lim[h→0] [2xh + h²] / h\n= lim[h→0] (2x + h) = 2x\n\nSo the derivative of x² is 2x.", duration: 50 },
        { title: "Rules of Differentiation", content: "Standard rules (much faster than first principles):\n\n📌 Power rule: d/dx(xⁿ) = nxⁿ⁻¹\n📌 Constant: d/dx(c) = 0\n📌 Sum rule: d/dx[f+g] = f' + g'\n📌 Constant multiple: d/dx[cf] = cf'\n\nExamples:\n- d/dx(x³) = 3x²\n- d/dx(5x²) = 10x\n- d/dx(3x⁴ - 2x² + 7) = 12x³ - 4x\n\nNotation: f'(x), dy/dx, Df(x) all mean the derivative.\n\nFind dy/dx if y = 4x⁵ - 3x³ + 2x - 9", duration: 45 },
        { title: "Applications: Turning Points and Optimisation", content: "The derivative tells us:\n- Where a function is increasing (f'(x) > 0)\n- Where a function is decreasing (f'(x) < 0)\n- Stationary points (f'(x) = 0)\n\nTURNING POINTS:\n- If f''(x) < 0: LOCAL MAXIMUM\n- If f''(x) > 0: LOCAL MINIMUM\n\nOPTIMISATION (real-world problems):\n1. Write the quantity to optimise as a function\n2. Differentiate and set equal to zero\n3. Solve for x\n4. Verify it's a max or min\n\nExample: A farmer has 100m of fencing. What dimensions maximise the rectangular area?\nA = x(50-x) = 50x - x²\ndA/dx = 50 - 2x = 0 → x = 25\nMax area = 25 × 25 = 625 m²", duration: 55 },
      ],
    },
    {
      title: "Physical Science: Electricity and Magnetism",
      description: "Master circuits, electrostatics, and electromagnetic induction.",
      subject: "PHYSICAL_SCIENCE",
      grade: 12,
      teacherId: scienceTeacher.id,
      published: true,
      lessons: [
        { title: "Electric Circuits and Ohm's Law", content: "OHM'S LAW: V = IR\nV = voltage (volts, V)\nI = current (amperes, A)\nR = resistance (ohms, Ω)\n\nSeries circuits:\n- Same current flows through all components\n- Resistances ADD: R_total = R₁ + R₂ + R₃\n- Voltages add up to EMF\n\nParallel circuits:\n- Same voltage across all branches\n- 1/R_total = 1/R₁ + 1/R₂ + 1/R₃\n- Currents add up to total current\n\nPOWER: P = VI = I²R = V²/R (unit: watts W)\n\nA toaster has resistance 20Ω and operates at 220V. Find current and power.", duration: 50 },
        { title: "Electrostatics", content: "ELECTRIC CHARGE:\n- Positive charge: protons (+)\n- Negative charge: electrons (-)\n- Like charges REPEL, unlike charges ATTRACT\n\nCOULOMB'S LAW: F = kq₁q₂/r²\nk = 9 × 10⁹ N·m²/C²\n\nELECTRIC FIELD: region where a charge experiences a force\nE = F/q = kQ/r²\n\nELECTRIC POTENTIAL: work done per unit charge\nV = kQ/r\n\nApplications:\n- Lightning conductors\n- Photocopiers\n- Inkjet printers\n- Capacitors in phones\n\nWhy does your hair stand up near a Van de Graaff generator?", duration: 45 },
        { title: "Electromagnetic Induction and Generators", content: "FARADAY'S LAW: A changing magnetic field induces an EMF in a conductor.\n\nInduced EMF depends on:\n- Rate of change of magnetic flux\n- Number of coil turns\n\nε = -N × ΔΦ/Δt\n\nLENZ'S LAW: The induced current opposes the change that caused it.\n\nACTION TO DEVICES:\n🔋 Generator: converts mechanical energy → electrical energy\n⚡ Transformer: changes AC voltage using electromagnetic induction\n📱 Wireless charging: uses electromagnetic induction\n\nAC Generator:\n- Coil rotates in magnetic field\n- Produces alternating current (AC)\n- South Africa: 50 Hz, 230 V\n\nExplain why a transformer doesn't work with DC current.", duration: 50 },
      ],
    },
  ];

  for (const courseData of coursesData) {
    const { lessons, ...courseFields } = courseData;
    const course = await prisma.course.create({
      data: courseFields,
    });

    for (let i = 0; i < lessons.length; i++) {
      await prisma.lesson.create({
        data: {
          ...lessons[i],
          order: i + 1,
          courseId: course.id,
        },
      });
    }
    console.log(`✅ Created: ${course.title} (Grade ${course.grade})`);
  }

  console.log("\n🌱 Seed complete!");
  console.log(`Admin: admin@rnda.org.za`);
  console.log(`Teachers: math@rnda.org.za, science@rnda.org.za, tech@rnda.org.za`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
