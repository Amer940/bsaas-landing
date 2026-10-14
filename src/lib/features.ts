/**
 * Pricing stays hidden until the paid plan is ready; the waitlist is the only
 * call to action. Set `VITE_SHOW_PRICING=true` to bring it back.
 */
export const SHOW_PRICING = import.meta.env.VITE_SHOW_PRICING === 'true'
