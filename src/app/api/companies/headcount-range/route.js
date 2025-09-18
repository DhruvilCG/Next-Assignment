import getDb from "@/app/utils/mongodb";

export async function GET(request) {
  try {
    const db = await getDb();
    const coll = db.collection("companies");

    const { searchParams } = new URL(request.url);
    const min = parseInt(searchParams.get("min")) || 0;
    const max = searchParams.get("max") ? parseInt(searchParams.get("max")) : null;

    // Build query filter
    const filter = { headcount: { $gte: min } };
    if (max !== null) filter.headcount.$lte = max;

    // Fetch companies
    const companies = await coll.find(filter).toArray();

    return Response.json(companies);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
