require("dotenv").config();
const { OpenAI } = require("openai");
const Persona = require("../models/persona");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const callOpenAI = async (req, res) => {
  const { prompt, code } = req.body;
  const allPersona = await Persona.findOne({ id: 1 });
  if (!allPersona) {
    res.status(404).json({ error: "Persona not Found" });
  }

  const question =
    allPersona.persona +
    `

  
  Here is the Code:
  {
    ${code}
  
  }
  
  Here is the user software explanation for the logic:
  {
    ${prompt}
  
  }
  
  give the output in json format like below
  
  
    "code": """....""",
    "chat": "...."
  `;


  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a code generator." },
        {
          role: "user",
          content: question.toString(),
        },
      ],
    });

    const answerText = response.choices[0].message.content;

    console.log(answerText);
    console.log(
      "______________________________________________________________________________________"
    );
    const extractCodeAndChat = (answerText) => {
      try {
        // Regular expression to match the code and chat portions
        // Match the code part between triple quotes ("""...""") but exclude the quotes themselves
        const codeRegex = /"code":\s*"""([\s\S]*?)"""/; // Match code between triple quotes
        const chatRegex = /"chat":\s*"([^"]*)"/; // Match chat inside double quotes

        // Extract the code and chat parts
        const codeMatch = answerText.match(codeRegex);
        const chatMatch = answerText.match(chatRegex);

        // Assign extracted code and chat to variables, or empty string if not found
        const CODE = codeMatch ? codeMatch[1].trim() : "";
        const CHAT = chatMatch ? chatMatch[1].trim() : "";

        return { CODE, CHAT };
      } catch (error) {
        console.error("Error parsing response:", error.message);
        return { CODE: "", CHAT: "" };
      }
    };

    // Extract code and chat parts from the answerText
    const { CODE, CHAT } = extractCodeAndChat(answerText);


    // Return the response in the desired format
    return res.status(200).json({ data: { code: CODE, chat: CHAT } });
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { callOpenAI };
