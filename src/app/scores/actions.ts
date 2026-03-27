"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function submitScore(formData: FormData) {
  const supabase = await createClient();

  // 1. Get the currently authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const scoreValue = parseInt(formData.get("score_value") as string, 10);

  // 2. Validate score range
  if (isNaN(scoreValue) || scoreValue < 1 || scoreValue > 45) {
    redirect("/scores?message=Score must be a number between 1 and 45");
  }

  // 3. Insert the new score — the DB trigger will auto-delete oldest if > 5
  const { error: insertError } = await supabase
    .from("scores")
    .insert({ user_id: user.id, score_value: scoreValue });

  if (insertError) {
    redirect("/scores?message=" + insertError.message);
  }

  // 4. Revalidate the page to reflect new DB state
  revalidatePath("/scores");
  revalidatePath("/dashboard");
}
