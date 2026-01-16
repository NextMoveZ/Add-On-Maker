// PreviewPanel.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Code, Database } from "lucide-react";
import { toast } from "sonner";

const PreviewPanel = ({ code, data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (content) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] border-l-4 border-[#2d2d2d]">
      <div className="p-3 bg-[#2d2d2d] border-b border-[#3a3a3a] flex items-center justify-between">
        <h2 className="text-white font-semibold flex items-center gap-2"><Code className="w-4 h-4 text-emerald-400" />Preview</h2>
        <Button size="sm" variant="ghost" onClick={() => handleCopy(code)} className="text-gray-400 hover:text-white">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsList className="bg-[#2d2d2d] rounded-none border-b border-[#3a3a3a] p-1">
          <TabsTrigger value="code" className="data-[state=active]:bg-[#3a3a3a] text-gray-400"><Code className="w-3 h-3 mr-1" />Script</TabsTrigger>
          <TabsTrigger value="json" className="data-[state=active]:bg-[#3a3a3a] text-gray-400"><Database className="w-3 h-3 mr-1" />JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="flex-1 m-0 overflow-auto p-3">
          <pre className="text-xs text-gray-300 font-mono">{code || '// Drag blocks to generate code'}</pre>
        </TabsContent>
        <TabsContent value="json" className="flex-1 m-0 overflow-auto p-3">
          <pre className="text-xs text-gray-300 font-mono">{JSON.stringify(data, null, 2)}</pre>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviewPanel;
