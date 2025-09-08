import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const handleEditorChange = (val: string | undefined) => {
    onChange(val || '');
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    theme: 'vs-dark',
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on' as const,
  };

  return (
    <div className="code-editor">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={handleEditorChange}
        options={editorOptions}
        theme="vs-dark"
      />
    </div>
  );
}
