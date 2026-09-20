import mongoose from "mongoose";


interface ISubscription {
  userId: mongoose.Types.ObjectId,
  plan: "PRO" | "PREMIUM",
  status: "CREATED" | "ACTIVE" | "HALTED" | "CANCELLED" | "EXPIRED" | "COMPLETED" | "UPGRADED",
  provider: "RAZORPAY",
  providerPlanId: string,
  providerSubscriptionId: string,
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
    enum: ["CREATED", "ACTIVE", "HALTED", "CANCELLED", "EXPIRED", "COMPLETED", "UPGRADED"],
    default: "CREATED",
  },
  provider: {
    type: String,
    enum: ["RAZORPAY"],
    default: "RAZORPAY",
    required: true,
  },
  providerPlanId: {
    type: String,
    required: true
  },
  providerSubscriptionId: {
    type: String,
    required: [true, "provider_subscription_id is required"],
    unique: true,
  },
  currentPeriodStart: {
    type: Date,
  },
  currentPeriodEnd: {
    type: Date,
  }

}, {timestamps: true});



const subscriptionModel = mongoose.model("Subscription", subscriptionSchema);
export default subscriptionModel;
