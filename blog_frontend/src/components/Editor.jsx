// src/components/Editor.jsx
import React, { useRef } from "react";
import axios from "axios";
import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";

import Youtube from "@tiptap/extension-youtube";
import CustomVideo from "../extensions/CustomVideo";
import { BetterImage } from "../extensions/BetterImage";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";

// highlight.js setup
const lowlight = createLowlight();
lowlight.register("javascript", js);
lowlight.register("css", css);
lowlight.register("html", xml);
lowlight.register("python", python);

export default function Editor({ content, setContent }) {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        image: false,
      }),

      BetterImage,

      Underline,
      TextStyle,
      FontFamily,
      Color,
      TextAlign.configure({ types: ["paragraph", "heading"] }),

      CustomVideo,
      Link.configure({ openOnClick: true }),
      Youtube.configure({ controls: true, nocookie: true }),

      CodeBlockLowlight.configure({ lowlight }),
    ],

    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  /* ======================================
     IMAGE UPLOAD
  ====================================== */
  const handleImageSelect = async (e) => {
    const files = [...(e.target.files || [])];
    if (!files.length) return;

    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);

      const res = await axios.post("http://127.0.0.1:8000/api/upload/image/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      editor.chain().focus().insertContent({
        type: "betterImage",
        attrs: {
          src: res.data.url,
          width: "350px",
          alt: "",
          align: "left",
        },
      }).run();
    }

    e.target.value = "";
  };

  /* ======================================
     VIDEO UPLOAD
  ====================================== */
  const handleVideoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    const res = await axios.post("http://127.0.0.1:8000/api/upload/video/", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    editor.chain().focus().insertContent({
      type: "customVideo",
      attrs: { src: res.data.url, width: "640px" },
    }).run();

    e.target.value = "";
  };

  /* ======================================
     YOUTUBE
  ====================================== */
  const insertYoutube = () => {
    const url = window.prompt("Paste YouTube URL");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
  };

  return (
    <div className="w-full">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3 bg-gray-100 p-3 rounded">

        {/* Upload */}
        <button
          onClick={() => imageInputRef.current.click()}
          className="px-3 py-1 bg-black text-white rounded"
        >Upload Image</button>

        <button
          onClick={() => videoInputRef.current.click()}
          className="px-3 py-1 bg-black text-white rounded"
        >Upload Video</button>

        <button
          onClick={insertYoutube}
          className="px-3 py-1 bg-black text-white rounded"
        >YouTube</button>

        {/* Text */}
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-3 py-1 border rounded">Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-3 py-1 border rounded">Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-3 py-1 border rounded">Underline</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className="px-3 py-1 border rounded">Strike</button>

        {/* Code */}
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="px-3 py-1 border rounded"
        >
          {"</>"}
        </button>
      </div>

      {/* Hidden Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageSelect}
      />

      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm"
        className="hidden"
        onChange={handleVideoSelect}
      />

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="border rounded p-4 bg-white min-h-[300px]"
      />
    </div>
  );
}
