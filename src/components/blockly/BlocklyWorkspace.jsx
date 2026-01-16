// components/blockly/BlocklyWorkspace.jsx
// Component หลักสำหรับ Blockly Workspace

import React, { useEffect, useRef, useCallback } from 'react';
import Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import defineAllBlocks from './BlockDefinitions';
import { toolboxConfig } from './ToolboxConfig';
import { defineAllGenerators, generateCode } from './BedrockGenerator';

const BlocklyWorkspace = ({ onCodeChange, onDataChange }) => {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  // ===== Initialize Blockly =====
  useEffect(() => {
    if (!blocklyDiv.current) return;

    // กำหนด Custom Blocks
    defineAllBlocks();
    
    // กำหนด Generators
    defineAllGenerators();

    // สร้าง Workspace
    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxConfig,
      theme: Blockly.Themes.Dark,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#3a3a3a',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      trashcan: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true
      },
      sounds: false
    });

    // เพิ่ม default blocks
    const defaultXml = `
      <xml>
        <block type="addon_start" x="50" y="50">
          <field name="ADDON_NAME">MyAddon</field>
        </block>
      </xml>
    `;
    
    try {
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(defaultXml),
        workspaceRef.current
      );
    } catch (e) {
      console.log('Default block loaded');
    }

    // Listener สำหรับ workspace changes
    const handleWorkspaceChange = () => {
      if (!workspaceRef.current) return;
      
      try {
        const result = generateCode(workspaceRef.current);
        onCodeChange(result.code);
        onDataChange(result.data);
      } catch (e) {
        console.error('Code generation error:', e);
      }
    };

    workspaceRef.current.addChangeListener(handleWorkspaceChange);
    
    // Generate initial code
    handleWorkspaceChange();

    // Cleanup
    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []);

  // ===== Clear Workspace =====
  const clearWorkspace = useCallback(() => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      
      // เพิ่ม default block กลับมา
      const defaultXml = `
        <xml>
          <block type="addon_start" x="50" y="50">
            <field name="ADDON_NAME">MyAddon</field>
          </block>
        </xml>
      `;
      
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(defaultXml),
        workspaceRef.current
      );
    }
  }, []);

  // ===== Save Workspace =====
  const saveWorkspace = useCallback(() => {
    if (workspaceRef.current) {
      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      const xmlText = Blockly.Xml.domToText(xml);
      localStorage.setItem('blockly_workspace', xmlText);
      return xmlText;
    }
    return null;
  }, []);

  // ===== Load Workspace =====
  const loadWorkspace = useCallback((xmlText) => {
    if (workspaceRef.current && xmlText) {
      workspaceRef.current.clear();
      const xml = Blockly.utils.xml.textToDom(xmlText);
      Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
    }
  }, []);

  // Expose methods to parent
  useEffect(() => {
    window.blocklyWorkspace = {
      clear: clearWorkspace,
      save: saveWorkspace,
      load: loadWorkspace,
      getWorkspace: () => workspaceRef.current
    };
  }, [clearWorkspace, saveWorkspace, loadWorkspace]);

  return (
    <>
      <style>{`
        .blocklyToolboxDiv {
          background-color: #2d2d2d !important;
          padding: 8px 0 !important;
        }
        .blocklyTreeRow {
          padding: 6px 12px !important;
          margin: 2px 4px !important;
          border-radius: 4px !important;
        }
        .blocklyTreeRow:hover {
          background-color: #3a3a3a !important;
        }
        .blocklyTreeLabel {
          font-size: 13px !important;
          color: #fff !important;
        }
        .blocklyTreeSeparator {
          border-bottom: 1px solid #3a3a3a !important;
          margin: 8px 0 !important;
        }
        .blocklyFlyout {
          background-color: #252525 !important;
        }
        .blocklyScrollbarHandle {
          fill: #4a4a4a !important;
        }
        .blocklyMainBackground {
          fill: #1a1a1a !important;
        }
      `}</style>
      <div 
        ref={blocklyDiv} 
        className="w-full h-full"
        style={{ minHeight: '500px', height: '100%' }}
      />
    </>
  );
};

export default BlocklyWorkspace;
