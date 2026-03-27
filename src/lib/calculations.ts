export interface PrizePoolAllocation {
  totalRevenue: number;
  charityAllocation: number;
  prizePool: {
    total: number;
    match5Jackpot: number; // 40%
    match4Jackpot: number; // 35%
    match3Jackpot: number; // 25%
  };
}

/**
 * Calculates the monthly prize pool allocations based on total subscription revenue.
 * 
 * @param totalRevenue The total subscription revenue for the month
 * @param charityPercentage The percentage to allocate to charity (defaults to 10% / 0.10)
 * @returns PrizePoolAllocation containing exact dollar amounts for each tier
 */
export function calculateMonthlyPrizePool(
  totalRevenue: number,
  charityPercentage: number = 0.10
): PrizePoolAllocation {
  if (totalRevenue < 0) {
    throw new Error("Total revenue cannot be negative");
  }

  // Ensure charity contribution is AT LEAST 10%
  const actualCharityPercentage = Math.max(charityPercentage, 0.10);
  const charityAllocation = totalRevenue * actualCharityPercentage;

  // The remaining revenue constitutes the total prize pool
  // (Assuming operating system costs are zero for the sake of this pure calculation)
  const totalPrizePool = totalRevenue - charityAllocation;

  return {
    totalRevenue,
    charityAllocation,
    prizePool: {
      total: totalPrizePool,
      match5Jackpot: totalPrizePool * 0.40,
      match4Jackpot: totalPrizePool * 0.35,
      match3Jackpot: totalPrizePool * 0.25,
    },
  };
}
