import React, { useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check } from 'lucide-react';

function ItemSelection({ items, selectedItems, onSelect, labelField, placeholder = `Search ${labelField}s...` }) {
    // sort items to show selected ones at top of list
    // but maintain original order during selection
    const sortedItems = useMemo(() => {
        // return items in original order
        return items;
    }, [items]);

    // when user clicks an item in the list
    const toggleItem = (item) => {
        // check if item is already selected
        const isSelected = selectedItems.some(i => i.id === item.id);
        
        if (isSelected) {
            // if selected, remove it from selectedItems
            onSelect(selectedItems.filter(i => i.id !== item.id));
        } else {
            // if not selected, add it to end of selectedItems
            onSelect([...selectedItems, item]);
        }
    };

    return (
        <Command className="rounded-lg border border-orange-500/30 bg-black/80">
            <CommandInput 
                placeholder={placeholder}
                className="border-none bg-transparent text-white placeholder:text-gray-400"
            />
            <CommandEmpty className="text-gray-400 p-2 text-sm">No items found.</CommandEmpty>
            <CommandGroup className="max-h-[40vh] sm:max-h-[200px] overflow-auto">
                {sortedItems.map((item) => (
                    <CommandItem
                        key={item.id}
                        onSelect={() => toggleItem(item)}
                        className="text-white hover:bg-orange-500/30 cursor-pointer text-sm aria-selected:bg-orange-500/30 px-2 py-1.5"
                    >
                        <div className="flex items-center gap-2 w-full">
                            <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                {selectedItems.some(i => i.id === item.id) && (
                                    <Check className="h-4 w-4 text-orange-500" />
                                )}
                            </div>
                            <span className="truncate">{item[labelField]}</span>
                        </div>
                    </CommandItem>
                ))}
            </CommandGroup>
        </Command>
    );
}

export default ItemSelection;