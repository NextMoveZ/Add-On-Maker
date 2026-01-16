// Toolbar.jsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown, FilePlus, Eye, Save, FolderOpen, Pickaxe } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Toolbar = ({ onNewProject, onExport, onViewData, onSave, onLoad, isExporting }) => {
  return (
    <div className="bg-gradient-to-r from-[#2d2d2d] via-[#3a3a3a] to-[#2d2d2d] border-b-4 border-[#1a1a1a]">
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
            <Pickaxe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white"><span className="text-emerald-400">Minecraft</span> Bedrock Addon Maker</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip><TooltipTrigger asChild><Button onClick={onNewProject} variant="outline" className="bg-[#4a4a4a] border-[#5a5a5a] text-white"><FilePlus className="w-4 h-4 mr-2" />New</Button></TooltipTrigger><TooltipContent><p>New Project</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button onClick={onSave} variant="outline" className="bg-[#4a4a4a] border-[#5a5a5a] text-white"><Save className="w-4 h-4 mr-2" />Save</Button></TooltipTrigger><TooltipContent><p>Save</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button onClick={onLoad} variant="outline" className="bg-[#4a4a4a] border-[#5a5a5a] text-white"><FolderOpen className="w-4 h-4 mr-2" />Load</Button></TooltipTrigger><TooltipContent><p>Load</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button onClick={onViewData} variant="outline" className="bg-blue-600 border-blue-500 text-white"><Eye className="w-4 h-4 mr-2" />View Data</Button></TooltipTrigger><TooltipContent><p>View Data</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button onClick={onExport} disabled={isExporting} className="bg-emerald-600 hover:bg-emerald-700 text-white"><FileDown className="w-4 h-4 mr-2" />{isExporting ? 'Exporting...' : 'Export'}</Button></TooltipTrigger><TooltipContent><p>Export .mcaddon</p></TooltipContent></Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
