import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box } from "@chakra-ui/react";
import { useState } from "react";
function QuillReact() {
  const [editorHtml, setEditorHtml] = useState("");
  const handleEditorChange = (html) => {
    setEditorHtml(html);
  };
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
      [{ indent: "-1" }, { indent: "+1" }],
    ],
  };

  return (
    <>
      <Box maxH="560px" minW="full" align="center" overflow="auto">
        <ReactQuill theme="snow" value={editorHtml} onChange={handleEditorChange} modules={modules} placeholder="Write Your Chapter Here or Generated With AI" />
      </Box>
    </>
  );
}

export default QuillReact;
