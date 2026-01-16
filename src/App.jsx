import React, { useState, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import BlocklyWorkspace from './components/blockly/BlocklyWorkspace';
import Toolbar from './components/addon-maker/Toolbar';
import PreviewPanel from './components/addon-maker/PreviewPanel';
import DataModal from './components/addon-maker/DataModal';
import { exportMcaddon } from './components/blockly/ExportMcaddon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function App() {
  const [code, setCode] = useState('');
  const [data, setData] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const handleCodeChange = useCallback((newCode) => setCode(newCode), []);
  const handleDataChange = useCallback((newData) => setData(newData), []);

  const handleNewProject = () => setShowNewProjectDialog(true);

  const confirmNewProject = () => {
    if (window.blocklyWorkspace) {
      window.blocklyWorkspace.clear();
      toast.success('New project created!');
    }
    setShowNewProjectDialog(false);
  };

  const handleExport = async () => {
    if (!data || (!data.items?.length && !data.blocks?.length && !data.entities?.length)) {
      toast.error('Please add some blocks first!');
      return;
    }
    setIsExporting(true);
    try {
      await exportMcaddon(data, code);
      toast.success('Exported successfully!');
    } catch (error) {
      toast.error('Failed to export');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    if (window.blocklyWorkspace) {
      window.blocklyWorkspace.save();
      toast.success('Project saved!');
    }
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('blockly_workspace');
    if (saved && window.blocklyWorkspace) {
      window.blocklyWorkspace.load(saved);
      toast.success('Project loaded!');
    } else {
      toast.error('No saved project found');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a] overflow-hidden">
      <Toaster position="top-right" theme="dark" />
      
      <Toolbar
        onNewProject={handleNewProject}
        onExport={handleExport}
        onViewData={() => setShowDataModal(true)}
        onSave={handleSave}
        onLoad={handleLoad}
        isExporting={isExporting}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <BlocklyWorkspace onCodeChange={handleCodeChange} onDataChange={handleDataChange} />
        </div>
        <div className="w-80 flex-shrink-0">
          <PreviewPanel code={code} data={data} />
        </div>
      </div>

      <DataModal open={showDataModal} onClose={() => setShowDataModal(false)} data={data} code={code} />

      <AlertDialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <AlertDialogContent className="bg-[#2d2d2d] border-[#3a3a3a] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Project?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will clear all current blocks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#3a3a3a] border-[#4a4a4a] text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNewProject} className="bg-emerald-600">Create New</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
