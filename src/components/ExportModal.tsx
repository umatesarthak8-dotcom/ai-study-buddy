import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Printer,
  FileText,
} from 'lucide-react';
import { StudyKit } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kit: StudyKit;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  kit,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# ${kit.title || 'Engineering Study Guide'}\n\n`;
    md += `*Generated via AI Study Buddy — Study smarter. Understand deeper.*\n`;
    md += `*Date: ${new Date().toLocaleDateString()}*\n\n`;

    if (kit.summary) {
      md += `## 1. Executive Summary & Overview\n\n${kit.summary.overview}\n\n`;

      if (kit.summary.keyConcepts?.length) {
        md += `### Core Concepts\n\n`;
        kit.summary.keyConcepts.forEach((c) => {
          md += `#### ${c.title} [${c.importance}]\n`;
          md += `${c.explanation}\n`;
          if (c.takeaway) md += `*Key Takeaway:* ${c.takeaway}\n\n`;
        });
      }

      if (kit.summary.formulasAndRules?.length) {
        md += `### Key Formulas & Governing Laws\n\n`;
        kit.summary.formulasAndRules.forEach((f) => {
          md += `- **${f.name}**: \`${f.formula}\`\n  *Application:* ${f.application}\n`;
        });
        md += `\n`;
      }

      if (kit.summary.examPitfalls?.length) {
        md += `### Common Exam Traps & Misconceptions\n\n`;
        kit.summary.examPitfalls.forEach((p) => {
          md += `- ⚠️ ${p}\n`;
        });
        md += `\n`;
      }
    }

    if (kit.questions?.length) {
      md += `## 2. 10 High-Yield Exam Questions & Model Short Answers\n\n`;
      kit.questions.forEach((q, i) => {
        md += `### Q${i + 1}: ${q.question} (${q.difficulty})\n`;
        md += `**Answer:** ${q.answer}\n\n`;
        if (q.keyPoints?.length) {
          md += `*Scoring Points:* ${q.keyPoints.join(', ')}\n\n`;
        }
      });
    }

    if (kit.mcqs?.length) {
      md += `## 3. Multiple-Choice Questions (MCQs)\n\n`;
      const letters = ['A', 'B', 'C', 'D'];
      kit.mcqs.forEach((m, i) => {
        md += `### MCQ ${i + 1}: ${m.question}\n`;
        m.options.forEach((opt, oIdx) => {
          md += `- [${letters[oIdx]}] ${opt} ${oIdx === m.correctIndex ? '*(Correct)*' : ''}\n`;
        });
        md += `**Explanation:** ${m.explanation}\n\n`;
      });
    }

    if (kit.flashcards?.length) {
      md += `## 4. Active Recall Flashcards\n\n`;
      kit.flashcards.forEach((fc, i) => {
        md += `**Card ${i + 1} [${fc.category}]**\n`;
        md += `- Front: ${fc.front}\n`;
        md += `- Back: ${fc.back}\n`;
        if (fc.hint) md += `- Memory Hook: ${fc.hint}\n`;
        md += `\n`;
      });
    }

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(kit.title || 'study_guide').toLowerCase().replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1020]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121A2D] rounded-3xl border border-slate-700 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Export Complete Study Guide
              </h3>
              <p className="text-xs text-slate-400">
                Download or copy your synthesized summary, questions, MCQs, and flashcards.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0B1020] font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all border-y border-slate-800">
          {generateMarkdown()}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#121A2D] flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Study Sheet
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-mono">Copied Markdown</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download .md
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
