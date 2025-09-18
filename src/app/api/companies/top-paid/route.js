import getDb from "@/app/utils/mongodb";

export async function GET(request) {
  try {
    const db = await getDb();
    const coll = db.collection("companies");

    // Parse query params
    const { searchParams } = new URL(request.url);
    let limit = parseInt(searchParams.get("limit")) || 5;

    // Keep limit safe (max 50)
    if (limit > 50) limit = 50;

    // Query: sort by baseSalary descending
    const companies = await coll
      .find({})
      .sort({ baseSalary: -1 }) // -1 = descending
      .limit(limit)
      .toArray();

    return Response.json(companies);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
