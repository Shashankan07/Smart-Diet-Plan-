# Project Rules & Subscription Logic

## Admin Access
- **Primary Admin**: `shashankanshashankan16@gmail.com`
- Admins have full access to all features regardless of subscription status.

## Subscription Tiers & Restrictions

### Free User
- **AI Neural Scan**: Disabled (No access).
- **History**: Limited to the last 2 days only.
- **AI Coach**: Disabled (No access).

### Pro Plan
- **Pricing**: ₹150 per month OR ₹300 for 3 months (Recommended).
- **AI Neural Scan**: 35-40 scans per month.
- **AI Coach**: 20 hours of access per month.

### Elite Plan
- **AI Neural Scan**: 200-250 scans per month.
- **AI Coach**: Unlimited 24/7 access.

## Implementation Guidelines
- When implementing feature gates, always check if the user is the Admin email (`shashankanshashankan16@gmail.com`) first.
- Subscription status should be verified before allowing access to the Scanner, History beyond 2 days, or the AI Coach.
