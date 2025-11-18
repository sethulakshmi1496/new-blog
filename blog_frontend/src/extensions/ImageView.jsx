// src/extensions/ImageView.jsx
import React, { useRef, useState, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export default function ImageView({ node, updateAttributes, selected, editor, getPos }) {
  const imgRef = useRef(null);
  const wrapperRef = useRef(null);
  const [internalWidth, setInternalWidth] = useState(node.attrs.width || "350px");

  useEffect(() => {
    if (node.attrs.width !== internalWidth) {
      setInternalWidth(node.attrs.width);
    }
  }, [node.attrs.width]);

  /* ------------------------ RESIZE ------------------------ */
  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = parseInt(internalWidth, 10) || imgRef.current?.offsetWidth || 350;

    const onMove = (ev) => {
      const w = Math.max(80, startWidth + (ev.clientX - startX));
      const newWidth = `${w}px`;
      setInternalWidth(newWidth);
      updateAttributes({ width: newWidth });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  /* ------------------------ 🟢 FIXED MOVE UP ------------------------ */
  const moveUp = () => {
    const pos = getPos();
    const { doc } = editor.state;

    const $pos = doc.resolve(pos);
    const index = $pos.index();
    const parent = $pos.parent;

    if (index === 0) return; // already first block

    const node = parent.child(index);
    const nodeSize = node.nodeSize;

    // previous block position
    const prevNode = parent.child(index - 1);
    const prevPos = pos - prevNode.nodeSize;

    const tr = editor.state.tr;

    tr.delete(pos, pos + nodeSize);
    tr.insert(prevPos, node);

    editor.view.dispatch(tr);
  };

  /* ------------------------ MOVE DOWN ------------------------ */
  const moveDown = () => {
    const pos = getPos();
    const node = editor.state.doc.nodeAt(pos);
    if (!node) return;

    const tr = editor.state.tr;
    tr.delete(pos, pos + node.nodeSize);
    tr.insert(pos + node.nodeSize, node);

    editor.view.dispatch(tr);
  };

  /* ------------------------ ALIGNMENT ------------------------ */
  const alignLeft = () =>
    updateAttributes({
      style: "display:block;margin-left:0;margin-right:auto;",
    });

  const alignCenter = () =>
    updateAttributes({
      style: "display:block;margin-left:auto;margin-right:auto;",
    });

  const alignRight = () =>
    updateAttributes({
      style: "display:block;margin-left:auto;margin-right:0;",
    });

  /* ------------------------ DELETE ------------------------ */
  const deleteNode = () => {
    const pos = getPos();
    const tr = editor.state.tr.delete(pos, pos + node.nodeSize);
    editor.view.dispatch(tr);
  };

  /* ------------------------ DRAG START ------------------------ */
  const onDragStart = (e) => {
    const img = imgRef.current;

    if (img && e.dataTransfer) {
      try {
        e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
      } catch {}

      e.dataTransfer.effectAllowed = "move";
      try {
        e.dataTransfer.setData("text/plain", "betterImage");
      } catch {}
    }
  };

  /* ------------------------ RENDER ------------------------ */
  return (
    <NodeViewWrapper
      ref={wrapperRef}
      draggable
      onDragStart={onDragStart}
      style={{
        width: internalWidth,
        display: "block",
        position: "relative",
        margin: "16px 0",
        ...(node.attrs.style ? { ...parseStyle(node.attrs.style) } : {}),
      }}
      className="group"
    >
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt=""
        draggable={false}
        style={{
          width: "100%",
          borderRadius: 8,
          border: selected ? "2px solid #3b82f6" : "none",
          userSelect: "none",
        }}
      />

      {selected && (
        <div
          style={{
            position: "absolute",
            top: -40,
            right: 0,
            display: "flex",
            gap: 6,
            background: "#ffffffdd",
            padding: "4px 6px",
            borderRadius: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 50,
          }}
        >
          <button onClick={moveUp}>⬆</button>
          <button onClick={moveDown}>⬇</button>
          <button onClick={alignLeft}>⬅</button>
          <button onClick={alignCenter}>⬆⬇</button>
          <button onClick={alignRight}>➡</button>
          <button onClick={deleteNode} style={{ color: "red" }}>🗑</button>
        </div>
      )}

      <div
        onMouseDown={startResize}
        style={{
          width: 14,
          height: 14,
          background: "white",
          border: "2px solid #3b82f6",
          borderRadius: "50%",
          position: "absolute",
          bottom: -10,
          right: -10,
          cursor: "nwse-resize",
        }}
      />
    </NodeViewWrapper>
  );
}

/* Convert inline CSS string → JS object */
function parseStyle(styleString) {
  return styleString.split(";").reduce((obj, rule) => {
    const [key, value] = rule.split(":");
    if (!key || !value) return obj;
    const jsKey = key.trim().replace(/-./g, (m) => m[1].toUpperCase());
    obj[jsKey] = value.trim();
    return obj;
  }, {});
}
