import getDb from "@/app/utils/mongodb";

export async function GET(_request, { params }) {
  try {
    const db = await getDb();
    const coll = db.collection("companies");

    const { location } = params;

    // Case-insensitive match on "location"
    const companies = await coll
      .find({ location: { $regex: location, $options: "i" } })
      .toArray();

    return Response.json(companies);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
