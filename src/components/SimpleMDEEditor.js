import React, { useEffect, useRef, useState } from "react";
import SimpleMDE from "simplemde";
import { marked, setOptions } from "marked";
import "simplemde/dist/simplemde.min.css";
import "./editorStyles.css";

const RichTextEditor = () => {
  const editorRef = useRef(null);
  const simplemdeRef = useRef(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    setOptions({
      breaks: true,
      gfm: true,
      tables: true,
    });

    simplemdeRef.current = new SimpleMDE({
      autofocus: true,
      blockStyles: {
        bold: "**",
        italic: "*",
      },
      element: editorRef.current,
      forceSync: true,
      indentWithTabs: false,
      initialValue: "",
      insertTexts: {
        horizontalRule: ["", "\n\n-----\n\n"],
        link: ["[", "](http://)"],
      },
      lineWrapping: true,
      parsingConfig: {
        allowAtxHeaderWithoutSpace: true,
        strikethrough: true,
        underscoresBreakWords: true,
      },
      placeholder: "Type here...",
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true,
      },
      shortcuts: {
        drawTable: "Cmd-Alt-T",
      },
      toolbar: [
        "bold",
        "italic",
        {
          name: "heading-1",
          action: function toggleHeading(editor) {
            toggleHeadingLevel(editor, 1);
          },
          className: "mdi mdi-format-header-1",
          title: "Heading 1",
        },
        {
          name: "heading-2",
          action: function toggleHeading(editor) {
            toggleHeadingLevel(editor, 2);
          },
          className: "mdi mdi-format-header-2",
          title: "Heading 2",
        },
        {
          name: "heading-3",
          action: function toggleHeading(editor) {
            toggleHeadingLevel(editor, 3);
          },
          className: "mdi mdi-format-header-3",
          title: "Heading 3",
        },
        {
          name: "heading-4",
          action: function toggleHeading(editor) {
            toggleHeadingLevel(editor, 4);
          },
          className: "mdi mdi-format-header-4",
          title: "Heading 4",
        },
        {
          name: "heading-5",
          action: function toggleHeading(editor) {
            toggleHeadingLevel(editor, 5);
          },
          className: "mdi mdi-format-header-5",
          title: "Heading 5",
        },
        {
          name: "heading-6",
          action: function toggleHeading(editor) {
            toggleHeadingLevel(editor, 6);
          },
          className: "mdi mdi-format-header-6",
          title: "Heading 6",
        },
        "unordered-list",
        "ordered-list",
        "preview",
        {
          name: "link",
          action: function () {
            setIsLinkModalOpen(true);
          },
          className: "fa fa-link",
          title: "Insert Link",
        },
        {
          name: "code",
          action: function toggleInlineCode(editor) {
            const cm = editor.codemirror;
            const selection = cm.getSelection();
            const start = cm.getCursor("start");
            const end = cm.getCursor("end");

            const isAlreadyCode =
              selection.startsWith("``") && selection.endsWith("``");
            const inlineCode = isAlreadyCode
              ? selection.slice(2, -2)
              : `\`\`${selection}\`\``;

            cm.replaceSelection(inlineCode);

            if (!isAlreadyCode && !selection) {
              cm.setCursor({ line: start.line, ch: start.ch + 2 });
            } else if (!isAlreadyCode) {
              cm.setSelection(
                { line: start.line, ch: start.ch + 2 },
                { line: end.line, ch: end.ch + 2 }
              );
            } else {
              cm.setSelection(
                { line: start.line, ch: start.ch },
                { line: end.line, ch: end.ch - 4 }
              );
            }

            cm.focus();
          },
          className: "fa fa-code",
          title: "Code",
        },
        {
          name: "strikethrough",
          action: function strikeThroughText(editor) {
            const cm = editor.codemirror;
            const selection = cm.getSelection();

            const isStrikethrough =
              selection.startsWith("~~") && selection.endsWith("~~");
            const newSelection = isStrikethrough
              ? selection.slice(2, -2)
              : `~~${selection}~~`;

            cm.replaceSelection(newSelection);

            if (isStrikethrough) {
              cm.setSelection(
                {
                  line: cm.getCursor("start").line,
                  ch: cm.getCursor("start").ch,
                },
                {
                  line: cm.getCursor("end").line,
                  ch: cm.getCursor("end").ch - 4,
                }
              );
            } else {
              cm.setSelection(
                {
                  line: cm.getCursor("start").line,
                  ch: cm.getCursor("start").ch,
                },
                {
                  line: cm.getCursor("end").line,
                  ch: cm.getCursor("end").ch + 4,
                }
              );
            }

            cm.focus();
          },
          className: "fa fa-strikethrough",
          title: "Strikethrough",
        },
        {
          name: "divider",
          action: function insertDivider(editor) {
            editor.codemirror.replaceSelection("\n\n-----\n\n");
            editor.codemirror.focus();
          },
          className: "fa fa-minus",
          title: "Insert Divider",
        },
        {
          name: "highlight",
          action: function highlightText(editor) {
            toggleHighlight(editor.codemirror);
          },
          className: "fa fa-paint-brush",
          title: "Highlight Text",
        },
      ],
      spellChecker: false,
      styleSelectedText: true,
      tabSize: 4,
      toolbarTips: true,
      previewRender: (plainText) => {
        const lines = plainText.split("\n");

        let result = "";
        let inHighlightGroup = false;

        lines.forEach((line, index) => {
          const trimmedLine = line.trim();
          const isHighlighted = /^(#{1,6} |->\s)/.test(trimmedLine);

          if (isHighlighted) {
            if (!inHighlightGroup) {
              result += `<div class="highlight-group">`;
              inHighlightGroup = true;
            }

            const highlightedText = trimmedLine.startsWith("-> ")
              ? trimmedLine.slice(3)
              : trimmedLine;

            result += `<p class="highlighted-text">${marked(
              highlightedText
            )}</p>`;
          } else {
            if (inHighlightGroup) {
              result += `</div>`;
              inHighlightGroup = false;
            }
            result += `<p>${marked(trimmedLine)}</p>`;
          }
        });

        if (inHighlightGroup) {
          result += `</div>`;
        }

        return result;
      },
    });

    const cm = simplemdeRef.current.codemirror;

    cm.on("change", () => {
      const totalLines = cm.lineCount();
      for (let i = 0; i < totalLines; i++) {
        const lineText = cm.getLine(i);

        cm.removeLineClass(i, "background", "highlighted-line");

        if (/^(#{1,6} |->\s)/.test(lineText.trim())) {
          cm.addLineClass(i, "background", "highlighted-line");
        }
      }
    });

    cm.addKeyMap({
      Tab: (cm) => {
        const cursor = cm.getCursor();
        const lineContent = cm.getLine(cursor.line);

        const isHighlighted = lineContent.startsWith("-> ");

        if (isHighlighted) {
          const newText = lineContent.replace(/^->\s/, "");
          cm.replaceRange(
            newText,
            { line: cursor.line, ch: 0 },
            { line: cursor.line, ch: lineContent.length }
          );

          const marks = cm.findMarks(
            { line: cursor.line, ch: 0 },
            { line: cursor.line, ch: newText.length }
          );
          marks.forEach((mark) => mark.clear());
          cm.setCursor({ line: cursor.line, ch: 0 });
        } else {
          cm.replaceRange(`-> `, { line: cursor.line, ch: 0 });
          cm.markText(
            { line: cursor.line, ch: 0 },
            { line: cursor.line, ch: lineContent.length + 3 },
            { className: "cm-highlight" }
          );
          cm.setCursor({ line: cursor.line, ch: lineContent.length + 3 });
        }

        cm.focus();
      },
    });

    const toggleHighlight = (cm) => {
      const cursor = cm.getCursor();
      const selection = cm.getSelection();
      const from = cm.getCursor("from");
      const to = cm.getCursor("to");

      if (selection) {
        const isHighlighted = /^->\s/.test(selection);
        const highlightedText = isHighlighted
          ? selection.replace(/^->\s/, "")
          : `-> ${selection}`;

        cm.replaceRange(highlightedText, from, to);

        if (!isHighlighted) {
          cm.markText(
            { line: from.line, ch: from.ch },
            { line: to.line, ch: to.ch + 0 },
            { className: "cm-highlight" }
          );
        } else {
          const marks = cm.findMarks(from, to);
          marks.forEach((mark) => mark.clear());
        }
      } else {
        const line = cursor.line;
        const ch = cursor.ch;
        const lineContent = cm.getLine(line);

        const highlightStart = lineContent.lastIndexOf("-> ", ch);
        const isInsideHighlight =
          highlightStart !== -1 &&
          !lineContent.slice(highlightStart + 3, ch).includes("-> ");

        if (isInsideHighlight) {
          // Remove highlight
          const newText = lineContent.replace(/^->\s/, "");
          cm.replaceRange(
            newText,
            { line, ch: 0 },
            { line, ch: lineContent.length }
          );
          const marks = cm.findMarks(
            { line, ch: 0 },
            { line, ch: newText.length }
          );
          marks.forEach((mark) => mark.clear());
          cm.setCursor({ line, ch: 0 });
        } else {
          // Add highlight
          cm.replaceRange(`-> `, { line, ch: 0 });
          cm.markText(
            { line, ch: 0 },
            { line, ch: lineContent.length + 3 },
            { className: "cm-highlight" }
          );
          cm.setCursor({ line, ch: lineContent.length + 3 });
        }
      }

      cm.focus();
    };

    cm.on("changes", (instance, changes) => {
      const cursor = cm.getCursor();
      const lineContent = cm.getLine(cursor.line);

      if (lineContent.startsWith("-> ")) {
        applyHighlightToLine(cm, cursor.line);
      }
    });

    cm.on("keydown", (cm, event) => {
      if (event.key === "Enter") {
        const cursor = cm.getCursor();
        const lineContent = cm.getLine(cursor.line);

        console.log(
          "Enter key pressed. Line content before split:",
          lineContent
        );

        const textBeforeCursor = lineContent.slice(0, cursor.ch);
        const textAfterCursor = lineContent.slice(cursor.ch);

        setTimeout(() => {
          const newLine = cursor.line + 1;
          let newLineContent = cm.getLine(newLine);

          console.log("New line content after split:", newLineContent);

          for (let i = 1; i <= 6; i++) {
            if (
              textBeforeCursor.startsWith("#".repeat(i) + " ") &&
              !textBeforeCursor.startsWith("#".repeat(i + 1))
            ) {
              const headerSyntax = "#".repeat(i);
              newLineContent = `${headerSyntax} ${textAfterCursor.trim()}`;
              cm.replaceRange(
                newLineContent,
                { line: newLine, ch: 0 },
                { line: newLine, ch: newLineContent.length }
              );
              console.log(
                `Header level ${i} applied to new line:`,
                newLineContent
              );
              break; // Exit the loop once a matching header is found
            }
          }

          // Handle highlight functionality
          if (
            textBeforeCursor.startsWith("-> ") &&
            textAfterCursor.length > 0
          ) {
            newLineContent = `-> ${textAfterCursor.trim()}`;
            cm.replaceRange(
              newLineContent,
              { line: newLine, ch: 0 },
              { line: newLine, ch: newLineContent.length }
            );

            // Apply the highlight class
            cm.operation(() => {
              const from = { line: newLine, ch: 0 };
              const to = { line: newLine, ch: newLineContent.length };
              cm.markText(from, to, { className: "cm-highlight" });
            });

            console.log("Highlight applied to new line:", newLineContent);
          }
        }, 0);
      }
      if (event.key === "ArrowRight") {
        handleCursorMovement(cm);
      }
    });

    cm.on("cursorActivity", function () {
      const toolbarElements = document.querySelectorAll(".editor-toolbar .fa");

      toolbarElements.forEach((element) => {
        element.classList.remove("active");
      });

      const cursor = cm.getCursor();
      const lineContent = cm.getLine(cursor.line).trim();
      const selection = cm.getSelection();

      if (/^\*\*.*\*\*$/.test(selection)) {
        document.querySelector(".fa-bold")?.classList.add("active");
      }

      if (/^\*[^*]+\*$/.test(selection)) {
        document.querySelector(".fa-italic")?.classList.add("active");
      }

      if (/^``.*``$/.test(selection)) {
        document.querySelector(".fa-code")?.classList.add("active");
      }

      if (/^~~.*~~$/.test(selection)) {
        document.querySelector(".fa-strikethrough")?.classList.add("active");
      }

      if (/^->\s/.test(lineContent)) {
        document.querySelector(".fa-paint-brush")?.classList.add("active");
      }

      const tokenBeforeCursor = cm.getTokenAt(cursor);
      const tokenAfterCursor = cm.getTokenAt({
        line: cursor.line,
        ch: cursor.ch + 1,
      });

      if (
        tokenBeforeCursor.type === "strong" ||
        tokenAfterCursor.type === "strong"
      ) {
        document.querySelector(".fa-bold")?.classList.add("active");
      }

      if (tokenBeforeCursor.type === "em" || tokenAfterCursor.type === "em") {
        document.querySelector(".fa-italic")?.classList.add("active");
      }

      if (
        tokenBeforeCursor.type === "strikethrough" ||
        tokenAfterCursor.type === "strikethrough"
      ) {
        document.querySelector(".fa-strikethrough")?.classList.add("active");
      }

      if (lineContent.startsWith("- ") || lineContent.startsWith("* ")) {
        document.querySelector(".fa-list-ul")?.classList.add("active");
      }

      if (/^\d+\.\s/.test(lineContent)) {
        document.querySelector(".fa-list-ol")?.classList.add("active");
      }

      for (let i = 1; i <= 6; i++) {
        if (
          lineContent.startsWith("#".repeat(i) + " ") &&
          !lineContent.startsWith("#".repeat(i + 1))
        ) {
          document
            .querySelector(`.mdi-format-header-${i}`)
            ?.classList.add("active");
        }
      }
    });

    return () => {
      if (simplemdeRef.current) {
        simplemdeRef.current.toTextArea();
        simplemdeRef.current = null;
      }
    };
  }, []);

  const toggleHeadingLevel = (editor, level) => {
    const cm = editor.codemirror;
    const cursor = cm.getCursor();
    const lineContent = cm.getLine(cursor.line).trim();

    const currentHeading = "#".repeat(level);
    const newContent = lineContent.startsWith(currentHeading + " ")
      ? lineContent.slice(currentHeading.length + 1).trim()
      : `${currentHeading} ${lineContent.replace(/^#+\s*/, "")}`;

    cm.replaceRange(
      newContent,
      { line: cursor.line, ch: 0 },
      { line: cursor.line, ch: lineContent.length }
    );
    cm.setCursor({ line: cursor.line, ch: newContent.length });
    cm.focus();
  };

  const insertLink = () => {
    if (linkTitle && linkUrl) {
      const markdownLink = `[${linkTitle}](${linkUrl})`;
      simplemdeRef.current.codemirror.replaceSelection(markdownLink);
      setIsLinkModalOpen(false);
      setLinkTitle("");
      setLinkUrl("");
    }
  };

  const applyHighlightToLine = (cm, line) => {
    const lineContent = cm.getLine(line);
    if (lineContent.startsWith("-> ")) {
      const from = { line, ch: 3 };
      const to = { line, ch: lineContent.length };
      cm.markText(from, to, { className: "cm-highlight" });
    }
  };

  const handleCursorMovement = (cm) => {
    const cursor = cm.getCursor();
    const line = cursor.line;
    const ch = cursor.ch;
    const lineContent = cm.getLine(line);

    if (lineContent.slice(ch - 3, ch) === "-> " && ch === lineContent.length) {
      cm.replaceRange(" ", { line, ch }, { line, ch });
      cm.setCursor({ line, ch: ch + 1 });
    }
  };

  return (
    <div className="editor-container">
      <textarea id="editor" ref={editorRef}></textarea>

      {isLinkModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Insert Link</h2>
            <input
              type="text"
              placeholder="Title"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <button onClick={insertLink}>Insert</button>
            <button onClick={() => setIsLinkModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
