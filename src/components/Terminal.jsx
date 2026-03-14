import React, { useState, useEffect, useRef } from 'react';
import { COMMANDS } from '../data/commands';

const Terminal = () => {
    const [history, setHistory] = useState([
        { type: 'output', content: COMMANDS.welcome }
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const terminalRef = useRef(null);
    const [uptime, setUptime] = useState('00:00:00');

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    useEffect(() => {
        const timer = setInterval(() => {
            const start = new Date(Date.now() - 120000); // Faking a 2 min uptime for flair
            const now = new Date();
            const diff = Math.floor((now - start) / 1000);
            const h = Math.floor(diff / 3600).toString().padStart(2, '0');
            const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
            const s = (diff % 60).toString().padStart(2, '0');
            setUptime(`${h}:${m}:${s}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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
            <div className="terminal-header">
                <div className="header-dots">
                    <div className="dot red"></div>
                    <div className="dot yellow"></div>
                    <div className="dot green"></div>
                </div>
                <div className="header-title">Portfolio OS v2.0.4</div>
                <div className="header-status">UPTIME: {uptime}</div>
            </div>
            
            <div className="crt-overlay"></div>
            <div className="scanline"></div>
            
            <div className="terminal-window" ref={terminalRef}>
                {history.map((entry, index) => (
                    <div key={index} className={`${entry.type === 'output' ? 'output' : 'input-line'} entry-appear`}>
                        {entry.type === 'input' && <span className="prompt">root@portfolio:~$</span>}
                        <span>{entry.content}</span>
                    </div>
                ))}
                <div className="input-line">
                    <span className="prompt">root@portfolio:~$</span>
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
