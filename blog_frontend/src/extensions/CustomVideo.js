// src/extensions/CustomVideo.js
import { Node } from "@tiptap/core";

export default Node.create({
  name: "customVideo",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: "100%" },
    };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { style: "width:100%; display:block;" },
      [
        "video",
        {
          ...HTMLAttributes,
          controls: true,
          style: "width:100%; height:auto; display:block; border-radius:8px;",
        },
      ],
    ];
  },

  addCommands() {
    return {
      insertVideo:
        (attrs) =>
        ({ chain }) =>
          chain()
            .insertContent({
              type: this.name,
              attrs,
            })
            .run(),
    };
  },
});
