"use client"

import Editor from "@/components/editor/advanced-editor";
import { JSONContent } from "novel";
import { useState } from "react";
import { defaultValue } from "./default-value";

export default function Component() {
  const [value, setValue] = useState<JSONContent>(defaultValue);
  
  return (
    <div>
       <Editor initialValue={value} onChange={setValue} />
    </div>
  )
}