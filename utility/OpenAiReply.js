require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY
});

const callOpenAI = async (req, res) => {
  const { prompt, code } = req.body;

  const question = `You are a software developer that specializes in creating logic for UI code.
  The UI code is written in pyvisual. Below are the available classes and functions for pyvisual.
  
  {
  # Window
  Function Call
  window = Window(title="PyVisual Window",width=800, height=600,background_color=(1, 1, 1, 1),frameless=False)
  Methods: set_borderless(borderless), set_background_image(background_image), on_window_resize(instance, width, height), add_widget(widget), show(), close(), update()
  
  # Text
  Function Call
  text = Text(window, x, y, text, font_size=20, text_color=(1, 1, 1, 1), bg_color=(0, 0, 0, 1),
                   alignment="center", rect_width=None, visibility=True, tag=None, font_name=None)
  Methods: update_label_alignment(), set_text(text), set_font_size(font_size), set_text_color(text_color), set_bg_color(bg_color), set_alignment(alignment), set_rect_size(rect_width, rect_height), set_visibility(visibility), set_font_name(font_name)
  
  # Button
  Function Call
  button = BasicButton( window, x, y, width=140, height=50, text="CLICK ME", visibility=True,
                   font="Roboto", font_size=16, font_color="#000000",
                   bold=False, italic=False, underline=False, strikethrough=False,
                   idle_color="#f9b732", hover_color="#ffd278", clicked_color="#d1910f",
                   border_color=(0, 0, 0, 0), border_thickness=0,
                   on_hover=None, on_click=None, on_release=None,
                   tag=None, disabled=False, disabled_opacity=0.3,
                   auto_add=True)
  Methods: apply_markup(text), draw_border(), handle_click(instance), handle_release(instance), on_mouse_pos(window, pos), update_button_color(color), is_mouse_hovering(pos), set_text(text), set_font(font), set_font_size(font_size), set_color(color), set_visibility(visibility), set_disabled(disabled), add_to_layout(layout)
  
  # Image
  Function Call
  image = Image(window, x, y, image_path, scale=1.0, visibility=True, tag=None)
  Methods: set_scale(scale), set_position( x, y), set_image(image_path), set_visibility(visibility)
  
  # Text Input Field
  BasicTextInput(window, x, y, width=200, height=40, background_color=(1, 1, 1, 1), input_type="text", visibility=True,
                   placeholder="Enter your text here...", default_text="",
                   text_padding_left=10, text_padding_right=10, text_padding_top=0, text_padding_bottom=10,
                   font="Roboto", font_size=None, font_color=(0.3, 0.3, 0.3, 1),
                   border_color=(0.6, 0.6, 0.6, 1), border_thickness=1, border_style=("bottom", "top", "right", "left"),
                   on_input=None, tag=None, disabled=False, disabled_opacity=0.5):
  Methods: apply_input_restrictions(input_type), update_border_style(border_color, border_thickness), update_graphics(*args), get_text(), set_text(value), set_cursor_position(position), set_visibility(visibility), set_disabled(disabled)
  
  
  }
  for the logic part there are event listeners that could be used for example in the button class
  there are on_click, on_hover and on_release methods that can take a function name as the input.
  for example "on_click = button_click_function" .
  when writing the functions make sure to add one dummy input argument which is required by all listeners
  
  Given the UI code provided and the explanation of the software provided write the code for the app.
  - Don't make any changes to the UI code except for adding event listener functions.
  - Don't provide dummy code . use actual apis or 3rd party packages if required
  
  
  the format of the code should be as follows
  
  {
  
  # ............  LOGIC CODE ................#
  
  # ............  UI CODE ................#
  
  ui = {}
  
  def create_ui(window):
  
  def main():
  
  if __name__ == '__main__':
      import pyvisual as pv
      main()
  }
  
  
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
    console.log("______________________________________________________________________________________")
    const extractCodeAndChat = (answerText) => {
      try {
        // Regular expression to match the code and chat portions
        // Match the code part between triple quotes ("""...""") but exclude the quotes themselves
        const codeRegex = /"code":\s*"""([\s\S]*?)"""/;  // Match code between triple quotes
        const chatRegex = /"chat":\s*"([^"]*)"/;        // Match chat inside double quotes
    
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
  
    console.log("______________________________________________________________________________________")
    console.log(CODE);
  
    // Return the response in the desired format
    return res.status(200).json({ data: { code: CODE, chat: CHAT } });
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    return res.status(500).json({ error: error.message });
  }
  
};


module.exports = { callOpenAI };
