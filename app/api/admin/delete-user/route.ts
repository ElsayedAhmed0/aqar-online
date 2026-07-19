import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user: requester }, error: tokenError } = await supabaseAdmin.auth.getUser(token);

    if (tokenError || !requester) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: requesterProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", requester.id)
      .single();

    if (requesterProfile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden — admins only" }, { status: 403 });
    }

    if (requester.id === userId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    // ✅ نفضّي عمود user_id في إعلاناته القديمة (تفضل موجودة بس من غير مالك)
    await supabaseAdmin.from("listings").update({ user_id: null }).eq("user_id", userId);

    // ✅ نمسح أي سجل partner مرتبط بيه (لو موجود)
    await supabaseAdmin.from("partners").delete().eq("user_id", userId);

    // ✅ نمسح أي سجل developer مرتبط بيه (لو موجود) — ده اللي كان ناقص
    await supabaseAdmin.from("developers").delete().eq("user_id", userId);

    // ✅ أهم تعديل: نمسح الحساب من auth.users الأول، وقبل ما نلمس profiles خالص
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      // ❌ لو فشل، منمسحش profiles خالص — الحساب يفضل ظاهر في اللوحة عشان نلاحظ المشكلة فورًا
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // ✅ منمسح profiles إلا بعد التأكد إن الحساب فعلاً اتمسح من auth.users
    await supabaseAdmin.from("profiles").delete().eq("id", userId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}