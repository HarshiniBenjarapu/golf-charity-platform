import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { createClient } from "@/utils/supabase/server";

// POST /api/draws/simulate — picks 5 winning numbers from real user scores
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const action = body.action; // "simulate" | "publish"

    if (action === "simulate") {
      // 1. Pull all distinct score_value entries from the scores table
      const { data: scores, error } = await supabase
        .from("scores")
        .select("score_value");

      if (error) throw error;

      // 2. Build a pool of all submitted scores (may have duplicates, that's fine)
      const pool = scores?.map((s) => s.score_value) ?? [];

      // 3. If not enough scores exist, fall back to random numbers 1-45
      let winningNumbers: number[] = [];
      if (pool.length >= 5) {
        // Shuffle and pick 5 unique numbers from actual scores
        const shuffled = [...new Set(pool)].sort(() => Math.random() - 0.5);
        winningNumbers = shuffled.slice(0, 5).sort((a, b) => a - b);
      } else {
        // Fallback: pure random 1-45 if insufficient data
        const nums = new Set<number>();
        while (nums.size < 5) nums.add(Math.floor(Math.random() * 45) + 1);
        winningNumbers = [...nums].sort((a, b) => a - b);
      }

      // 4. Find how many users have all 5 winning numbers in their scores (exact match)
      const { data: allUserScores } = await supabase
        .from("scores")
        .select("user_id, score_value");

      const userScoreMap: Record<string, Set<number>> = {};
      allUserScores?.forEach(({ user_id, score_value }) => {
        if (!userScoreMap[user_id]) userScoreMap[user_id] = new Set();
        userScoreMap[user_id].add(score_value);
      });

      // Count winners by how many numbers they match
      const winningSet = new Set(winningNumbers);
      let match5 = 0, match4 = 0, match3 = 0;
      Object.values(userScoreMap).forEach((userNums) => {
        const matches = [...winningSet].filter((n) => userNums.has(n)).length;
        if (matches === 5) match5++;
        else if (matches === 4) match4++;
        else if (matches >= 3) match3++;
      });

      return NextResponse.json({
        winning_numbers: winningNumbers,
        winners: { match5, match4, match3 },
        total_users_checked: Object.keys(userScoreMap).length,
      });
    }

    if (action === "publish") {
      const { winning_numbers } = body;
      if (!winning_numbers || winning_numbers.length !== 5) {
        return NextResponse.json({ error: "Must provide 5 winning numbers" }, { status: 400 });
      }

      // Insert as a published draw record into the draws table
      const month = new Date();
      month.setDate(1); // Use first of the month as the month identifier

      const { data, error } = await supabase
        .from("draws")
        .insert({
          month: month.toISOString().split("T")[0],
          winning_numbers,
          status: "published",
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ message: "Draw published successfully!", draw: data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
