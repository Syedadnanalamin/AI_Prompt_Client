"use client"

import { useState, useEffect } from "react";
import { Play, RotateCcw, Terminal, Check } from "lucide-react";

export default function PromptPlayground() {
    const templates = [
        {
            name: "React Component Generator",
            prompt: "Write a React component named [componentName] that displays a [purpose]. Use Tailwind CSS.",
            variables: { componentName: "PricingCard", purpose: "sleek pricing comparison card" },
            response: `import React from 'react';

export default function PricingCard() {
  return (
    <div className="max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
      <h3 className="text-xl font-bold text-white">Starter</h3>
      <p className="mt-2 text-sm text-zinc-400">Perfect for side projects.</p>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-white">$19</span>
        <span className="text-sm text-zinc-500">/mo</span>
      </div>
      <button className="mt-8 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500">
        Get Started
      </button>
    </div>
  );
}`
        },
        {
            name: "SEO Headline Optimizer",
            prompt: "Generate 3 high-CTR blog titles about [topic] aimed at [audience].",
            variables: { topic: "AI productivity hacks", audience: "remote software engineers" },
            response: `1. "10 AI Productivity Hacks That Will Save Remote Developers 15+ Hours a Week"
2. "The Remote Engineer's Guide to AI Orchestration: Double Your Output in 2026"
3. "Are You Coding Slow? 5 Free AI Tools Every Remote Developer Needs to Use Today"`
        }
    ];

    const [selectedIdx, setSelectedIdx] = useState(0);
    const [variables, setVariables] = useState(templates[0].variables);
    const [isRunning, setIsRunning] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [fullResponse, setFullResponse] = useState("");

    useEffect(() => {
        setVariables(templates[selectedIdx].variables);
        setTypedText("");
        setIsRunning(false);
    }, [selectedIdx]);

    const handleVariableChange = (key, val) => {
        setVariables(prev => ({ ...prev, [key]: val }));
    };

    const handleRun = () => {
        setIsRunning(true);
        setTypedText("");
        
        // Build customized response text
        let finalResponse = templates[selectedIdx].response;
        // Simple string replaces for variables
        Object.entries(variables).forEach(([key, val]) => {
            finalResponse = finalResponse.replace(new RegExp(`\\[${key}\\]`, "g"), val);
        });
        
        setFullResponse(finalResponse);

        // Typing simulator
        let index = 0;
        const interval = setInterval(() => {
            setTypedText(prev => prev + finalResponse.charAt(index));
            index++;
            if (index >= finalResponse.length) {
                clearInterval(interval);
                setIsRunning(false);
            }
        }, 10);
    };

    const renderPrompt = () => {
        let p = templates[selectedIdx].prompt;
        Object.entries(variables).forEach(([key, val]) => {
            p = p.replace(`[${key}]`, val || `[${key}]`);
        });
        return p;
    };

    return (
        <section className="bg-zinc-950 py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                        AI Prompt Sandbox Simulator
                    </h2>
                    <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
                        Test and evaluate prompts in real-time. Pick a template, customize variables, and simulate AI generation outputs.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Controls Panel */}
                    <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">1. Configure Prompt Template</h3>
                            
                            {/* Selector */}
                            <div className="flex gap-2 mb-6">
                                {templates.map((t, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedIdx(idx)}
                                        className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                                            selectedIdx === idx
                                                ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30 shadow-md"
                                                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                                        }`}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>

                            {/* Variables input */}
                            <h4 className="text-sm font-bold text-zinc-300 mb-3">Variables</h4>
                            <div className="space-y-4 mb-6">
                                {Object.entries(templates[selectedIdx].variables).map(([key, val]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                                            {key}
                                        </label>
                                        <input
                                            type="text"
                                            value={variables[key] || ""}
                                            onChange={(e) => handleVariableChange(key, e.target.value)}
                                            className="block w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Compiled Prompt Display */}
                            <h4 className="text-sm font-bold text-zinc-300 mb-2">Compiled Prompt</h4>
                            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-400 text-sm italic mb-6">
                                &ldquo;{renderPrompt()}&rdquo;
                            </div>
                        </div>

                        {/* Control buttons */}
                        <div className="flex gap-3 pt-4 border-t border-zinc-800/80">
                            <button
                                onClick={handleRun}
                                disabled={isRunning}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 py-3 text-sm font-semibold text-white shadow-md active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                            >
                                <Play size={16} />
                                Test Prompt
                            </button>
                            <button
                                onClick={() => {
                                    setVariables(templates[selectedIdx].variables);
                                    setTypedText("");
                                    setIsRunning(false);
                                }}
                                className="px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                aria-label="Reset Sandbox"
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Output Screen */}
                    <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-2xl">
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between bg-zinc-900 px-6 py-3 border-b border-zinc-800">
                            <div className="flex items-center gap-2">
                                <Terminal className="text-indigo-400" size={16} />
                                <span className="text-xs font-semibold text-zinc-400 font-mono">Sandbox Console</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                            </div>
                        </div>

                        {/* Terminal screen */}
                        <div className="flex-1 p-6 bg-zinc-950 font-mono text-xs text-zinc-300 overflow-y-auto min-h-[350px] whitespace-pre-wrap select-text leading-relaxed">
                            {isRunning || typedText ? (
                                <>
                                    <span className="text-zinc-500">&gt; Executing compiled prompt...</span>
                                    {"\n"}
                                    <span className="text-zinc-500">&gt; Receiving stream response:</span>
                                    {"\n\n"}
                                    <span className="text-indigo-200">{typedText}</span>
                                    {isRunning && <span className="inline-block w-1.5 h-4 bg-indigo-400 animate-pulse ml-0.5" />}
                                </>
                            ) : (
                                <span className="text-zinc-600 italic">Click &quot;Test Prompt&quot; to initiate compilation and watch the model stream...</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
