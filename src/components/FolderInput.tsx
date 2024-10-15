import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useCallback } from "react";

export type FolderInputProps = {
  onSelect: (directory: FileSystemDirectoryHandle) => void;
  onErrorMessage?: (message: string) => void;
};

export default function FolderInput({ onSelect, onErrorMessage }: FolderInputProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.items.length > 0) {
        const item = e.dataTransfer.items[0];
        if (item.kind === "file") {
          try {
            const handle = await item.getAsFileSystemHandle();
            if (handle && handle.kind === "directory") {
              onSelect(handle as FileSystemDirectoryHandle);
            } else {
              onErrorMessage?.("Please drop a folder, not a file.");
            }
          } catch (error: any) {
            onErrorMessage?.(error.message);
          }
        }
      }
    },
    [onSelect, onErrorMessage]
  );

  const selectDirectory = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      onSelect(dirHandle);
    } catch (e: any) {
      if (e.name !== "AbortError") {
        onErrorMessage?.(e.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full mb-4">
      <label
        onClick={selectDirectory}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center w-full h-28 
          border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <FontAwesomeIcon
            className={`w-8 h-8 mb-1 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
            icon={faFolderPlus}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isDragging ? "Drop folder here" : "Select or drop a local directory"}
          </p>
        </div>
      </label>
    </div>
  );
}