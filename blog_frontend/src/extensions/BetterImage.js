// src/extensions/BetterImage.js
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageView from "./ImageView";

export const BetterImage = Node.create({
  name: "betterImage",

  group: "block",
  inline: false,
  draggable: true,
  selectable: true,
  defining: true,
  content: "",

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      width: { default: "350px" },

      // REQUIRED so alignment works
      style: {
        default: "",
        parseHTML: element => element.getAttribute("style") || "",
        renderHTML: attributes => {
          return { style: attributes.style };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

export default BetterImage;
