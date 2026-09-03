import mongoose from "mongoose";


interface IUsage {
  userId: mongoose.Types.ObjectId;
  periodStart: Date;
  periodEnd: Date;
  pollsCreated: number;
  responseReceived: number;
}


const usageSchema = new mongoose.Schema<IUsage>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  periodStart: {
    type: Date,
  },
  periodEnd: {
    type: Date,
  },
  pollsCreated: {
    type: Number,
    required: [true, "poll_created is required"],
  },
  
}, {timestamps: true});



const usageModel = mongoose.model("Usage", usageSchema);
export default usageModel;
