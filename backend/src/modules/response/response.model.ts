import mongoose from 'mongoose';



const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true
  },
  selectedOption: {
    type: String,
    required: true
  }
})


const responseSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll"
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  anonymousId: {
    type: String,
  },
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      optionId: mongoose.Schema.Types.ObjectId
    }
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  }
}, {timestamps: true})


const responseModel = mongoose.model("Response", responseSchema);
export default responseModel;
