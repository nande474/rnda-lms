import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page:          { backgroundColor: "#ffffff", fontFamily: "Helvetica" },
  borderTop:     { height: 12, backgroundColor: "#1e5631" },
  borderBottom:  { height: 12, backgroundColor: "#6db33f" },
  body:          { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 48, paddingHorizontal: 60 },
  org:           { fontSize: 10, color: "#6db33f", letterSpacing: 3, marginBottom: 8 },
  heading:       { fontSize: 32, color: "#1e5631", marginBottom: 4 },
  subheading:    { fontSize: 11, color: "#888", letterSpacing: 2, marginBottom: 36 },
  presentedTo:   { fontSize: 11, color: "#999", marginBottom: 8 },
  studentName:   { fontSize: 28, color: "#1a3d28", marginBottom: 6 },
  nameLine:      { width: 300, height: 1, backgroundColor: "#6db33f", marginBottom: 28 },
  completedText: { fontSize: 11, color: "#666", marginBottom: 6 },
  courseTitle:   { fontSize: 18, color: "#1e5631", marginBottom: 6 },
  subjectGrade:  { fontSize: 10, color: "#888", marginBottom: 36 },
  divider:       { width: 60, height: 2, backgroundColor: "#6db33f", marginBottom: 28 },
  sealCircle:    { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: "#6db33f", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  sealText:      { fontSize: 7, color: "#6db33f", letterSpacing: 1, textAlign: "center" },
  footer:        { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 60, paddingBottom: 24 },
  footerItem:    { alignItems: "center" },
  footerLine:    { width: 120, height: 1, backgroundColor: "#ddd", marginBottom: 4 },
  footerLabel:   { fontSize: 9, color: "#aaa", letterSpacing: 1 },
  footerValue:   { fontSize: 9, color: "#555" },
});

const SUBJECTS: Record<string, string> = {
  MATHEMATICS:      "Mathematics",
  PHYSICAL_SCIENCE: "Physical Science",
  LIFE_SCIENCE:     "Life Science",
  COMPUTER_SCIENCE: "Computer Science",
  TECHNOLOGY:       "Technology",
};

function CertificateDoc({ name, courseTitle, subject, grade, issuedAt, certId }: {
  name: string; courseTitle: string; subject: string; grade: number; issuedAt: Date; certId: string;
}) {
  return (
    <Document title={`RNDA Certificate — ${courseTitle}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.borderTop} />
        <View style={styles.body}>
          <Text style={styles.org}>Regenerating Neighbourhood Development Agency</Text>
          <Text style={styles.heading}>Certificate of Achievement</Text>
          <Text style={styles.subheading}>RNDA Digital Academy · STEM Programme</Text>

          <Text style={styles.presentedTo}>This certificate is proudly presented to</Text>
          <Text style={styles.studentName}>{name}</Text>
          <View style={styles.nameLine} />

          <Text style={styles.completedText}>for successfully completing the course</Text>
          <Text style={styles.courseTitle}>{courseTitle}</Text>
          <Text style={styles.subjectGrade}>{SUBJECTS[subject] ?? subject} · Grade {grade}</Text>

          <View style={styles.divider} />
          <View style={styles.sealCircle}>
            <Text style={styles.sealText}>RNDA{"\n"}CERTIFIED</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <View style={styles.footerLine} />
            <Text style={styles.footerLabel}>ISSUED ON</Text>
            <Text style={styles.footerValue}>
              {new Date(issuedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <View style={styles.footerLine} />
            <Text style={styles.footerLabel}>AUTHORISED BY</Text>
            <Text style={styles.footerValue}>RNDA Administration</Text>
          </View>
          <View style={styles.footerItem}>
            <View style={styles.footerLine} />
            <Text style={styles.footerLabel}>CERTIFICATE ID</Text>
            <Text style={styles.footerValue}>{certId.slice(0, 12).toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.borderBottom} />
      </Page>
    </Document>
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cert = await db.certificate.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    include: {
      user:   { select: { name: true } },
      course: { select: { title: true, subject: true, grade: true } },
    },
  });

  if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });

  const buffer = await renderToBuffer(
    <CertificateDoc
      name={cert.user.name ?? "Learner"}
      courseTitle={cert.course.title}
      subject={cert.course.subject}
      grade={cert.course.grade}
      issuedAt={cert.issuedAt}
      certId={cert.id}
    />
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="RNDA-Certificate-${cert.course.title.replace(/\s+/g, "-")}.pdf"`,
    },
  });
}
