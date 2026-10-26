import React, { createContext, useEffect, useRef, useState, type FormEvent, type PropsWithChildren, type RefObject } from "react";
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


// AiAgent types***
type RequireInputSchema = {
  message: string;
  question: string;
  options: string[];
};

type FinalOutputSchema = {
  title: string;
  description: string;
  expiresAt: string;
  allowAnonymous: boolean;
  questions: {
    questionText: string;
    required: boolean;
    options: {
      optionText: string;
    }[];
  }[];
  responseMessage: string;
};

type AIResponseData =
    { type: "require-input"; input: RequireInputSchema }
  | { type: "final-response"; output: FinalOutputSchema };

type Message = {
  id: number;
  role: "ai" | "user";
  text: string;
  options?: string[];
  error?: boolean;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 0,
    role: "ai",
    text: "Hi! What should your poll be about? Describe your idea, and I'll help you build the form.",
  },
];





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

  enableCustomBranding: boolean;
  setEnableCustomBranding: React.Dispatch<React.SetStateAction<boolean>>;

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

  // AiAgent***
  messages: Message[];
  typing: boolean;

  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;

  listRef: RefObject<HTMLDivElement | null>;

  callAiAgent: (e: FormEvent<HTMLFormElement> | null, userInput: string, onApplied?: ()=> void)=> void;

  resetChat: ()=> void;
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
  const [enableCustomBranding, setEnableCustomBranding] = useState(false);

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
    setEnableCustomBranding(false);
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
        enableCustomBranding,
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
        enableCustomBranding,
      });
      toast.success("Poll saved as draft");
      resetForm();
      setActive("polls"); //redirect to pollSection
    } 
    catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong while saving the draft");
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



  // ***AiAgent Context Code***

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, open]);


  // function that add messages in chat history
  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };


  // function that apply in ai Agent output response data into form
  const applyAgentResponseIntoForm = (data: FinalOutputSchema) => {
    setTitle(data.title);
    setDescription(data.description);
    setAllowAnonymous(data.allowAnonymous);
    setExpiresAt(data.expiresAt);
    setQuestions(
      data.questions.map((question) => ({
        questionText: question.questionText,
        required: question.required,
        options: question.options.map((option) => ({
          optionText: option.optionText,
        })),
      }))
    );
    // setError as empty
    setErrors({});
  };


  // functiont that call the llm agent to get response
  const controllerRef = useRef<AbortController | null>(null);

  const callAiAgent = async (e: FormEvent<HTMLFormElement> | null, userInput: string, onApplied?: ()=> void) => {
    e?.preventDefault();

    // step:1 - if current request is on going and user send request then that is canecl request
    // If request is running, cancel it
    if (controllerRef.current) {
      controllerRef.current.abort();
      return;
    }

    // step:2- sanitize the input 
    const prompt = userInput.trim();
    if (!prompt) {
      toast.error("Please enter a message.");
      return;
    }

    //step:3 - add user msg in the chat history
    addMessage({id: Date.now(), role: "user", text: prompt });

    // creating a abort controller ofr every request
    const controller = new AbortController();
    controllerRef.current = controller;

    setInput("");
    setTyping(true);

    try {
      // step:4 - call the ai agent to get response and also pass the signal so, user can canecl request anytime
      const res = await pollService.generatePollWithAI(prompt, controller.signal);
      const data: AIResponseData = res.data;
      // console.log(data);

      // step:5a - if ai agnet need more input
      if (data.type === "require-input") {
        addMessage({
          id: Date.now() + 1,
          role: "ai",
          text: `${data.input.message}\n${data.input.question}`,
          options: data.input.options,
        });
        return;
      }

      // step:5b - apply ai agent poll_creation output response into form
      applyAgentResponseIntoForm(data.output);

      // step:6 - add Ai response to the chat history
      addMessage({ id: Date.now() + 1, role: "ai", text: data.output.responseMessage });

      // after onApplied close the form in small screen
      onApplied?.();
    } 
    catch (error: unknown) {

      // Cancellation is expected, not an application error
      if (controller.signal.aborted) {
        console.log("AI request cancelled");
        return;
      }

      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const msg = apiError.response?.data?.message || apiError.message || "Something went wrong while generating the poll.";
      addMessage({ id: Date.now() + 1, role: "ai", text: msg, error: true });
      toast.error("AI couldn't build the poll.");
    }
    finally {
      if(controllerRef.current === controller){
        setTyping(false);
        controllerRef.current = null;
      }
    }
  };

  // function that reset the chat
  const resetChat = async () => {
    await pollService.resetAgentChat();
    console.log("done")
    setMessages(INITIAL_MESSAGES);
    setTyping(false);
    setInput("");
  };



  const valueObj = {
    title, setTitle, description, setDescription, allowAnonymous, setAllowAnonymous, expiresAt, setExpiresAt,
    questions, setQuestions, enableCustomBranding, setEnableCustomBranding, isCreating, errors, setErrors, isSavingDraft, 
    handleSubmit, handleSaveAsDraft, handleCancel,
    addQuestion, removeQuestion, removeOption, addOption,
    totalQuestions, filledQuestions,
    // ai agent***
    messages, typing, input, setInput, listRef,
    callAiAgent, resetChat,
  }

  return (
    <PollCreationContext.Provider value={valueObj}>
      {children}
    </PollCreationContext.Provider>
  )
}


export default PollCreationContextProvider;
