/* ═══════════════════════════════════════════════════════════
   Terminal — Interactive command-line interface
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Profile, Project, SkillCategory, SocialLink } from '../../types/api';
import { buildFileSystem } from '../../utils/virtualFileSystem';
import type { FSNode } from '../../utils/virtualFileSystem';
import { executeCommand, getCompletions } from '../../utils/commandParser';
import type { CommandOutput } from '../../utils/commandParser';
import './Terminal.css';

interface Props {
  profile: Profile | null;
  projects: Project[];
  skills: SkillCategory[];
  social: SocialLink[];
}

interface TerminalLine {
  type: 'input' | 'output';
  prompt?: string;
  command?: string;
  outputs?: CommandOutput[];
}

export default function Terminal({ profile, projects, skills, social }: Props) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [fs, setFs] = useState<FSNode | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Build filesystem when data changes
  useEffect(() => {
    setFs(buildFileSystem(profile, projects, skills, social));
  }, [profile, projects, skills, social]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on click
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const getPrompt = useCallback(() => {
    const pathStr = currentPath.length > 0 ? `~/${currentPath.join('/')}` : '~';
    return `visitor@hardik:${pathStr}$ `;
  }, [currentPath]);

  const handleSubmit = useCallback(() => {
    if (!fs) return;

    const input = currentInput.trim();
    const prompt = getPrompt();

    // Add input line
    setLines(prev => [...prev, { type: 'input', prompt, command: input }]);

    if (input) {
      // Add to history
      setCommandHistory(prev => [...prev, input]);
      setHistoryIndex(-1);

      // Execute command
      const result = executeCommand(
        input, currentPath, fs, profile, projects, social,
        commandHistory, navigate
      );

      if (result.clear) {
        setLines([]);
      } else if (result.outputs.length > 0) {
        setLines(prev => [...prev, { type: 'output', outputs: result.outputs }]);
      }

      if (result.newPath !== undefined) {
        setCurrentPath(result.newPath);
      }
    }

    setCurrentInput('');
  }, [currentInput, currentPath, fs, profile, projects, social, commandHistory, getPrompt, navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        handleSubmit();
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setCurrentInput('');
          } else {
            setHistoryIndex(newIndex);
            setCurrentInput(commandHistory[newIndex]);
          }
        }
        break;

      case 'Tab':
        e.preventDefault();
        if (fs && currentInput) {
          const completions = getCompletions(currentInput, currentPath, fs);
          if (completions.length === 1) {
            setCurrentInput(completions[0]);
          } else if (completions.length > 1) {
            setLines(prev => [
              ...prev,
              { type: 'input', prompt: getPrompt(), command: currentInput },
              { type: 'output', outputs: completions.map(c => ({ type: 'text' as const, content: `  ${c}` })) },
            ]);
          }
        }
        break;

      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          setLines([]);
        }
        break;

      case 'c':
        if (e.ctrlKey) {
          e.preventDefault();
          setLines(prev => [...prev, { type: 'input', prompt: getPrompt(), command: currentInput + '^C' }]);
          setCurrentInput('');
        }
        break;
    }
  }, [handleSubmit, commandHistory, historyIndex, currentInput, currentPath, fs, getPrompt]);

  return (
    <section className="terminal-section" id="terminal">
      <div className="terminal" onClick={focusInput}>
        {/* Terminal header */}
        <div className="terminal__header">
          <span className="terminal__title">PORTFOLIO TERMINAL</span>
          <div className="terminal__dots">
            <span className="terminal__dot terminal__dot--close"></span>
            <span className="terminal__dot terminal__dot--min"></span>
            <span className="terminal__dot terminal__dot--max"></span>
          </div>
        </div>

        {/* Terminal body */}
        <div className="terminal__body" ref={terminalRef}>
          {/* Welcome message */}
          <div className="terminal__welcome">
            <span className="terminal__welcome-text">
              Welcome to {profile?.name || 'HARDIK'}'s Portfolio Terminal.
            </span>
            <span className="terminal__welcome-text">
              Type <span className="terminal__cmd-highlight">help</span> to see available commands.
            </span>
            <br />
          </div>

          {/* Output lines */}
          {lines.map((line, i) => (
            <div key={i} className="terminal__line">
              {line.type === 'input' && (
                <div className="terminal__input-line">
                  <span className="terminal__prompt">{line.prompt}</span>
                  <span className="terminal__command">{line.command}</span>
                </div>
              )}
              {line.type === 'output' && line.outputs && (
                <div className="terminal__output">
                  {line.outputs.map((out, j) => (
                    <div key={j} className={`terminal__output-line terminal__output--${out.type}`}>
                      {out.url ? (
                        <a href={out.url} target="_blank" rel="noopener noreferrer" className="terminal__link">
                          {formatOutput(out.content)}
                        </a>
                      ) : (
                        formatOutput(out.content)
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Active input line */}
          <div className="terminal__active-line">
            <span className="terminal__prompt">{getPrompt()}</span>
            <div className="terminal__input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="terminal__input"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
              />
              <span className="terminal__cursor"></span>
            </div>
          </div>
        </div>

        {/* Mobile submit button */}
        <div className="terminal__mobile-bar">
          <button className="terminal__mobile-submit" onClick={handleSubmit}>
            EXECUTE
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * Format terminal output — handle custom markers.
 */
function formatOutput(content: string): string {
  // Strip custom dir markers for now
  return content.replace(/\x1b\[dir\]/g, '').replace(/\x1b\[\/dir\]/g, '');
}
