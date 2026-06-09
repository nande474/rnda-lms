import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { grade8Term1 } from "@/lib/curriculum/grade8-term1";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { pack } = await req.json();
  if (pack !== "grade8-term1") {
    return NextResponse.json({ error: "Unknown curriculum pack" }, { status: 400 });
  }

  const teacherId = session.user.id;
  const data = grade8Term1;

  // Avoid duplicate — check if course already exists
  const existing = await db.course.findFirst({
    where: { title: data.course.title, grade: data.course.grade },
  });
  if (existing) {
    return NextResponse.json({ error: "This curriculum has already been loaded." }, { status: 409 });
  }

  // Due dates are relative (days from now)
  const dueDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d;
  };

  // Create course
  const course = await db.course.create({
    data: {
      title:       data.course.title,
      description: data.course.description,
      subject:     data.course.subject,
      grade:       data.course.grade,
      teacherId,
      published:   true,
    },
  });

  let lessonCount      = 0;
  let assignmentCount  = 0;

  for (const sectionData of data.sections) {
    // Create section
    const section = await db.section.create({
      data: { name: sectionData.name, order: sectionData.order, courseId: course.id },
    });

    // Create lessons
    for (const lessonData of sectionData.lessons) {
      await db.lesson.create({
        data: {
          title:      lessonData.title,
          content:    lessonData.content,
          order:      lessonData.order,
          duration:   lessonData.duration,
          courseId:   course.id,
          sectionId:  section.id,
        },
      });
      lessonCount++;
    }

    // Create assignment
    const a = sectionData.assignment;
    await db.assignment.create({
      data: {
        title:       a.title,
        description: a.description,
        dueDate:     dueDate(a.dueDate),
        maxScore:    a.maxScore,
        weight:      a.weight,
        courseId:    course.id,
      },
    });
    assignmentCount++;
  }

  return NextResponse.json({
    ok: true,
    courseId: course.id,
    lessonCount,
    assignmentCount,
    sectionCount: data.sections.length,
  });
}
