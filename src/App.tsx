import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Code, Play, ExternalLink, Settings, 
  ChevronDown, MessageSquare, MonitorPlay, 
  Send, History, FileCode2, Paperclip, Mic, MonitorSmartphone,
  Menu, Share, Download, Maximize2, MoreVertical, X, Key, Check,
  GitFork, GitCommit, Github, FilePlus, Code2, Copy, FileText
} from 'lucide-react';
import { cn } from './lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [prompt, setPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [generationCount, setGenerationCount] = useState(1);
  const [apiKey, setApiKey] = useState("");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const models = [
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", icon: "✨" },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", icon: "⚡" },
    { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", icon: "🧠" },
    { id: "gpt-4o", name: "GPT-4o", icon: "🌐" },
    { id: "llama-3", name: "Llama 3 70B", icon: "🦙" }
  ];
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-pro");
  const [showModelSelect, setShowModelSelect] = useState(false);

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const suggestions = [
    "Build a personal portfolio with dark mode",
    "Create a real-time chat UI",
    "Make an interactive Kanban board",
    "Build a neon themed crypto dashboard"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(prev => prev ? `${prev} ${suggestion}` : suggestion);
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim() || isTyping) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: prompt };
    const history = messages.slice();
    setMessages(prev => [...prev, userMsg]);
    setPrompt("");
    setIsTyping(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg.text,
          history,
          apiKey,
          model: selectedModel
        })
      });

      const data = await res.json();

      if (res.ok) {
        setPreviewHtml(data.code);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: `I have updated the app. The Preview tab has been refreshed with the new features.`
        }]);
        setGenerationCount(prev => prev + 1);
        setActiveTab('preview');
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: `Error: ${data.error}`
        }]);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `Failed to connect to the backend: ${e.message}`
      }]);
    }

    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="h-14 shrink-0 border-b border-border bg-panel flex items-center justify-between px-2 sm:px-4 z-20">
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 hover:bg-panel-hover rounded-md text-muted hover:text-foreground transition-colors md:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex items-center justify-center gap-2 text-primary font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="hidden md:flex font-medium text-[15px] tracking-wide items-center gap-1.5">
            Google AI Studio <span className="text-muted font-normal text-sm bg-border/50 px-1.5 rounded">Build</span>
          </span>
          <div className="hidden md:block h-4 w-[1px] bg-border mx-1" />
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-panel-hover text-sm font-medium transition-colors border border-transparent hover:border-border group">
            Untitled App
            <ChevronDown className="w-4 h-4 text-muted group-hover:text-foreground" />
          </button>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="hidden sm:flex items-center gap-2 p-1.5 px-2 hover:bg-panel-hover rounded-md text-muted hover:text-foreground transition-colors text-sm font-medium">
            <GitFork className="w-4 h-4" />
            Remix
          </button>
          <button className="hidden sm:flex items-center gap-2 p-1.5 px-2 hover:bg-panel-hover rounded-md text-muted hover:text-foreground transition-colors text-sm font-medium border border-border">
            <GitCommit className="w-4 h-4" />
            Version
          </button>
          
          <div className="hidden sm:block h-3 w-[1px] bg-border mx-1" />

          <button onClick={() => setShowSecrets(true)} className="hidden sm:flex items-center gap-2 p-1.5 px-2 hover:bg-panel-hover rounded-md text-muted hover:text-foreground transition-colors text-sm font-medium">
            <Key className="w-4 h-4" />
            Secrets
          </button>
          
          <button onClick={() => setShowShare(true)} className="hidden sm:flex items-center gap-2 p-1.5 px-2 hover:bg-panel-hover rounded-md text-muted hover:text-foreground transition-colors text-sm font-medium">
            <Share className="w-4 h-4" />
            Share
          </button>
          
          <div className="hidden sm:block h-3 w-[1px] bg-border mx-1" />

          <button onClick={() => setShowExport(true)} className="hidden sm:flex items-center gap-2 p-1.5 px-2 hover:bg-panel-hover rounded-md text-muted hover:text-foreground transition-colors text-sm font-medium">
            <Github className="w-4 h-4" />
            Export
          </button>
          
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] ml-1">
             <Play className="w-4 h-4 fill-current" />
             Deploy
          </button>

          <button onClick={() => setShowProfile(true)} className="ml-2 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-primary/50 hover:ring-primary cursor-pointer transition-all">
            NX
          </button>

          <button onClick={() => setShowSettings(true)} className="ml-1 p-2 hover:bg-panel-hover rounded-full text-muted hover:text-foreground">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Panel: Chat / Prompt Area */}
        <section className="w-full md:w-[400px] lg:w-[480px] shrink-0 flex flex-col border-r border-border bg-background z-10 relative">
          
          {/* Agent/Model Selector */}
          <div className="h-12 border-b border-border flex items-center px-4 shrink-0 bg-background/95 backdrop-blur z-20">
            <div className="relative">
              <button onClick={() => setShowModelSelect(!showModelSelect)} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <span>{models.find(m => m.id === selectedModel)?.icon}</span>
                {models.find(m => m.id === selectedModel)?.name}
                <ChevronDown className="w-4 h-4 text-muted" />
              </button>
              
              {showModelSelect && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowModelSelect(false)} />
                  <div className="absolute top-full left-0 mt-2 w-56 bg-panel border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                    {models.map(m => (
                      <button key={m.id} onClick={() => { setSelectedModel(m.id); setShowModelSelect(false); }} className="w-full text-left px-4 py-2.5 hover:bg-background text-sm flex items-center gap-2 transition-colors">
                        <span>{m.icon}</span> {m.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center flex-col text-center mt-10">
                <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">What are we building today?</h2>
                <p className="text-muted text-sm max-w-[280px] leading-relaxed mb-10">
                  Set your Gemini API key in Settings, describe the web application you want to build, and I will generate the code and live preview.
                </p>
                
                <div className="w-full mt-auto pb-4 px-2">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-wider text-left pl-2 mb-2">Suggestions</p>
                  <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar px-2 snap-x">
                    {suggestions.map((suggestion, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="shrink-0 snap-start text-left px-4 py-2 rounded-full border border-border bg-panel hover:bg-panel-hover hover:border-primary/50 transition-colors text-sm text-gray-300 whitespace-nowrap"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
              <div key={msg.id} className={cn(
                "flex flex-col gap-2 max-w-[95%]",
                msg.role === 'user' ? "ml-auto" : "mr-auto"
              )}>
                <div className={cn(
                  "flex items-center gap-2 text-xs font-semibold mb-1 uppercase tracking-wider",
                  msg.role === 'user' ? "justify-end text-primary" : "text-muted"
                )}>
                  {msg.role === 'assistant' && <Sparkles className="w-3.5 h-3.5 text-orange-500" />}
                  {msg.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                
                <div className={cn(
                  "p-4 rounded-xl text-[14.5px] leading-relaxed antialiased shadow-sm",
                  msg.role === 'user' 
                    ? "bg-panel border border-primary/30 text-white rounded-br-sm shadow-[0_4px_20px_rgba(249,115,22,0.1)]" 
                    : "bg-panel/50 border border-border text-gray-200 rounded-tl-sm"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex flex-col gap-2 max-w-[85%] mr-auto">
                <div className="flex items-center gap-2 text-xs font-semibold mb-1 text-muted uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  AI Assistant
                </div>
                <div className="p-4 rounded-xl rounded-tl-sm bg-panel/50 border border-border flex items-center gap-2 h-14">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
            </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background border-t border-border shrink-0">
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {attachedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-panel border border-border px-2.5 py-1.5 rounded-lg text-xs">
                    <FileText className="w-3.5 h-3.5 text-muted" />
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-muted hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-panel border border-border rounded-2xl shadow-lg relative flex flex-col focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all group overflow-hidden group">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent p-4 min-h-[90px] max-h-[300px] resize-none focus:outline-none text-[15px] text-foreground placeholder:text-muted/70 custom-scrollbar"
                placeholder="Ask me to build or change something..."
              />
              
              <div className="flex items-center justify-between p-3 bg-panel/80">
                <div className="flex items-center gap-1 text-muted">
                  <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileAttach} />
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-background rounded-full hover:text-foreground transition-colors" title="Attach file">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-background rounded-full hover:text-foreground transition-colors" title="Voice dictation">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={handleSend}
                  disabled={!prompt.trim() || isTyping}
                  className={cn(
                    "w-10 h-10 rounded-full transition-all flex items-center justify-center relative shadow-sm",
                    prompt.trim() && !isTyping
                      ? "bg-primary text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:bg-primary-hover hover:scale-105" 
                      : "bg-background border border-border text-muted cursor-not-allowed"
                  )}
                >
                  <Send className={cn("w-4 h-4", prompt.trim() && !isTyping ? "ml-[-2px] mt-[1px]" : "")} />
                </button>
              </div>
            </div>
            <div className="text-center mt-3 flex items-center justify-center gap-4">
              <button onClick={() => setShowSettings(true)} className="text-[11px] text-muted hover:text-foreground font-medium tracking-wide uppercase transition-colors flex items-center gap-1 text-center">
                <Settings className="w-3" />
                Settings
              </button>
              <button className="text-[11px] text-muted hover:text-foreground font-medium tracking-wide uppercase transition-colors flex items-center gap-1 text-center">
                <History className="w-3" />
                History
              </button>
            </div>
          </div>
          
        </section>

        {/* Right Panel: Live Preview / Code */}
        <section className="flex-1 flex flex-col min-w-0 bg-[#1e1f20] relative border-l border-border md:border-none shadow-[-5px_0_20px_rgba(0,0,0,0.5)] z-20">
          
          {/* Tabs */}
          <div className="h-14 shrink-0 flex items-end px-4 border-b border-border bg-background pt-2 gap-2">
            <button 
              onClick={() => setActiveTab('preview')}
              className={cn(
                "px-5 py-2.5 text-[14px] font-medium rounded-t-xl flex items-center gap-2 border-t border-l border-r transition-all",
                activeTab === 'preview' 
                  ? "border-border bg-[#1e1f20] text-primary" 
                  : "border-transparent text-muted hover:text-foreground hover:bg-[#1e1f20]/50"
              )}
            >
              <MonitorPlay className={cn("w-4 h-4", activeTab === 'preview' ? "text-primary" : "")} />
              Preview
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={cn(
                "px-5 py-2.5 text-[14px] font-medium rounded-t-xl flex items-center gap-2 border-t border-l border-r transition-all",
                activeTab === 'code' 
                  ? "border-border bg-[#1e1f20] text-primary" 
                  : "border-transparent text-muted hover:text-foreground hover:bg-[#1e1f20]/50"
              )}
            >
              <FileCode2 className={cn("w-4 h-4", activeTab === 'code' ? "text-primary" : "")} />
              Code
            </button>
            
            <div className="flex-1 flex justify-end pb-2 hidden sm:flex">
              {activeTab === 'preview' && (
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg text-muted hover:bg-panel hover:text-foreground transition-colors">
                    <MonitorSmartphone className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-muted hover:bg-panel hover:text-foreground transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button className="ml-2 px-3 py-1.5 rounded-lg border border-border text-muted hover:bg-panel hover:text-foreground transition-colors flex items-center gap-1.5 text-xs font-medium">
                    <ExternalLink className="w-3.5 h-3.5" />
                    New Tab
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'preview' ? (
              <div className="w-full h-full bg-[#1e1f20] flex flex-col p-4 md:p-6 pb-0">
                <div className="flex-1 bg-white rounded-t-xl border border-border shadow-2xl flex flex-col overflow-hidden relative">
                  {/* Mock Browser Chrome */}
                  <div className="h-10 bg-[#18181b] border-b border-border flex items-center px-4 gap-4 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                      <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                      <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                    </div>
                    <div className="flex-1 max-w-lg mx-auto bg-[#27272a] rounded-md h-6 border border-white/5 flex items-center px-3 text-[12px] text-gray-400 font-mono">
                      https://preview-app-v{generationCount}.aistudio.run.app
                    </div>
                  </div>
                  
                  {/* Interactive App Preview */}
                  <div className="flex-1 overflow-hidden pointer-events-auto bg-white flex flex-col">
                     {!previewHtml ? (
                       <div className="flex-1 flex items-center justify-center flex-col text-gray-400 p-8 text-center">
                         <Sparkles className="w-12 h-12 text-primary opacity-50 mb-4" />
                         <p className="text-xl text-gray-500 font-medium">No preview available yet.</p>
                         <p className="max-w-xs mt-2 text-sm text-gray-400">Ask the AI to build something to see it rendered live here.</p>
                       </div>
                     ) : (
                       <iframe 
                         srcDoc={previewHtml}
                         className="w-full h-full border-none bg-white"
                         title="Preview"
                         sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
                       />
                     )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-[#1e1e1e] flex flex-col font-mono text-[13px]">
                {/* File Explorer + Editor split */}
                <div className="flex-1 flex overflow-hidden">
                  <div className="w-48 shrink-0 bg-[#161616] border-r border-[#333] hidden md:flex flex-col py-2">
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                      Explorer
                      <button className="hover:text-white"><FilePlus className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="px-4 py-1.5 text-orange-400 bg-white/5 cursor-pointer flex items-center gap-2 border-l-2 border-orange-500">
                      <FileCode2 className="w-4 h-4" /> index.html
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col relative w-full overflow-hidden">
                    <div className="h-10 bg-[#1e1e1e] border-b border-[#333] flex items-center px-2 shrink-0 justify-between">
                      <div className="flex h-full">
                        <div className="px-4 py-2 bg-[#1e1e1e] text-orange-400 border-t-2 border-orange-500 text-sm flex items-center gap-2">
                          <Code2 className="w-4 h-4" /> index.html
                        </div>
                      </div>
                      <button className="p-1 hover:bg-[#333] rounded text-gray-400 hover:text-white mr-2" title="Copy code">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto text-gray-300 leading-relaxed custom-scrollbar bg-[#1e1e1e]">
                      <pre className="m-0 break-all whitespace-pre-wrap font-mono text-sm max-w-full">
                        {previewHtml || "// No code generated yet. Type a prompt!"}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODALS */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-panel border border-border shadow-2xl rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-primary"/> Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted">Gemini API Key</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
                    <input 
                      type="password" 
                      value={apiKey} 
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-background border border-border pl-9 pr-3 py-2 rounded-lg text-sm focus-ring"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted mt-2">
                  Get your free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border flex justify-end">
              <button onClick={() => setShowSettings(false)} className="px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover shadow-sm">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showSecrets && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-panel border border-border shadow-2xl rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowSecrets(false)} className="absolute top-4 right-4 text-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Key className="w-5 h-5 text-primary"/> Environment Secrets</h2>
            <p className="text-muted text-sm mb-6">Manage sensitive configuration like API keys.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted">OPENAI_API_KEY</label>
                <input type="password" placeholder="sk-..." className="w-full bg-background border border-border px-3 py-2 rounded-lg text-sm focus-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted">STRIPE_SECRET_KEY</label>
                <input type="password" placeholder="sk_test_..." className="w-full bg-background border border-border px-3 py-2 rounded-lg text-sm focus-ring" />
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border flex justify-end">
              <button onClick={() => setShowSecrets(false)} className="px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover shadow-sm">
                Save Secrets
              </button>
            </div>
          </div>
        </div>
      )}

      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-panel border border-border shadow-2xl rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowShare(false)} className="absolute top-4 right-4 text-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Share className="w-5 h-5 text-primary"/> Share Project</h2>
            <p className="text-muted text-sm mb-6">Create a public link to share your generated application with others.</p>
            
            <div className="bg-background border border-border rounded-lg p-4 flex items-center justify-between mb-4">
              <span className="text-sm font-mono truncate text-muted">https://aistudio.run.app/share/x1y2z3...</span>
              <button className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-1">
                Copy
              </button>
            </div>

            <button onClick={() => setShowShare(false)} className="w-full px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover shadow-sm flex items-center justify-center gap-2">
               <Check className="w-4 h-4" /> Link Copied
            </button>
          </div>
        </div>
      )}

      {showExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-panel border border-border shadow-2xl rounded-2xl w-full max-w-sm p-6 relative">
            <button onClick={() => setShowExport(false)} className="absolute top-4 right-4 text-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Download className="w-5 h-5 text-primary"/> Export App</h2>
            <p className="text-muted text-sm mb-6">Download the source code or deploy to GitHub.</p>
            
            <div className="space-y-3">
              <button disabled className="w-full px-4 py-3 bg-background border border-border rounded-lg text-left hover:border-primary transition-colors flex flex-col opacity-50 cursor-not-allowed">
                <span className="font-medium text-foreground">Deploy to GitHub</span>
                <span className="text-xs text-muted">Create a new repository with this code.</span>
              </button>
              <button onClick={() => setShowExport(false)} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-left hover:border-primary transition-colors flex flex-col group">
                <span className="font-medium text-foreground group-hover:text-primary">Download as ZIP</span>
                <span className="text-xs text-muted">Download the source code locally.</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowProfile(false)}>
          <div className="absolute top-16 right-4 w-64 bg-panel border border-border shadow-2xl rounded-xl p-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                NX
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Nexus User</span>
                <span className="text-xs text-muted">nexus@commandnexus.net</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <button onClick={() => { setShowProfile(false); setShowSettings(true); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-background text-sm text-muted hover:text-foreground transition-colors">
                API Keys &amp; Configuration
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-background text-sm text-muted hover:text-foreground transition-colors">
                Billing &amp; Usage
              </button>
            </div>
            
            <div className="mt-2 pt-2 border-t border-border">
              <button onClick={() => setShowProfile(false)} className="w-full text-left px-3 py-2 rounded-md hover:bg-red-500/10 text-sm text-red-500 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


