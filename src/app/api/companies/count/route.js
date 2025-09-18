import getDb from "@/app/utils/mongodb";

export async function GET(request) {
  try {
    const db = await getDb(); // ✅ directly get "test" DB
    const coll = db.collection("companies");

    // Query params
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const location = searchParams.get("location");
    const skill = searchParams.get("skill");

    // Filters
    const filters = {};
    if (name) filters.name = { $regex: name, $options: "i" };
    if (location) filters.location = { $regex: location, $options: "i" };
    if (skill) filters.skills = { $regex: skill, $options: "i" };

    // Count docs
    const total = await coll.countDocuments(filters);

    return Response.json({ total });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
