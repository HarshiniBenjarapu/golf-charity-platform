"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function selectCharity(formData: FormData) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const charityId = formData.get("charity_id") as string;
  if (!charityId) redirect("/charity?message=Please select a charity");

  const { error } = await supabase
    .from("profiles")
    .update({ selected_charity_id: charityId })
    .eq("id", user.id);

  if (error) redirect("/charity?message=" + error.message);

  revalidatePath("/charity");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
