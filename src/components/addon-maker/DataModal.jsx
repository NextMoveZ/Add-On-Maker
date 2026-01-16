// DataModal.jsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

const DataModal = ({ open, onClose, data, code }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('Copied!');
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'addon_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#1e1e1e] border-[#3a3a3a] text-white">
        <DialogHeader>
          <DialogTitle>Addon Data - {data?.addonName || 'MyAddon'}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={handleCopy} className="bg-transparent border-gray-600 text-gray-300">
            <Copy className="w-4 h-4 mr-1" />Copy
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload} className="bg-transparent border-gray-600 text-gray-300">
            <Download className="w-4 h-4 mr-1" />Download
          </Button>
        </div>
        <pre className="text-xs text-gray-300 font-mono overflow-auto max-h-96 bg-[#2d2d2d] p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      </DialogContent>
    </Dialog>
  );
};

export default DataModal;
