// Centralized Developer Engine Gate for Phase 1 vs Phase 2
export const DEVELOPER_ENGINE = {
  // Activated by developer when Phase 2 payment is confirmed
  IS_PHASE_2_PAYMENT_CONFIRMED: process.env.NEXT_PUBLIC_ENABLE_PHASE_2 === 'true',
};

export function checkPhase2Access(): { allowed: boolean; message?: string } {
  if (!DEVELOPER_ENGINE.IS_PHASE_2_PAYMENT_CONFIRMED) {
    return {
      allowed: false,
      message: 'This GIS & Permit module is scheduled for Phase 2 deployment.',
    };
  }
  return { allowed: true };
}