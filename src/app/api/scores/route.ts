import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { createClient } from "@supabase/supabase-js";

// Ensure you define these in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"; 

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, score_value } = body;

    // 1. Validation
    if (!user_id || typeof score_value !== "number") {
      return NextResponse.json(
        { error: "Missing user_id or score_value" },
        { status: 400 }
      );
    }

    if (score_value < 1 || score_value > 45) {
      return NextResponse.json(
        { error: "Score must be between 1 and 45" },
        { status: 400 }
      );
    }

    /* 
     * OPTION 1: Manual Application-Level Logic 
     * If you are NOT using the PostgreSQL Trigger from the schema, you can enforce the rule here.
     */
    const { data: currentScores, error: fetchError } = await supabase
      .from("scores")
      .select("id")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (fetchError) throw fetchError;

    // If user has 5 or more scores, delete oldest to make room for the new one (leaving 4)
    if (currentScores && currentScores.length >= 5) {
      const oldestScoreIds = currentScores.slice(4).map(s => s.id);
      
      const { error: deleteError } = await supabase
        .from("scores")
        .delete()
        .in("id", oldestScoreIds);

      if (deleteError) throw deleteError;
    }

    /* 
     * OPTION 2: Database-Level Logic (Trigger)
     * If you added the `enforce_max_scores_per_user` trigger to Supabase, 
     * you can skip the manual deletion above and just run the insert below.
     * The database will automatically prune the 6th+ oldest score!
     */

    // 2. Insert new score
    const { data: insertedScore, error: insertError } = await supabase
      .from("scores")
      .insert([{ user_id, score_value }])
      .select()
      .single();

    if (insertError) throw insertError;

    // 3. Return the latest 5 scores in reverse chronological order
    const { data: latestScores, error: finalFetchError } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (finalFetchError) throw finalFetchError;

    return NextResponse.json({
      message: "Score recorded successfully",
      score: insertedScore,
      latest_scores: latestScores, // Already in reverse chronological order
    });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
