# Production Payment Integration Guide (India)

To make this app **automatically recognize payments**, you have two main paths:

## Path A: The "Free" Way (PhonePe Business)
**Best if you want 0% fees.**
1. **Setup**: Download the **PhonePe Business** app and complete your KYC.
2. **QR Code**: Use the "My QR" section in the app to get your permanent QR.
3. **Verification**: Since PhonePe doesn't give "Free" webhooks, you use **UTR Verification**:
   - The app asks the user for the **12-digit UTR/Transaction ID** after they pay.
   - You check your PhonePe Business app for that UTR.
   - You (as Admin) can then approve the user in your Firebase console.

## Path B: The "Automatic" Way (Razorpay)
**Best for professional automation (2% fee per transaction).**
1. **Sign Up**: Go to [razorpay.com](https://razorpay.com) and create an account.
2. **Add Account**: 
   - Go to **Settings** > **API Keys**.
   - Generate your `Key ID` and `Key Secret`.
   - Add your Bank Account details in **Settings** > **Bank Accounts** to receive money.
3. **Integration**:
   - Razorpay provides a "Payment Link" or "Standard Checkout".
   - When a user pays, Razorpay sends a **Webhook** to your backend.
   - The backend automatically updates the Firebase user status.

## How to add your Bank Account in Razorpay:
1. Login to Razorpay Dashboard.
2. Navigate to **Account & Settings**.
3. Under "Business Settings", click **Bank Accounts**.
4. Click **Add Bank Account** and enter your IFSC, Account Number, and Name.
5. Razorpay will deposit a small amount (e.g., ₹1) to verify your account.
6. Once verified, all payments from NutriSense AI will go directly here within T+2 days.

## 4. How to Approve Payments Manually (Path A)

If you are using the **Manual UTR Flow** (where users enter their Transaction ID):

1. **Get Notified**: Check your **PhonePe Business** app (or bank app) for the incoming amount and the **12-digit UTR/Transaction ID**.
2. **Open Firebase Console**: Go to the **Firestore Database** section in your Firebase project.
3. **Find the User**: Go to the `users` collection and find the user who just paid (you can search by their email or look for the `utr` they submitted).
4. **Approve**: 
   - Click on the user's document.
   - Look for the field `isPaid`.
   - Change it from `false` to `true`.
   - Ensure `pendingApproval` is set to `false`.
5. **Instant Result**: The app will instantly unlock all Premium features for that user!

## To fully automate this:
You will eventually need a **Payment Gateway** like Razorpay. It costs a 2% fee, but it eliminates the need for you to manually check your bank and update Firebase.
