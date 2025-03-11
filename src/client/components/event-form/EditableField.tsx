import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, X, Pencil } from 'lucide-react';

interface EditableFieldProps {
  label: string;
  value: string;
  fieldName: string;
  type?: 'text' | 'textarea';
  forceReadOnly?: boolean;
  placeholder?: string;
  onSave: (fieldName: string, value: string) => void;
}

// this component lets users edit fields in the review step
// it's wrapped in React.memo to prevent unnecessary rerenders that were clearing input fields while editing
const EditableField = React.memo(({
  label,
  value,
  fieldName,
  type = 'text',
  forceReadOnly = false,
  placeholder,
  onSave
}: EditableFieldProps) => {
  // tracks if we're currently editing this field
  const [isEditing, setIsEditing] = useState(false);
  // ref to access the input element directly
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  // switches to edit mode
  const startEditing = () => {
    setIsEditing(true);
  };
  
  // cancels editing without saving changes
  const cancelEditing = () => {
    setIsEditing(false);
  };
  
  // saves changes if the value actually changed
  const saveChanges = () => {
    if (inputRef.current && inputRef.current.value !== value) {
      onSave(fieldName, inputRef.current.value);
    }
    setIsEditing(false);
  };
  
  return (
    <>
      <p className="text-gray-400 text-sm sm:text-base">{label}:</p>
      <div className="relative group">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-2">
            {type === 'textarea' ? (
              <Textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                defaultValue={value || ''}
                placeholder={placeholder}
                className="flex-1 bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white text-sm sm:text-base"
                autoFocus
              />
            ) : (
              <Input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                defaultValue={value || ''}
                placeholder={placeholder}
                className="flex-1 bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white text-sm sm:text-base"
                autoFocus
              />
            )}
            <div className="flex justify-end sm:justify-start gap-1">
              <button
                onClick={cancelEditing}
                className="p-2 hover:bg-orange-500/20 rounded-md"
                type="button"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
              <button
                onClick={saveChanges}
                className="p-2 hover:bg-orange-500/20 rounded-md"
                type="button"
              >
                <Check className="w-5 h-5 text-orange-500 hover:text-orange-400" />
              </button>
            </div>
          </div>
        ) : (
          !forceReadOnly ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center gap-2 group cursor-pointer p-2 hover:bg-orange-500/10 rounded-md"
                    onClick={startEditing}
                  >
                    <p className="text-white flex-1 break-words text-sm sm:text-base">
                      {value || placeholder || 'Not specified'}
                    </p>
                    <Pencil className="w-5 h-5 shrink-0 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="p-2">
              <p className="text-white flex-1 break-words text-sm sm:text-base">
                {value || 'Not specified'}
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
});

export default EditableField;