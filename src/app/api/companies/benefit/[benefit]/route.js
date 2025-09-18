import getDb from "@/app/utils/mongodb"
export async function GET(_request, { params }) {
  try {
    const db = await getDb();
    const coll = db.collection("companies");

    const { benefit } = params;

    // Case-insensitive substring search inside benefits array
    const companies = await coll
      .find({ benefits: { $regex: benefit, $options: "i" } })
      .toArray();

    return Response.json(companies);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
