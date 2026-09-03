import mongoose from "mongoose";


const optionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: true,
  }
})


const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [
    optionSchema
  ],
  required: {
    type: Boolean,
    default: false
  }
})


const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: [true, "title is required"]
  },
  description: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questions: [
    questionSchema
  ],
  allowAnonymous: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ["draft", "active"],
    required: true
  },
  expiresAt: {
    type: Date
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  totalResponseReceived: {
    type: Number,
    required: true,
    default: 0,
  },

}, {timestamps: true});


const pollModel = mongoose.model("Poll", pollSchema);
export default pollModel;
