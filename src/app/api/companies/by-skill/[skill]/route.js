import getDb from "@/app/utils/mongodb";

export async function GET(_request, { params }) {
  try {
    const db = await getDb();
    const coll = db.collection("companies");

    const { skill } = params;

    // Search inside hiringCriteria.skills array (case-insensitive)
    const companies = await coll
      .find({ "hiringCriteria.skills": { $regex: skill, $options: "i" } })
      .toArray();

    return Response.json(companies);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
