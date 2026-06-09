export const grade8Term1 = {
  course: {
    title: "Grade 8 Mathematics — Term 1",
    description:
      "A self-paced CAPS-aligned course covering Whole Numbers, Integers, Exponents, and Patterns. Work through every lesson at your own pace — each one explains the concept, shows worked examples, and gives you practice questions with answers.",
    subject: "MATHEMATICS",
    grade: 8,
  },

  sections: [
    // ─────────────────────────────────────────────────────────────────────────────
    // SECTION 1 — WHOLE NUMBERS
    // ─────────────────────────────────────────────────────────────────────────────
    {
      name: "Whole Numbers & Number Theory",
      order: 1,
      lessons: [
        {
          title: "The Number System",
          order: 1,
          duration: 25,
          content: `🎯 WHAT YOU WILL LEARN
• The difference between natural numbers, whole numbers, and integers
• How to place numbers on a number line
• Properties of numbers: even, odd, prime, composite

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 KEY CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NATURAL NUMBERS (ℕ): The counting numbers — {1, 2, 3, 4, 5, …}
They go on forever. Zero is NOT included.

WHOLE NUMBERS (ℕ₀): Natural numbers including zero — {0, 1, 2, 3, 4, 5, …}

INTEGERS (ℤ): All whole numbers AND their negatives — {…, −3, −2, −1, 0, 1, 2, 3, …}

THE NUMBER LINE:
  ←  −5  −4  −3  −2  −1   0   1   2   3   4   5  →
Numbers get BIGGER as you move RIGHT.
Numbers get SMALLER as you move LEFT.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 TYPES OF WHOLE NUMBERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EVEN numbers: Exactly divisible by 2 → {0, 2, 4, 6, 8, 10, …}
ODD numbers: Not exactly divisible by 2 → {1, 3, 5, 7, 9, 11, …}

PRIME numbers: Exactly 2 factors — 1 and itself
  → {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, …}
  → NOTE: 1 is NOT prime (it only has one factor)
  → 2 is the ONLY even prime number

COMPOSITE numbers: More than 2 factors
  → {4, 6, 8, 9, 10, 12, 14, 15, …}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: Classify each number as prime or composite.
  a) 17    b) 21    c) 29    d) 33

Solutions:
  a) 17: Factors are 1 and 17 only → PRIME
  b) 21: Factors are 1, 3, 7, 21 → COMPOSITE (divisible by 3 and 7)
  c) 29: Factors are 1 and 29 only → PRIME
  d) 33: Factors are 1, 3, 11, 33 → COMPOSITE (divisible by 3 and 11)

Example 2: List all prime numbers between 10 and 30.
  Check each: 11 ✓, 12 ✗, 13 ✓, 14 ✗, 15 ✗, 16 ✗, 17 ✓, 18 ✗,
              19 ✓, 20 ✗, 21 ✗, 22 ✗, 23 ✓, 24 ✗, 25 ✗, 26 ✗,
              27 ✗, 28 ✗, 29 ✓
  Answer: 11, 13, 17, 19, 23, 29

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Write down the first 5 prime numbers.
2. Is 51 prime or composite? Explain.
3. Which is larger: −7 or −2? Explain using a number line.
4. List all even numbers between 11 and 21.
5. True or False: Every even number greater than 2 is composite.

✅ ANSWERS
1. 2, 3, 5, 7, 11
2. Composite — 51 = 3 × 17, so it has more than 2 factors
3. −2 is larger. On the number line, −2 is to the RIGHT of −7.
4. 12, 14, 16, 18, 20
5. True — an even number greater than 2 can be divided by 2, giving a third factor.`,
        },
        {
          title: "Prime Factorisation",
          order: 2,
          duration: 30,
          content: `🎯 WHAT YOU WILL LEARN
• How to find all the factors of a number
• How to write a number as a product of its prime factors
• How to use factor trees

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 KEY CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FACTORS: Numbers that divide into another number exactly (no remainder).
  Factors of 12: 1, 2, 3, 4, 6, 12

PRIME FACTORISATION: Writing a number as a product (multiplication) of prime numbers only.
  Every composite number can be broken down into prime factors — this is unique for each number.

METHOD: Factor Tree
  Step 1: Write the number at the top.
  Step 2: Split it into any two factors.
  Step 3: Keep splitting until all branches end in prime numbers.
  Step 4: Collect all the prime numbers at the ends of the branches.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: Prime factorisation of 36

       36
      /  \\
     4    9
    / \\  / \\
   2   2 3   3

Prime factors collected: 2, 2, 3, 3
Answer: 36 = 2² × 3²

Example 2: Prime factorisation of 60

       60
      /  \\
     6    10
    / \\   / \\
   2   3  2   5

Prime factors: 2, 3, 2, 5
Answer: 60 = 2² × 3 × 5

Example 3: Prime factorisation of 84

       84
      /  \\
     2    42
          / \\
         2   21
             / \\
            3   7

Answer: 84 = 2² × 3 × 7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 HOW TO CHECK YOUR ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Multiply all the prime factors together — you should get the original number.
  2² × 3 × 7 = 4 × 3 × 7 = 4 × 21 = 84 ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Write the prime factorisation of each number:
1. 18
2. 45
3. 72
4. 100
5. 120

✅ ANSWERS
1. 18 = 2 × 3²
2. 45 = 3² × 5
3. 72 = 2³ × 3²
4. 100 = 2² × 5²
5. 120 = 2³ × 3 × 5`,
        },
        {
          title: "HCF and LCM",
          order: 3,
          duration: 35,
          content: `🎯 WHAT YOU WILL LEARN
• How to find the Highest Common Factor (HCF) of two or more numbers
• How to find the Lowest Common Multiple (LCM) of two or more numbers
• When to use HCF vs LCM in real-life problems

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 HCF — HIGHEST COMMON FACTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The HCF is the LARGEST number that divides into two (or more) numbers exactly.

METHOD 1 — List all factors:
  Factors of 12: 1, 2, 3, 4, 6, 12
  Factors of 18: 1, 2, 3, 6, 9, 18
  Common factors: 1, 2, 3, 6
  HCF = 6

METHOD 2 — Prime factorisation (better for large numbers):
  Step 1: Write prime factorisation of each number.
  Step 2: Identify prime factors that appear in BOTH.
  Step 3: Use the LOWEST power of each common factor.
  Step 4: Multiply these together.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ HCF WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: Find HCF(24, 36)
  24 = 2³ × 3
  36 = 2² × 3²
  Common factors: 2 (lowest power = 2²) and 3 (lowest power = 3¹)
  HCF = 2² × 3 = 4 × 3 = 12

Example 2: Find HCF(48, 60, 72)
  48 = 2⁴ × 3
  60 = 2² × 3 × 5
  72 = 2³ × 3²
  Common to ALL THREE: 2 (lowest power = 2²) and 3 (lowest power = 3¹)
  HCF = 2² × 3 = 12

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 LCM — LOWEST COMMON MULTIPLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The LCM is the SMALLEST number that is a multiple of two (or more) numbers.

METHOD — Prime factorisation:
  Step 1: Write prime factorisation of each number.
  Step 2: Identify ALL prime factors that appear in EITHER number.
  Step 3: Use the HIGHEST power of each factor.
  Step 4: Multiply these together.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ LCM WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: Find LCM(12, 18)
  12 = 2² × 3
  18 = 2 × 3²
  All factors: 2 (highest power = 2²) and 3 (highest power = 3²)
  LCM = 2² × 3² = 4 × 9 = 36

Example 2: Find LCM(4, 6, 10)
  4  = 2²
  6  = 2 × 3
  10 = 2 × 5
  All factors: 2 (highest = 2²), 3 (highest = 3¹), 5 (highest = 5¹)
  LCM = 4 × 3 × 5 = 60

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 REAL-WORLD APPLICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use HCF when SPLITTING things into equal groups (sharing / cutting).
  "What is the biggest tile size that fits exactly into a 36 cm × 48 cm room?"
  → HCF(36, 48) = 12 cm

Use LCM when things need to meet/coincide again (timing / scheduling).
  "Taxi A leaves every 12 minutes. Taxi B leaves every 18 minutes.
   When do they both leave at the same time again?"
  → LCM(12, 18) = 36 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Find HCF(16, 24)
2. Find HCF(30, 45, 60)
3. Find LCM(8, 12)
4. Find LCM(5, 6, 10)
5. Two friends both start reading at the same time. Friend A takes 8 days to finish a book, Friend B takes 12 days. If they both start new books today, how many days until they both start a new book on the same day again?

✅ ANSWERS
1. HCF(16, 24): 16 = 2⁴, 24 = 2³ × 3 → HCF = 2³ = 8
2. HCF(30, 45, 60): 30 = 2×3×5, 45 = 3²×5, 60 = 2²×3×5 → HCF = 3×5 = 15
3. LCM(8, 12): 8 = 2³, 12 = 2²×3 → LCM = 2³×3 = 24
4. LCM(5, 6, 10): 5, 6=2×3, 10=2×5 → LCM = 2×3×5 = 30
5. LCM(8, 12) = 24 days`,
        },
        {
          title: "Order of Operations — BODMAS",
          order: 4,
          duration: 30,
          content: `🎯 WHAT YOU WILL LEARN
• The correct order to perform mathematical operations
• How to apply BODMAS to solve complex calculations
• Common mistakes to avoid

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 WHAT IS BODMAS?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Without rules, different people get different answers to the same sum.
BODMAS tells us the ORDER in which to calculate:

  B — Brackets         ( )  first
  O — Orders / Powers  ²  ³  √  second
  D — Division         ÷  third (left to right)
  M — Multiplication   ×  third (left to right)
  A — Addition         +  last (left to right)
  S — Subtraction      −  last (left to right)

⚠️ IMPORTANT: Division and Multiplication have EQUAL priority — work left to right.
⚠️ IMPORTANT: Addition and Subtraction have EQUAL priority — work left to right.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: Calculate 3 + 4 × 2
  Step 1: Multiplication first → 4 × 2 = 8
  Step 2: Addition → 3 + 8 = 11
  Answer: 11
  (NOT 14 — do not add first!)

Example 2: Calculate 20 − 3² + (8 ÷ 4)
  Step 1: Brackets → 8 ÷ 4 = 2
  Step 2: Orders → 3² = 9
  Step 3: Now: 20 − 9 + 2
  Step 4: Left to right → 20 − 9 = 11, then 11 + 2 = 13
  Answer: 13

Example 3: Calculate (5 + 3)² ÷ 4 − 6
  Step 1: Brackets → 5 + 3 = 8
  Step 2: Orders → 8² = 64
  Step 3: Division → 64 ÷ 4 = 16
  Step 4: Subtraction → 16 − 6 = 10
  Answer: 10

Example 4: Calculate 3 × 4 + 12 ÷ 6 − 2 × 3
  Step 1: Mult/Div left to right:
          3 × 4 = 12  and  12 ÷ 6 = 2  and  2 × 3 = 6
  Step 2: Now: 12 + 2 − 6
  Step 3: Left to right: 12 + 2 = 14, then 14 − 6 = 8
  Answer: 8

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ COMMON MISTAKES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✗ Wrong: 8 ÷ 2 × 4 = 8 ÷ 8 = 1
✓ Right: 8 ÷ 2 × 4 = (8 ÷ 2) × 4 = 4 × 4 = 16   (left to right!)

✗ Wrong: 5 − 3 + 2 = 5 − 5 = 0
✓ Right: 5 − 3 + 2 = (5 − 3) + 2 = 2 + 2 = 4    (left to right!)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calculate (show each step):
1.  5 + 3 × 4
2.  18 ÷ 3 − 2
3.  (4 + 6) × 3 − 5
4.  2³ + 4 × (7 − 3)
5.  36 ÷ (2² + 2) − 3

✅ ANSWERS
1. 5 + 12 = 17
2. 6 − 2 = 4
3. 10 × 3 − 5 = 30 − 5 = 25
4. 8 + 4 × 4 = 8 + 16 = 24
5. 36 ÷ (4 + 2) − 3 = 36 ÷ 6 − 3 = 6 − 3 = 3`,
        },
      ],
      assignment: {
        title: "Whole Numbers Assessment",
        description: `Answer ALL questions. Show your working for full marks.

SECTION A — Multiple Choice (1 mark each)
1. Which of the following is a prime number?
   A) 1    B) 9    C) 11    D) 15

2. What is the HCF of 24 and 36?
   A) 4    B) 6    C) 12    D) 72

3. Calculate: 3 + 2 × 5 − 1
   A) 24   B) 14   C) 12   D) 10

SECTION B — Short Answer (2 marks each)
4. Write the prime factorisation of 90.
5. Find the LCM of 6 and 8.
6. List all factors of 30.

SECTION C — Problem Solving (3 marks each)
7. Two buses leave the station at the same time. Bus A returns every 15 minutes. Bus B returns every 20 minutes. How many minutes until both buses are at the station at the same time again?

8. A teacher wants to split 48 books and 36 pens into identical gift bags with no items left over. What is the maximum number of gift bags she can make? How many books and pens are in each bag?`,
        dueDate: 14,
        maxScore: 25,
        weight: 1.5,
      },
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // SECTION 2 — INTEGERS
    // ─────────────────────────────────────────────────────────────────────────────
    {
      name: "Integers",
      order: 2,
      lessons: [
        {
          title: "Understanding Integers",
          order: 5,
          duration: 20,
          content: `🎯 WHAT YOU WILL LEARN
• What integers are and where we use them
• How to compare and order integers
• What absolute value means

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 KEY CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INTEGERS include all positive whole numbers, zero, and negative whole numbers:
  ℤ = {…, −4, −3, −2, −1, 0, 1, 2, 3, 4, …}

REAL-LIFE INTEGERS:
  • Temperature: −5°C is 5 degrees below zero
  • Money: −R200 means you owe R200 (overdraft)
  • Height: −50 m means 50 m below sea level
  • Sport: −2 in golf means 2 under par

THE NUMBER LINE:
  ←  −5  −4  −3  −2  −1   0  +1  +2  +3  +4  +5  →
           negative  |  positive

ORDERING INTEGERS:
  On the number line, numbers increase from left to right.
  −10 < −3 < −1 < 0 < 2 < 7 < 15
  (−10 is the smallest, 15 is the largest)

ABSOLUTE VALUE (|n|):
  The distance from zero — always positive (or zero).
  |−7| = 7       |+5| = 5       |0| = 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: Arrange from smallest to largest:  3, −7, 0, −2, 5, −10
  Answer: −10, −7, −2, 0, 3, 5

Example 2: Find the value of |−12| − |3|
  = 12 − 3 = 9

Example 3: The temperature at midnight was −3°C. By noon it had risen by 8°C.
  What was the temperature at noon?
  −3 + 8 = 5°C

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Write < or > between each pair:   −5 __ −1    and    −8 __ −12
2. Arrange in ascending order (smallest to largest): −3, 4, −7, 0, 2, −1
3. Calculate: |−9| + |4|
4. A submarine is at −120 m. It rises 45 m. What is its new depth?

✅ ANSWERS
1. −5 < −1    and    −8 > −12
2. −7, −3, −1, 0, 2, 4
3. 9 + 4 = 13
4. −120 + 45 = −75 m`,
        },
        {
          title: "Adding and Subtracting Integers",
          order: 6,
          duration: 35,
          content: `🎯 WHAT YOU WILL LEARN
• How to add and subtract positive and negative integers
• The rules for same-sign and different-sign additions
• Why subtracting a negative means adding

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 RULES FOR ADDITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SAME SIGNS — Add the numbers, keep the sign:
  (+3) + (+5) = +8        → both positive: answer is positive
  (−3) + (−5) = −8        → both negative: answer is negative

DIFFERENT SIGNS — Subtract the smaller from the larger, keep the sign of the larger:
  (+7) + (−3) = +4        → 7 − 3 = 4, larger is +7, so answer is positive
  (−7) + (+3) = −4        → 7 − 3 = 4, larger is −7, so answer is negative
  (+4) + (−9) = −5        → 9 − 4 = 5, larger is −9, so answer is negative

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 RULES FOR SUBTRACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY RULE: Subtracting is the same as adding the OPPOSITE.
  a − b  =  a + (−b)

This means:
  Subtracting a positive → same as adding a negative:  5 − (+3) = 5 + (−3) = 2
  Subtracting a negative → same as adding a positive:  5 − (−3) = 5 + (+3) = 8

SIGN RULES summary:
  + + = +    (positive add positive)
  − − = +    (negative subtract negative = add positive)
  + − = −    (positive add negative)
  − + = −    (negative add positive)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: (−8) + (+3)
  Different signs: 8 − 3 = 5, larger absolute value is 8 (negative)
  Answer: −5

Example 2: (−6) − (−4)
  Subtracting negative = adding positive: (−6) + (+4)
  Different signs: 6 − 4 = 2, larger is 6 (negative)
  Answer: −2

Example 3: (−5) + (−9) − (+3)
  Step 1: (−5) + (−9) = −14   (same sign, add)
  Step 2: (−14) − (+3) = (−14) + (−3) = −17
  Answer: −17

Example 4: 7 − (−3) + (−8) − (+2)
  Rewrite: 7 + 3 + (−8) + (−2)
  = 10 + (−10)
  = 0
  Answer: 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calculate:
1. (−4) + (−7)
2. (+9) + (−14)
3. (−3) − (−8)
4. 5 − (+12)
5. (−6) + (−4) − (−10)
6. A diver is at −18 m. She dives a further 7 m deeper. Where is she now?

✅ ANSWERS
1. −11
2. −5
3. −3 + 8 = +5
4. 5 − 12 = −7
5. −10 + 10 = 0
6. −18 + (−7) = −25 m`,
        },
        {
          title: "Multiplying and Dividing Integers",
          order: 7,
          duration: 30,
          content: `🎯 WHAT YOU WILL LEARN
• The sign rules for multiplying and dividing integers
• How to apply these rules to longer calculations
• How to spot when an answer will be positive or negative

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 THE SIGN RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For multiplication AND division, the rules are the same:

  (+) × (+) = (+)    e.g.  3 × 4 = 12
  (−) × (−) = (+)    e.g.  −3 × −4 = 12   ← TWO negatives make a POSITIVE
  (+) × (−) = (−)    e.g.  3 × −4 = −12
  (−) × (+) = (−)    e.g.  −3 × 4 = −12

SHORTCUT: Count the number of negative signs:
  • EVEN number of negatives → answer is POSITIVE
  • ODD number of negatives → answer is NEGATIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: (−5) × (+4)
  One negative → answer is negative
  5 × 4 = 20
  Answer: −20

Example 2: (−3) × (−2) × (−4)
  Three negatives = ODD → answer is negative
  3 × 2 × 4 = 24
  Answer: −24

Example 3: (−36) ÷ (−9)
  Two negatives = EVEN → answer is positive
  36 ÷ 9 = 4
  Answer: +4

Example 4: (−2)³
  = (−2) × (−2) × (−2)
  = (+4) × (−2)
  = −8
  (Three negatives = odd = negative)

Example 5: Mixed calculation:  (−3) × 4 ÷ (−6)
  Work left to right:
  (−3) × 4 = −12
  (−12) ÷ (−6) = +2
  Answer: 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calculate:
1. (−7) × (+3)
2. (−5) × (−8)
3. (+24) ÷ (−6)
4. (−48) ÷ (−8)
5. (−2) × (−3) × (−5)
6. (−1)⁴
7. (−4)² × (−3) ÷ (+6)

✅ ANSWERS
1. −21
2. +40
3. −4
4. +6
5. −30   (3 negatives = odd)
6. +1    (4 negatives = even)
7. 16 × (−3) ÷ 6 = −48 ÷ 6 = −8`,
        },
        {
          title: "Mixed Operations with Integers",
          order: 8,
          duration: 25,
          content: `🎯 WHAT YOU WILL LEARN
• How to combine all four operations with integers
• Applying BODMAS correctly to integer calculations
• Real-world integer problems

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 KEY REMINDER — BODMAS WITH INTEGERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The same BODMAS order applies — but now we also apply our integer sign rules at each step.

Order:  Brackets → Orders → Division/Multiplication → Addition/Subtraction

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: (−3)² + 4 × (−2) − (−6)
  Step 1 (Orders):     (−3)² = 9
  Step 2 (Multiply):   4 × (−2) = −8
  Step 3 (Rewrite):    9 + (−8) − (−6)
  Step 4 (Sub neg):    9 + (−8) + 6
  Step 5 (Add/Sub L→R): 9 − 8 = 1, then 1 + 6 = 7
  Answer: 7

Example 2: [−20 ÷ (−4)] − 3 × (−2)²
  Step 1 (Inner Brackets): −20 ÷ (−4) = 5
  Step 2 (Orders):         (−2)² = 4
  Step 3 (Multiply):       3 × 4 = 12
  Step 4 (Subtract):       5 − 12 = −7
  Answer: −7

Example 3: −5 + (8 − 12) × (−3)
  Step 1 (Brackets):  8 − 12 = −4
  Step 2 (Multiply):  (−4) × (−3) = 12
  Step 3 (Add):       −5 + 12 = 7
  Answer: 7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. −6 + (−3) × (−4)
2. (−2)³ + 5 × (−3)
3. (−18 ÷ 3) − (−4)²
4. [−3 + (−7)] × 2 − (−6)
5. The temperature was −4°C. It dropped 3°C per hour for 4 hours. What is the temperature now?

✅ ANSWERS
1. −6 + 12 = 6
2. −8 + (−15) = −23
3. −6 − 16 = −22
4. [−10] × 2 + 6 = −20 + 6 = −14
5. −4 + (4 × −3) = −4 − 12 = −16°C`,
        },
      ],
      assignment: {
        title: "Integers Practice Test",
        description: `Show ALL working. Answers without working will receive 0 marks.

SECTION A (1 mark each)
1. What is the value of (−4) × (−3)?
   A) −12    B) 12    C) −7    D) 7

2. Which is correct?   −8 __ −5
   A) >    B) <    C) =

3. What is |−15|?
   A) 15    B) −15    C) 1/15    D) 0

SECTION B — Calculate (2 marks each, show steps)
4. (−7) + (+12) − (−3)
5. (−4) × (−3) × (+2)
6. (−3)² − 4 × (−2) + (−6)

SECTION C — Problem Solving (3 marks each)
7. At 6:00 am the temperature was −8°C. It rose 3°C every hour. What was the temperature at 11:00 am?

8. A company has debts of R15 000 and R8 500, and income of R12 000. Write this as an integer calculation and find the net balance. Is this an overall gain or loss?`,
        dueDate: 14,
        maxScore: 20,
        weight: 1.5,
      },
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // SECTION 3 — EXPONENTS
    // ─────────────────────────────────────────────────────────────────────────────
    {
      name: "Exponents",
      order: 3,
      lessons: [
        {
          title: "Introduction to Exponents",
          order: 9,
          duration: 25,
          content: `🎯 WHAT YOU WILL LEARN
• What an exponent (index/power) is
• How to read and write exponential notation
• How to expand and evaluate powers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 KEY CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPONENTIAL NOTATION:
  aⁿ  =  a × a × a × … × a   (a multiplied by itself n times)
       base↑     ↑exponent/power/index

  5³ = 5 × 5 × 5 = 125
  Read as: "5 to the power of 3" or "5 cubed"

SPECIAL NAMES:
  a² is called "a SQUARED"   → 4² = 16
  a³ is called "a CUBED"     → 2³ = 8
  a¹ = a (anything to the power 1 = itself)
  a⁰ = 1 (anything to the power 0 = 1, except 0⁰)

NEGATIVE BASES:
  Even power → positive result:   (−3)² = (−3)(−3) = +9
  Odd power  → negative result:   (−3)³ = (−3)(−3)(−3) = −27

⚠️ BE CAREFUL:
  −3²  ≠  (−3)²
  −3²  = −(3²) = −9     [The negative is NOT inside the power]
  (−3)² = +9             [The negative IS inside the power]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: Evaluate 2⁵
  = 2 × 2 × 2 × 2 × 2
  = 4 × 2 × 2 × 2
  = 8 × 2 × 2
  = 16 × 2
  = 32

Example 2: Evaluate (−2)⁴
  = (−2) × (−2) × (−2) × (−2)
  = 4 × 4  (two pairs of negatives)
  = 16

Example 3: Evaluate −2⁴
  = −(2⁴) = −(16) = −16

Example 4: Write 81 as a power of 3
  81 = 3 × 27 = 3 × 3 × 9 = 3 × 3 × 3 × 3 = 3⁴

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Evaluate: a) 3⁴    b) 2⁶    c) 10³
2. Evaluate: a) (−5)²    b) (−2)⁵    c) −4²
3. Write as a single power: 64 = 2?  and  125 = 5?
4. Which is bigger: 2⁷ or 7²? Show working.

✅ ANSWERS
1. a) 81   b) 64   c) 1000
2. a) 25   b) −32   c) −16
3. 64 = 2⁶    125 = 5³
4. 2⁷ = 128   and   7² = 49   →   2⁷ is bigger`,
        },
        {
          title: "Laws of Exponents",
          order: 10,
          duration: 40,
          content: `🎯 WHAT YOU WILL LEARN
• The 5 main laws of exponents
• How to simplify expressions using the laws
• How to combine multiple laws

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 THE FIVE LAWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All laws apply when the BASE is the same.

LAW 1 — MULTIPLICATION: aᵐ × aⁿ = aᵐ⁺ⁿ   (ADD the exponents)
  3² × 3⁴ = 3²⁺⁴ = 3⁶

LAW 2 — DIVISION: aᵐ ÷ aⁿ = aᵐ⁻ⁿ   (SUBTRACT the exponents)
  5⁷ ÷ 5³ = 5⁷⁻³ = 5⁴

LAW 3 — POWER OF A POWER: (aᵐ)ⁿ = aᵐˣⁿ   (MULTIPLY the exponents)
  (2³)⁴ = 2³ˣ⁴ = 2¹²

LAW 4 — ZERO EXPONENT: a⁰ = 1   (any base, except 0)
  7⁰ = 1     (−3)⁰ = 1     100⁰ = 1

LAW 5 — POWER OF A PRODUCT: (ab)ⁿ = aⁿ × bⁿ
  (2 × 3)⁴ = 2⁴ × 3⁴ = 16 × 81 = 1296

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: Simplify 2³ × 2⁵
  Law 1: 2³⁺⁵ = 2⁸ = 256

Example 2: Simplify 3⁶ ÷ 3²
  Law 2: 3⁶⁻² = 3⁴ = 81

Example 3: Simplify (5²)³
  Law 3: 5²ˣ³ = 5⁶ = 15 625

Example 4: Simplify (2³ × 2⁴) ÷ 2⁵
  Step 1 (Law 1): 2³ × 2⁴ = 2⁷
  Step 2 (Law 2): 2⁷ ÷ 2⁵ = 2² = 4

Example 5: Simplify (3² × 3³)²
  Step 1: 3² × 3³ = 3⁵
  Step 2: (3⁵)² = 3¹⁰

Example 6: Simplify 4⁰ + 3² − 2¹
  = 1 + 9 − 2 = 8

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ COMMON MISTAKES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✗ Wrong: 2³ × 3³ = 6⁶   (you can ONLY use Law 1 when bases are SAME)
✓ Right: 2³ × 3³ = 8 × 27 = 216   OR use Law 5: (2×3)³ = 6³ = 216

✗ Wrong: (2³)⁴ = 2³⁺⁴ = 2⁷
✓ Right: (2³)⁴ = 2³ˣ⁴ = 2¹²

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Simplify (leave in exponential form where possible):
1. 5³ × 5⁴
2. 7⁸ ÷ 7³
3. (4³)²
4. (2⁵ × 2³) ÷ 2⁴
5. 3⁰ + 2³ − 4¹
6. (3 × 4)² [expand using Law 5]

✅ ANSWERS
1. 5⁷
2. 7⁵
3. 4⁶
4. 2⁸ ÷ 2⁴ = 2⁴ = 16
5. 1 + 8 − 4 = 5
6. 3² × 4² = 9 × 16 = 144`,
        },
        {
          title: "Squares, Cubes and Their Roots",
          order: 11,
          duration: 30,
          content: `🎯 WHAT YOU WILL LEARN
• What perfect squares and perfect cubes are
• How to find square roots and cube roots
• How to identify when a number is a perfect square or cube

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 PERFECT SQUARES AND SQUARE ROOTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A PERFECT SQUARE is a number that is the square of a whole number.
  1² = 1    2² = 4    3² = 9    4² = 16    5² = 25
  6² = 36   7² = 49   8² = 64   9² = 81   10² = 100
  11² = 121  12² = 144  13² = 169  14² = 196  15² = 225

The SQUARE ROOT (√) is the reverse operation:
  √16 = 4   because   4² = 16
  √81 = 9   because   9² = 81
  √144 = 12 because  12² = 144

⚠️ Note: √ symbol means the POSITIVE square root.
   Every positive number has TWO square roots: +4 and −4 are both roots of 16,
   but √16 = 4 (the positive one).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 PERFECT CUBES AND CUBE ROOTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A PERFECT CUBE is a number that is the cube of a whole number.
  1³ = 1    2³ = 8    3³ = 27   4³ = 64   5³ = 125
  6³ = 216  7³ = 343  8³ = 512  9³ = 729  10³ = 1000

The CUBE ROOT (∛) reverses this:
  ∛8 = 2    because  2³ = 8
  ∛125 = 5  because  5³ = 125
  ∛1000 = 10 because 10³ = 1000

Cube roots of negative numbers ARE real:
  ∛(−27) = −3   because  (−3)³ = −27

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: Evaluate √169
  Find: what number squared = 169?
  13² = 169  ✓
  Answer: √169 = 13

Example 2: Evaluate ∛343
  Find: what number cubed = 343?
  7³ = 343  ✓
  Answer: ∛343 = 7

Example 3: Simplify √(4 × 9)
  Method 1: √36 = 6
  Method 2: √4 × √9 = 2 × 3 = 6 ✓

Example 4: Simplify ∛(8 × 27)
  ∛8 × ∛27 = 2 × 3 = 6

Example 5: Calculate 3√25 − 2∛64
  = 3(5) − 2(4) = 15 − 8 = 7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. List all perfect squares between 50 and 150.
2. Evaluate: a) √196    b) ∛512    c) √(9 × 25)
3. Is 72 a perfect square? Explain.
4. Is 216 a perfect cube? Explain.
5. Calculate: 2√49 + 3∛27 − √16

✅ ANSWERS
1. 64, 81, 100, 121, 144
2. a) 14   b) 8   c) √225 = 15
3. No — √72 ≈ 8.49, not a whole number. 72 = 8 × 9, and 9 is a perfect square but 8 is not.
4. Yes — 216 = 6³
5. 2(7) + 3(3) − 4 = 14 + 9 − 4 = 19`,
        },
      ],
      assignment: {
        title: "Exponents Challenge",
        description: `SECTION A (1 mark each)
1. What is 3⁰?   A) 0    B) 1    C) 3    D) 9

2. Simplify 2⁴ × 2³:   A) 4⁷    B) 2⁷    C) 2¹²    D) 2¹

3. What is √225?   A) 11    B) 12    C) 15    D) 25

SECTION B — Simplify (2 marks each, show all steps)
4. (3³ × 3²) ÷ 3⁴
5. (2² × 5)³
6. Evaluate: −(−4)² + ∛125 × 2⁰

SECTION C — Problem Solving (3 marks each)
7. A bacteria culture doubles every hour. If there are currently 2³ bacteria, write an expression for the number of bacteria after 4 more hours. Evaluate your answer.

8. A square garden has an area of 196 m². A cubic water tank has a volume of 1000 litres (1000 = 10³).
   a) What is the side length of the garden?
   b) What is the side length of the water tank?`,
        dueDate: 14,
        maxScore: 20,
        weight: 1.5,
      },
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // SECTION 4 — PATTERNS AND SEQUENCES
    // ─────────────────────────────────────────────────────────────────────────────
    {
      name: "Numeric and Geometric Patterns",
      order: 4,
      lessons: [
        {
          title: "Number Sequences",
          order: 12,
          duration: 30,
          content: `🎯 WHAT YOU WILL LEARN
• How to identify and extend number sequences
• The difference between arithmetic and geometric sequences
• How to describe a sequence in words

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 KEY CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A SEQUENCE is a list of numbers that follow a pattern.
Each number in the sequence is called a TERM.
  T₁ = first term    T₂ = second term    T₃ = third term …

ARITHMETIC SEQUENCE: Each term is found by ADDING (or subtracting) the same number.
  This number is called the COMMON DIFFERENCE (d).
  Example: 3, 7, 11, 15, 19, …   →   d = +4

GEOMETRIC SEQUENCE: Each term is found by MULTIPLYING (or dividing) by the same number.
  This number is called the COMMON RATIO (r).
  Example: 2, 6, 18, 54, …   →   r = ×3

OTHER SEQUENCES:
  Square numbers: 1, 4, 9, 16, 25, …   (Tₙ = n²)
  Cubic numbers:  1, 8, 27, 64, 125, … (Tₙ = n³)
  Fibonacci:      1, 1, 2, 3, 5, 8, 13, …  (each term = sum of two before it)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: Identify the type and find the next 3 terms:   5, 8, 11, 14, …
  Differences: +3, +3, +3 → ARITHMETIC, d = 3
  Next terms: 17, 20, 23

Example 2: Identify the type and find the next 3 terms:   3, 6, 12, 24, …
  Ratios: ×2, ×2, ×2 → GEOMETRIC, r = 2
  Next terms: 48, 96, 192

Example 3: Find the missing terms:   2, __, 18, __, 50
  Check if arithmetic: differences would be 18 − 2 = 16 over 2 steps → d = 8
  T₂ = 2 + 8 = 10     T₄ = 18 + 8 = 26
  Verify: 26 + 8 ≠ 50 → NOT arithmetic
  Check if quadratic: 2 = 1²+1, 18 = 4²+2? No. Try: Tₙ = 2n²
  T₁ = 2(1) = 2, T₂ = 2(4) = 8, T₃ = 2(9) = 18, T₄ = 2(16) = 32, T₅ = 2(25) = 50 ✓
  Missing terms: 8 and 32

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. State whether arithmetic or geometric. Find the next 3 terms:
   a) 10, 13, 16, 19, …
   b) 1, 3, 9, 27, …
   c) 100, 50, 25, …

2. Find the missing terms:  __, 7, __, 13, 16

3. Is the sequence 1, 4, 9, 16, 25 arithmetic or geometric? Explain.

✅ ANSWERS
1. a) Arithmetic, d=3: 22, 25, 28
   b) Geometric, r=3: 81, 243, 729
   c) Geometric, r=½: 12.5, 6.25, 3.125

2. 4, 7, 10, 13, 16 → d = 3, missing terms: 4 and 10

3. Neither! Differences: 3, 5, 7, 9 (not constant → not arithmetic)
   Ratios: 4, 9/4, 16/9 (not constant → not geometric)
   It is the sequence of perfect squares: Tₙ = n²`,
        },
        {
          title: "Geometric Patterns",
          order: 13,
          duration: 35,
          content: `🎯 WHAT YOU WILL LEARN
• How to analyse patterns made of shapes or diagrams
• How to complete a table of values from a visual pattern
• How to find the number of elements in any figure

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 KEY CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A GEOMETRIC PATTERN shows figures that grow according to a rule.
To analyse it:
  Step 1: Count the elements (dots, sticks, tiles) in each figure.
  Step 2: Record in a table (Figure number | Number of elements).
  Step 3: Find the pattern — what is being added each time?
  Step 4: Write a description in words.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: MATCHSTICK TRIANGLES
  Figure 1: △  → 3 matchsticks
  Figure 2: △△ (shared side) → 5 matchsticks
  Figure 3: △△△ → 7 matchsticks
  Figure 4: → 9 matchsticks

  Table:
  | Figure (n) | 1 | 2 | 3 | 4 |
  | Sticks     | 3 | 5 | 7 | 9 |
  Difference: +2 each time (arithmetic!)

  Description: "Start with 3 sticks, add 2 sticks for each new triangle."

Example 2: DOT PATTERNS (growing L-shapes)
  Figure 1: • → 1 dot
  Figure 2: • •
            •   → 3 dots
  Figure 3: • • •
            • •
            •   → 6 dots
  Figure 4: → 10 dots

  Table:
  | Figure (n) | 1 | 2 | 3 |  4 |
  | Dots       | 1 | 3 | 6 | 10 |
  1st differences: 2, 3, 4 (growing)
  2nd differences: 1, 1 (constant → quadratic pattern!)
  Pattern: triangular numbers: Tₙ = n(n+1)/2

Example 3: TILE BORDERS
  A 1×1 tile has a border of 8 unit edges.
  A 2×2 tile has a border of 12 unit edges.
  A 3×3 tile has a border of 16 unit edges.

  | Size n | 1 |  2 |  3 |  4 |
  | Border | 8 | 12 | 16 | 20 |
  Difference: +4 each time.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Matchstick squares are arranged in a row.
   Figure 1 (single square): 4 sticks
   Figure 2 (two squares in a row): 7 sticks
   Figure 3: 10 sticks

   a) Complete the table for Figures 1–5.
   b) How many sticks in Figure 10?
   c) Describe the pattern in words.

2. A pattern of dots forms a cross shape:
   Figure 1: 1 dot in centre = 1 dot
   Figure 2: centre + 4 arms of 1 = 5 dots
   Figure 3: centre + 4 arms of 2 = 9 dots

   a) Complete the table for Figures 1–5.
   b) How many dots in Figure 8?

✅ ANSWERS
1. a) 4, 7, 10, 13, 16   b) 4 + 9(3) = 4 + 27 = 31 sticks
   c) Start with 4 sticks, add 3 for each new square.

2. a) 1, 5, 9, 13, 17   b) 1 + 4(7) = 29 dots`,
        },
        {
          title: "The General Rule — Finding the nth Term",
          order: 14,
          duration: 40,
          content: `🎯 WHAT YOU WILL LEARN
• How to write a formula for the nth term of a sequence
• How to use the formula to find any term quickly
• How to find which term has a given value

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 KEY CONCEPT: THE nth TERM FORMULA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Instead of counting up one by one, a FORMULA lets us jump to any term directly.
  "Find the 100th term" → impossible to count up; easy with a formula.

FOR ARITHMETIC SEQUENCES:
  Tₙ = a + (n − 1)d
  where:   a = first term (T₁)
           d = common difference
           n = the term number you want

OR equivalently: Tₙ = dn + c   where c = a − d

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ WORKED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example 1: Find the nth term of:  4, 7, 10, 13, …
  a = 4,   d = 3
  Tₙ = a + (n − 1)d = 4 + (n − 1)(3) = 4 + 3n − 3 = 3n + 1
  Formula: Tₙ = 3n + 1

  Verify:  T₁ = 3(1) + 1 = 4 ✓    T₃ = 3(3) + 1 = 10 ✓

  Find T₅₀: T₅₀ = 3(50) + 1 = 151

Example 2: Find the nth term of:  5, 3, 1, −1, −3, …
  a = 5,   d = −2
  Tₙ = 5 + (n − 1)(−2) = 5 − 2n + 2 = 7 − 2n
  Formula: Tₙ = 7 − 2n

  Verify:  T₁ = 7 − 2 = 5 ✓    T₄ = 7 − 8 = −1 ✓

  Find T₂₀: T₂₀ = 7 − 40 = −33

Example 3: Which term of the sequence 2, 5, 8, 11, … equals 101?
  Tₙ = 3n − 1   (you can verify: a=2, d=3)
  Set: 3n − 1 = 101
       3n = 102
       n = 34
  Answer: T₃₄ = 101

Example 4: Using a table to find the rule (matchstick squares from previous lesson)
  | n  | 1 | 2 | 3  | 4  |
  | Tₙ | 4 | 7 | 10 | 13 |
  d = 3 (constant difference)
  c = T₁ − d = 4 − 3 = 1
  Rule: Tₙ = 3n + 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRACTICE QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Find the nth term formula for each sequence:
   a) 6, 10, 14, 18, …
   b) 20, 17, 14, 11, …
   c) 1, 4, 7, 10, …

2. Using your formula in 1a, find the 30th term.

3. The sequence 3n + 2: Find T₁, T₅, and T₁₀.

4. Which term of the sequence 5, 9, 13, 17, … is equal to 89?

5. A pattern of dots grows as follows: n = 1: 3 dots; n = 2: 5 dots; n = 3: 7 dots.
   a) Write the nth term formula.
   b) How many dots are in the 20th figure?
   c) Which figure has 41 dots?

✅ ANSWERS
1. a) d=4, Tₙ = 4n + 2
   b) d=−3, Tₙ = 23 − 3n
   c) d=3, Tₙ = 3n − 2

2. T₃₀ = 4(30) + 2 = 122

3. T₁=5, T₅=17, T₁₀=32

4. 4n + 1 = 89 → 4n = 88 → n = 22 → T₂₂ = 89

5. a) Tₙ = 2n + 1
   b) T₂₀ = 41
   c) 2n + 1 = 41 → n = 20`,
        },
      ],
      assignment: {
        title: "Patterns Investigation Task",
        description: `INSTRUCTIONS: Show all working. Include a table of values where needed.

QUESTION 1 — Number Sequences (8 marks)
a) For each sequence, write the next 3 terms and state the type (arithmetic/geometric/other):
   (i)  2, 5, 8, 11, …
   (ii) 1, 2, 4, 8, 16, …
   (iii) 100, 90, 81, 73, …   (Hint: look at the differences)

b) Find the nth term formula for:  7, 12, 17, 22, …

c) Which term of the sequence in (b) equals 102?

QUESTION 2 — Geometric Patterns (10 marks)
A teacher creates a pattern using white and grey square tiles.

Figure 1: 1 grey tile surrounded by 8 white tiles → 9 tiles total
Figure 2: 4 grey tiles (2×2) surrounded by 12 white tiles → 16 tiles total
Figure 3: 9 grey tiles (3×3) surrounded by 16 white tiles → 25 tiles total

a) Complete the table:
   | Figure n | Grey tiles | White tiles | Total tiles |
   |    1     |     1      |      8      |      9      |
   |    2     |     4      |     12      |     16      |
   |    3     |     9      |     16      |     25      |
   |    4     |            |             |             |
   |    5     |            |             |             |

b) Write the nth term formula for: (i) grey tiles  (ii) white tiles  (iii) total tiles

c) How many white tiles will there be in Figure 20?

d) Which figure number has exactly 100 grey tiles?`,
        dueDate: 21,
        maxScore: 25,
        weight: 2.0,
      },
    },
  ],
};
