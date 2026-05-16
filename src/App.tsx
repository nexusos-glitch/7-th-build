import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Code, Play, ExternalLink, Settings, 
  ChevronDown, MessageSquare, MonitorPlay, 
  Send, History, FileCode2, Paperclip, Mic, MonitorSmartphone,
  Menu, Share, Download, Maximize2, MoreVertical
} from 'lucide-react';
import { cn } from './lib/utils';
import PreviewApp from './components/PreviewApp';

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
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      text: 'Hello! I am your AI Coding Assistant. Describe what you want to build, and I will write the code and render a live preview for you.'
    }
  ]);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!prompt.trim() || isTyping) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `I have updated the app with your latest requirements (Version ${generationCount + 1}). The Preview tab has been refreshed with the new features.`
      }]);
      setIsTyping(false);
      setGenerationCount(prev => prev + 1);
      setActiveTab('preview');
    }, 2000);
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
          <button className="hidden sm:flex items-center gap-2 p-2 px-3 hover:bg-panel-hover rounded-md text-muted hover:text-foreground transition-colors text-sm font-medium">
            <Share className="w-4 h-4" />
            Share
          </button>
          
          <button className="hidden sm:flex items-center gap-2 p-2 px-3 hover:bg-panel-hover rounded-md text-muted hover:text-foreground transition-colors text-sm font-medium border border-border">
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <div className="hidden sm:block h-4 w-[1px] bg-border mx-1" />
          
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]">
             <Play className="w-4 h-4 fill-current" />
             Deploy
          </button>

          <button className="ml-1 p-2 hover:bg-panel-hover rounded-full text-muted hover:text-foreground">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Panel: Chat / Prompt Area */}
        <section className="w-full md:w-[400px] lg:w-[480px] shrink-0 flex flex-col border-r border-border bg-background z-10 relative">
          
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background border-t border-border shrink-0">
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
                  <button className="p-2 hover:bg-background rounded-full hover:text-foreground transition-colors" title="Attach file">
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
              <button className="text-[11px] text-muted hover:text-foreground font-medium tracking-wide uppercase transition-colors flex items-center gap-1 text-center">
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
                <div className="flex-1 bg-black rounded-t-xl border border-border shadow-2xl flex flex-col overflow-hidden relative">
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
                  <div className="flex-1 overflow-hidden pointer-events-auto">
                     <PreviewApp />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-[#1e1e1e] flex flex-col font-mono text-[13px]">
                {/* File Explorer + Editor split */}
                <div className="flex-1 flex overflow-hidden">
                  <div className="w-48 shrink-0 bg-[#161616] border-r border-[#333] hidden md:flex flex-col py-2">
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Explorer</div>
                    <div className="px-4 py-1.5 text-orange-400 bg-white/5 cursor-pointer flex items-center gap-2 border-l-2 border-orange-500">
                      <FileCode2 className="w-4 h-4" /> App.tsx
                    </div>
                    <div className="px-4 py-1.5 text-gray-400 hover:text-gray-200 cursor-pointer flex items-center gap-2 border-l-2 border-transparent">
                      <FileCode2 className="w-4 h-4" /> index.css
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col relative">
                    <div className="h-10 bg-[#1e1e1e] border-b border-[#333] flex items-center px-2 shrink-0">
                      <div className="px-4 py-2 bg-[#1e1e1e] text-orange-400 border-t-2 border-orange-500">
                        App.tsx
                      </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto text-gray-300 leading-relaxed custom-scrollbar">
                      <pre className="m-0">
                        <code className="text-[#d4d4d4]">
<span className="text-[#c586c0]">import</span> <span className="text-[#9cdcfe]">React</span> <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">'react'</span>;<br/>
<span className="text-[#c586c0]">import</span> <span className="text-[#ffd700]">{'{'}</span> <span className="text-[#9cdcfe]">Activity</span>, <span className="text-[#9cdcfe]">Users</span>, <span className="text-[#9cdcfe]">DollarSign</span> <span className="text-[#ffd700]">{ '}' }</span> <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">'lucide-react'</span>;<br/>
<br/>
<span className="text-[#c586c0]">export</span> <span className="text-[#569cd6]">default</span> <span className="text-[#569cd6]">function</span> <span className="text-[#dcdcaa]">PreviewApp</span>() {'{'}<br/>
{'  '} <span className="text-[#c586c0]">const</span> [activeNav, setActiveNav] = <span className="text-[#dcdcaa]">useState</span>(<span className="text-[#ce9178]">'Overview'</span>);<br/>
<br/>
{'  '} <span className="text-[#c586c0]">return</span> (<br/>
{'    '}<span className="text-[#808080]">&lt;</span><span className="text-[#569cd6]">div</span> <span className="text-[#9cdcfe]">className</span>=<span className="text-[#ce9178]">"flex-1 w-full bg-[#0a0a0a] text-white"</span><span className="text-[#808080]">&gt;</span><br/>
{'      '}<span className="text-[#808080]">&lt;</span><span className="text-[#569cd6]">header</span> <span className="text-[#9cdcfe]">className</span>=<span className="text-[#ce9178]">"h-14 border-b border-white/10"</span><span className="text-[#808080]">&gt;</span><br/>
{'        '}<span className="text-[#808080]">&lt;</span><span className="text-[#569cd6]">h2</span> <span className="text-[#9cdcfe]">className</span>=<span className="text-[#ce9178]">"font-bold text-orange-500"</span><span className="text-[#808080]">&gt;</span>Nexus Dashboard<span className="text-[#808080]">&lt;/</span><span className="text-[#569cd6]">h2</span><span className="text-[#808080]">&gt;</span><br/>
{'      '}<span className="text-[#808080]">&lt;/</span><span className="text-[#569cd6]">header</span><span className="text-[#808080]">&gt;</span><br/>
{'      '}<span className="text-[#6a9955]">{`// Generated UI version ${generationCount}`}</span><br/>
{'    '}<span className="text-[#808080]">&lt;/</span><span className="text-[#569cd6]">div</span><span className="text-[#808080]">&gt;</span><br/>
{'  '});<br/>
{'}'}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </section>
      </main>
    </div>
  );
}


