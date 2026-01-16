// BlocklyWorkspace.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import Blockly from 'blockly';
import defineAllBlocks from './BlockDefinitions';
import { toolboxConfig } from './ToolboxConfig';
import { defineAllGenerators, generateCode } from './BedrockGenerator';

const BlocklyWorkspace = ({ onCodeChange, onDataChange }) => {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (!blocklyDiv.current) return;

    defineAllBlocks();
    defineAllGenerators();

    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxConfig,
      theme: Blockly.Themes.Dark,
      grid: { spacing: 20, length: 3, colour: '#3a3a3a', snap: true },
      zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3 },
      trashcan: true,
    });

    const handleChange = () => {
      if (!workspaceRef.current) return;
      try {
        const result = generateCode(workspaceRef.current);
        onCodeChange(result.code);
        onDataChange(result.data);
      } catch (e) {
        console.error(e);
      }
    };

    workspaceRef.current.addChangeListener(handleChange);
    handleChange();

    window.blocklyWorkspace = {
      clear: () => workspaceRef.current?.clear(),
      save: () => {
        const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
        const text = Blockly.Xml.domToText(xml);
        localStorage.setItem('blockly_workspace', text);
        return text;
      },
      load: (text) => {
        if (workspaceRef.current && text) {
          workspaceRef.current.clear();
          Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(text), workspaceRef.current);
        }
      }
    };

    return () => workspaceRef.current?.dispose();
  }, []);

  return <div ref={blocklyDiv} className="w-full h-full" style={{ minHeight: '500px' }} />;
};

export default BlocklyWorkspace;
