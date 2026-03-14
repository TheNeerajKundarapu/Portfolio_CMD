import React, { useState, useEffect, useRef } from 'react';
import { COMMANDS } from '../data/commands';

const Terminal = () => {
    const [history, setHistory] = useState([
        { type: 'output', content: COMMANDS.welcome }
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const terminalRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const scrollToBottom = () => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    };

    const handleInput = (e) => {
        if (e.key === 'Enter') {
            const command = input.trim().toLowerCase();
            processCommand(command);
            setInput('');
        }
    };

    const processCommand = (cmd) => {
        const newHistory = [...history, { type: 'input', content: cmd }];

        if (cmd === 'clear') {
            setHistory([]);
            return;
        }

        if (COMMANDS[cmd]) {
            newHistory.push({ type: 'output', content: COMMANDS[cmd] });
        } else if (cmd !== '') {
            newHistory.push({ type: 'output', content: `Command not found: ${cmd}. Type 'help' for assistance.` });
        }

        setHistory(newHistory);
    };

    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="crt-container" onClick={focusInput}>
            <div className="scanline"></div>
            <div className="terminal-window" ref={terminalRef}>
                {history.map((entry, index) => (
                    <div key={index} className={entry.type === 'output' ? 'output' : 'input-line'}>
                        {entry.type === 'input' && <span className="prompt">testuser@portfolio:~$</span>}
                        <span>{entry.content}</span>
                    </div>
                ))}
                <div className="input-line">
                    <span className="prompt">testuser@portfolio:~$</span>
                    <input
                        id="terminal-input"
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleInput}
                        autoFocus
                        autoComplete="off"
                    />
                </div>
            </div>
        </div>
    );
};

export default Terminal;
