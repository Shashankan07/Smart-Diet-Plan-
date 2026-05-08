# Security Specification - NutriSense AI

## 1. Data Invariants
- A user can only access and modify their own profile in `users/{userId}`.
- Meal logs and Water logs must belong to the user who created them (`userId` field).
- Users can only read and write logs where `userId` matches their `auth.uid`.
- Timestamps must be server-generated (`request.time`).
- Food names, calories, and water amounts must be within reasonable bounds.

## 2. The "Dirty Dozen" Payloads

1. **Identity Theft (Profile)**: Attempting to update another user's profile.
2. **Shadow Field (Profile)**: Adding `isAdmin: true` to a profile update.
3. **Orphan Log**: Creating a meal log with a `userId` that doesn't match the active user.
4. **Massive Intake**: Logging 1,000,000,000 calories in a single meal.
5. **Backdated Log**: Sending a client-side timestamp from 2010.
6. **Negative Water**: Logging -500ml of water.
7. **Cross-User Query**: Querying `mealLogs` without a `userId` filter (should be blocked by `allow list`).
8. **Invalid ID Poisoning**: Injected junk characters in a document ID.
9. **Role Escalation**: Attempting to set `subscriptionStatus` to 'pro' when it should be managed by a system process (though current code allows setting it to 'free' at login).
10. **Shadow Update (Log)**: Adding a field `verifiedByAI: true` to a log via client SDK when not specified in schema.
11. **Malicious Serving Size**: Sending a 1MB string as `servingSize`.
12. **Status Lock Bypass**: If terminal states existed, trying to change them.

## 3. Test Runner (Draft Rules First)
The rules will be written to `firestore.rules`.
