/**
 * Pricing stays hidden until the paid plan is ready; the waitlist is the only
 * call to action. Set `VITE_SHOW_PRICING=true` to bring it back.
 */
export const SHOW_PRICING = import.meta.env.VITE_SHOW_PRICING === 'true'

/**
 * The footer's social links stay hidden until the profiles exist. Set
 * `VITE_SHOW_SOCIAL_LINKS=true` to show them.
 */
export const SHOW_SOCIAL_LINKS =
  import.meta.env.VITE_SHOW_SOCIAL_LINKS === 'true'
