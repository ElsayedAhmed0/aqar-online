import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // ✅ 1. هات التوكن من الهيدر (مبعوت من المتصفح)
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 2. عميل بصلاحيات كاملة (Service Role) — هنستخدمه في كل حاجة
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ✅ 3. تحقق من التوكن ده فعلاً بتاع مين
    const { data: { user: requester }, error: tokenError } = await supabaseAdmin.auth.getUser(token);

    if (tokenError || !requester) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 4. تأكد إنه أدمن فعليًا
    const { data: requesterProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", requester.id)
      .single();

    if (requesterProfile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden — admins only" }, { status: 403 });
    }

    // ✅ 5. حماية من حذف النفس بالغلط
    if (requester.id === userId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

 // ✅ نفضّي عمود user_id في إعلاناته القديمة (تفضل موجودة بس من غير مالك)
    await supabaseAdmin.from("listings").update({ user_id: null }).eq("user_id", userId);

    // نمسح أي سجل partner مرتبط بيه الأول (لو موجود)
    await supabaseAdmin.from("partners").delete().eq("user_id", userId);

    // نمسح صف الـ profile
    await supabaseAdmin.from("profiles").delete().eq("id", userId);

    // وأخيرًا نمسح الحساب نفسه من نظام تسجيل الدخول
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}