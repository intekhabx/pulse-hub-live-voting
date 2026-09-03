import mongoose from "mongoose";


interface ISubscription {
  userId: mongoose.Types.ObjectId,
  plan: "PRO" | "PREMIUM",
  status: "ACTIVE" | "CANCELLED" | "EXPIRED",
  provider: "RAZORPAY",
  providerSubscriptionId: String,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
}


const subscriptionSchema = new mongoose.Schema<ISubscription>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    // index: true,
  },
  plan: {
    type: String,
    enum: ["PRO", "PREMIUM"],
    required: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "CANCELLED", "EXPIRED"],
    default: "ACTIVE",
  },
  provider: {
    type: String,
    enum: ["RAZORPAY"],
    required: true,
  },
  providerSubscriptionId: {
    type: String,
    required: [true, "provider_subscription_id is required"],
    unique: true,
  },
  currentPeriodStart: {
    type: Date,
    required: [true, "subscription plan start date is required"],
  },
  currentPeriodEnd: {
    type: Date,
    required: [true, "subscription end date is required"],
  }

}, {timestamps: true});



const subscriptionModel = mongoose.model("Subscription", subscriptionSchema);
export default subscriptionModel;
