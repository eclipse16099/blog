import { EditorContent, useEditor } from "@tiptap/react";
import "highlight.js/styles/atom-one-dark.css";
import MenuBar from "./MenuBar";
import { extensions } from "../../constants/tiptapExtensions";

const Editor = ({ onDataChange, content, editable }) => {
  const editor = useEditor({
    editable,
    extensions: extensions,
    editorProps: {
      attributes: {
        class:
          "!prose !dark:prose-invert prose-sm sm:prose-base max-w-none mt-7 focus:outline-none prose-pre:bg-[#282c34] prose-pre:text-[#abb2bf]",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onDataChange(json);
    },
    content: content,
  });

  return (
    <div className="w-full h-full relative">
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} className="border border-slate-300 rounded-lg p-5 pt-0 left-0 right-0 bg-white z-10 flex gap-0.5 flex-wrap mb-5 mt-5"/>
    </div>
  );
};

export default Editor;
