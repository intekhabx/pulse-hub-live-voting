import { createContext, useState, type PropsWithChildren } from "react";
import toast from "react-hot-toast";
import pollService from "../services/pollService";



export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 300;
export const MAX_OPTIONS = 8;
export const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

type Question = {
  questionText: string;
  required: boolean;
  options: { optionText: string }[];
};

type Errors = {
  title?: string;
  questions?: { [key: number]: { text?: string; options?: string } };
};


type PollCreationContextType = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;

  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;

  allowAnonymous: boolean;
  setAllowAnonymous: React.Dispatch<React.SetStateAction<boolean>>;

  expiresAt: string;
  setExpiresAt: React.Dispatch<React.SetStateAction<string>>;

  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;

  isCreating: boolean;
  isSavingDraft: boolean;

  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;

  handleSubmit: ({setActive}: {setActive: (s: string)=> void})=> void;
  handleSaveAsDraft: ({setActive}: {setActive: (s: string)=> void})=> void;
  handleCancel: ({setActive}: {setActive: (s: string)=> void})=> void;

  addQuestion: () => void;
  removeQuestion: (index: number) => void;
  addOption: (index: number) => void;
  removeOption: (qIndex: number, oIndex: number) => void;

  totalQuestions: number;
  filledQuestions: number;
}


export const PollCreationContext = createContext<PollCreationContextType | null>(null);





const PollCreationContextProvider = ({ children }: PropsWithChildren) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { questionText: "", required: false, options: [{ optionText: "" }, { optionText: "" }] }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);


  const totalQuestions = questions.length;
  const filledQuestions = questions.filter(q => q.questionText.trim() && q.options.filter(o => o.optionText.trim()).length >= 2).length;


  const isDirty =
    title.trim() !== "" ||
    description.trim() !== "" ||
    expiresAt !== "" ||
    questions.some(q => q.questionText.trim() !== "" || q.options.some(o => o.optionText.trim() !== ""));

  const validate = (): { valid: boolean; cleanedQuestions: Question[] } => {
    const newErrors: Errors = { questions: {} };
    let valid = true;

    if (!title.trim()) {
      newErrors.title = "Poll title is required";
      valid = false;
    } else if (title.length > TITLE_MAX) {
      newErrors.title = `Title must be under ${TITLE_MAX} characters`;
      valid = false;
    }

    const cleanedQuestions = questions.map((q, qi) => {
      const cleanedOptions = q.options.filter(o => o.optionText.trim() !== "");
      const qErrors: { text?: string; options?: string } = {};

      if (!q.questionText.trim()) {
        qErrors.text = "Question text is required";
        valid = false;
      }
      if (cleanedOptions.length < 2) {
        qErrors.options = "At least 2 options are required";
        valid = false;
      }

      if (Object.keys(qErrors).length > 0) {
        newErrors.questions![qi] = qErrors;
      }

      return { ...q, options: cleanedOptions };
    });

    setErrors(newErrors);
    return { valid, cleanedQuestions };
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAllowAnonymous(true);
    setExpiresAt("");
    setQuestions([{ questionText: "", required: false, options: [{ optionText: "" }, { optionText: "" }] }]);
    setErrors({});
  };

  const handleSubmit = async ({setActive}: {setActive: (s: string)=> void}) => {
    const { valid, cleanedQuestions } = validate();
    if (!valid) {
      toast.error("Please fix the highlighted fields before submitting");
      return;
    }

    setIsCreating(true);
    try {
      await pollService.createPoll({
        title: title.trim(),
        description: description.trim(),
        allowAnonymous,
        expiresAt,
        questions: cleanedQuestions,
      });
      toast.success("Poll created successfully");
      resetForm();
      setActive("polls"); // redirect to the mypolls section
    } 
    catch (error: any) {
      console.error(error.response);
      toast.error(error?.response?.data.message || error?.response?.data?.error[0]?.received || "Something went wrong while creating the poll");
    } 
    finally {
      setIsCreating(false);
    }
  };


  const handleSaveAsDraft = async ({setActive}: {setActive: (s: string)=> void}) => {
    const { valid, cleanedQuestions } = validate();
    if (!valid) {
      toast.error("Please fix the highlighted fields before saving");
      return;
    }
  
    setIsSavingDraft(true);
    try {
      await pollService.createPollAsDraft({
        title: title.trim(),
        description: description.trim(),
        allowAnonymous,
        expiresAt,
        questions: cleanedQuestions,
      });
      toast.success("Poll saved as draft");
      resetForm();
      setActive("polls"); //redirect to pollSection
    } 
    catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong while saving the draft");
    } 
    finally {
      setIsSavingDraft(false);
    }
  };


  const handleCancel = ({setActive}: {setActive: (s: string)=> void}) => {
    if (isDirty && !window.confirm("Discard this poll? Your changes will be lost.")) {
      return;
    }
    resetForm();
    setActive("overview"); //redirect to overview section
  };

  const addQuestion = () =>
    setQuestions(q => [...q, { questionText: "", required: false, options: [{ optionText: "" }, { optionText: "" }] }]);

  const removeQuestion = (i: number) => setQuestions(q => q.filter((_, idx) => idx !== i));

  const addOption = (qi: number) =>
    setQuestions(q => q.map((qu, i) => (i === qi ? { ...qu, options: [...qu.options, { optionText: "" }] } : qu)));

  const removeOption = (qi: number, oi: number) =>
    setQuestions(q => q.map((qu, i) => (i === qi ? { ...qu, options: qu.options.filter((_, j) => j !== oi) } : qu)));


  const valueObj = {
    title, setTitle, description, setDescription, allowAnonymous, setAllowAnonymous, expiresAt, setExpiresAt,
    questions, setQuestions, isCreating, errors, setErrors, isSavingDraft, 
    handleSubmit, handleSaveAsDraft, handleCancel,
    addQuestion, removeQuestion, removeOption, addOption,
    totalQuestions, filledQuestions,
  }

  return (
    <PollCreationContext.Provider value={valueObj}>
      {children}
    </PollCreationContext.Provider>
  )
}


export default PollCreationContextProvider;
