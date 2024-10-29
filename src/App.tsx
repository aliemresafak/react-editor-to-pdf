import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { useState } from "react";

import htmlToPdf from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const [editorText, setEditorText] = useState<string>("");

  const preprocessHtml = (htmlContent: string): string => {
    return htmlContent
      .replace(/class="ql-align-center"/g, 'style="text-align: center;"')
      .replace(/class="ql-align-right"/g, 'style="text-align: right;"')
      .replace(/class="ql-align-justify"/g, 'style="text-align: justify;"');
  };

  const previewPdf = () => {
    const preprocessContent = preprocessHtml(editorText);
    const content = htmlToPdf(preprocessContent);
    const docDefinition: TDocumentDefinitions = {
      footer: function (currentPage: number) {
        return currentPage === 1
          ? {
              columns: [
                { text: "E-imza", alignment: "left", margin: [40, 20, 0, 40] },
              ],
            }
          : undefined;
      },
      content,
      pageMargins: [40, 60, 40, 90],
    };

    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
  };
  return (
    <>
      <div className="container">
        <div className="editor">
          <Button onClick={previewPdf}>Preview PDF</Button>
          <Editor
            style={{ height: "320px" }}
            value={editorText}
            onTextChange={(e) => setEditorText(e.htmlValue ?? "")}
          />
        </div>
        <div className="editor__state">
          <span>{editorText}</span>
        </div>
      </div>
    </>
  );
}

export default App;
