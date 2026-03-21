import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeViewer({ className = "" }) {
  const code = `
const foo = (bar = isRequired()) => console.log(bar)
foo('Test')
`;

  return (
    <div className={className}>
      <SyntaxHighlighter
        language="javascript"
        style={oneDark}
        customStyle={{
          width: "100%",
          height: "100%",
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
