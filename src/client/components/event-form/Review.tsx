import React from 'react';
import {useState} from 'react';
import dayjs from 'dayjs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/seperator';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Check, X, Pencil } from 'lucide-react';
function Review({formInfo, nullFields, handleFieldChange}) {
    const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
    const [tempValues, setTempValues] = useState<Record<string, any>>({});

    const toggleEdit = (fieldName: string, save: boolean = false) => {
        if (save) {
            handleFieldChange(fieldName, tempValues[fieldName]);
        } else {
            setTempValues(prev => ({
                ...prev,
                [fieldName]: formInfo[fieldName]
            }));
        }

        setEditingFields(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    const handleTempChange = (fieldName: string, value: any) => {
        setTempValues(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const EditableField = ({ label, value, fieldName, type = 'text' }) => {
        const isEditing = editingFields[fieldName];

        React.useEffect(() => {
            if (isEditing && tempValues[fieldName] === undefined) {
                setTempValues(prev => ({
                    ...prev,
                    [fieldName]: value
                }));
            }
        }, [isEditing]);

        return (
            <>
                <p className="text-gray-400">{label}:</p>
                <div className="relative group">
                    {isEditing ? (
                        <div className="flex gap-2 items-start">
                            {type === 'textarea' ? (
                                <Textarea
                                    value={tempValues[fieldName] ?? value ?? ''}
                                    onChange={(e) => handleTempChange(fieldName, e.target.value)}
                                    className="flex-1 bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white"
                                    autoFocus
                                />
                            ) : (
                                <Input
                                    value={tempValues[fieldName] ?? value ?? ''}
                                    onChange={(e) => handleTempChange(fieldName, e.target.value)}
                                    className="flex-1 bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white"
                                    autoFocus
                                />
                            )}
                            <div className="flex gap-1">
                                <button
                                    onClick={() => toggleEdit(fieldName, false)}
                                    className="p-2 hover:bg-orange-500/20 rounded-md"
                                >
                                    <X className="w-5 h-5 text-gray-400 hover:text-white" />
                                </button>
                                <button
                                    onClick={() => toggleEdit(fieldName, true)}
                                    className="p-2 hover:bg-orange-500/20 rounded-md"
                                >
                                    <Check className="w-5 h-5 text-orange-500 hover:text-orange-400" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="flex items-center gap-2 group cursor-pointer p-2 hover:bg-orange-500/10 rounded-md"
                                        onClick={() => toggleEdit(fieldName)}
                                    >
                                        <p className="text-white flex-1">{value || 'Not specified'}</p>
                                        <Pencil className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Click to edit</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </>
        );
    };



    return (
        <div className="flex-1">
            <div className="p-6 border-b border-orange-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    Review Details
                </h2>
                <p className="text-sm text-gray-400">
                    Confirm your event details before creating
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="backdrop-blur-lg bg-black/30 rounded-xl border border-orange-500/20 p-6">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        Event Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <EditableField
                            label="Title"
                            value={formInfo.title}
                            fieldName="title"
                        />

                        <EditableField
                            label="Description"
                            value={formInfo.description}
                            fieldName="description"
                            type="textarea"
                        />

                        <EditableField
                            label="Category"
                            value={formInfo.category}
                            fieldName="category"
                        />

                        <p className="text-gray-400">Interests:</p>
                        <p className="text-white">{formInfo.interests.join(', ')}</p>

                        <p className="text-gray-400">Start Date:</p>
                        <p className="text-white">{dayjs(formInfo.startDate).format("MMM D, YYYY")}</p>

                        <p className="text-gray-400">Start Time:</p>
                        <p className="text-white">{dayjs(`2024-01-01T${formInfo.startTime}`).format("h:mm A")}</p>

                        <p className="text-gray-400">End Time:</p>
                        <p className="text-white">{dayjs(`2024-01-01T${formInfo.endTime}`).format("h:mm A")}</p>
                    </div>
                </div>

                <div className="backdrop-blur-lg bg-black/30 rounded-xl border border-orange-500/20 p-6">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        Venue Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <p className="text-gray-400">Venue Name:</p>
                        <p className="text-white">{formInfo.venue}</p>

                        <EditableField
                            label="Description"
                            value={formInfo.venueDescription}
                            fieldName="venueDescription"
                            type="textarea"
                        />

                        <EditableField
                            label="Phone"
                            value={formInfo.phone}
                            fieldName="phone"
                        />

                        <EditableField
                            label="Website"
                            value={formInfo.website}
                            fieldName="website"
                        />

                        <p className="text-gray-400">Wheelchair Accessible:</p>
                        <div className="relative group">
                            {editingFields.wheelchair_accessible ? (
                                <div className="flex gap-2 items-center">
                                    <Select
                                        value={tempValues.wheelchair_accessible === null ? "unknown" : tempValues.wheelchair_accessible ? "1" : "0"}
                                        onValueChange={(value) => handleTempChange('wheelchair_accessible', value === "unknown" ? null : value === "1")}
                                        className="flex-1"
                                    >
                                        <SelectTrigger
                                            className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900/95 border-orange-500/30">
                                            <SelectItem value="1"
                                                        className="text-white hover:bg-orange-500/30">Yes</SelectItem>
                                            <SelectItem value="0"
                                                        className="text-white hover:bg-orange-500/30">No</SelectItem>
                                            <SelectItem value="unknown" className="text-white hover:bg-orange-500/30">Not
                                                Sure</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => toggleEdit('wheelchair_accessible', false)}
                                            className="p-2 hover:bg-orange-500/20 rounded-md"
                                        >
                                            <X className="w-5 h-5 text-gray-400 hover:text-white"/>
                                        </button>
                                        <button
                                            onClick={() => toggleEdit('wheelchair_accessible', true)}
                                            className="p-2 hover:bg-orange-500/20 rounded-md"
                                        >
                                            <Check className="w-5 h-5 text-orange-500 hover:text-orange-400"/>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="flex items-center gap-2 group cursor-pointer p-2 hover:bg-orange-500/10 rounded-md"
                                                onClick={() => toggleEdit('wheelchair_accessible')}
                                            >
                                                <p className="text-white flex-1">
                                                    {formInfo.wheelchair_accessible === null
                                                        ? 'Not specified'
                                                        : formInfo.wheelchair_accessible
                                                            ? 'Yes'
                                                            : 'No'}
                                                </p>
                                                <Pencil
                                                    className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Click to edit</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>

                        <p className="text-gray-400">Serves Alcohol:</p>
                        <div className="relative group">
                            {editingFields.serves_alcohol ? (
                                <div className="flex gap-2 items-center">
                                    <Select
                                        value={tempValues.serves_alcohol === null ? "unknown" : tempValues.serves_alcohol ? "1" : "0"}
                                        onValueChange={(value) => handleTempChange('serves_alcohol', value === "unknown" ? null : value === "1")}
                                        className="flex-1"
                                    >
                                        <SelectTrigger
                                            className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900/95 border-orange-500/30">
                                            <SelectItem value="1"
                                                        className="text-white hover:bg-orange-500/30">Yes</SelectItem>
                                            <SelectItem value="0"
                                                        className="text-white hover:bg-orange-500/30">No</SelectItem>
                                            <SelectItem value="unknown" className="text-white hover:bg-orange-500/30">Not
                                                Sure</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => toggleEdit('serves_alcohol')}
                                            className="p-2 hover:bg-orange-500/20 rounded-md"
                                        >
                                            <X className="w-5 h-5 text-gray-400 hover:text-white"/>
                                        </button>
                                        <button
                                            onClick={() => toggleEdit('serves_alcohol')}
                                            className="p-2 hover:bg-orange-500/20 rounded-md"
                                        >
                                            <Check className="w-5 h-5 text-orange-500 hover:text-orange-400"/>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="flex items-center gap-2 group cursor-pointer p-2 hover:bg-orange-500/10 rounded-md"
                                                onClick={() => toggleEdit('serves_alcohol')}
                                            >
                                                <p className="text-white flex-1">
                                                    {formInfo.serves_alcohol === null
                                                        ? 'Not specified'
                                                        : formInfo.serves_alcohol
                                                            ? 'Yes'
                                                            : 'No'}
                                                </p>
                                                <Pencil
                                                    className="w-5 h-5 text-oraspotifynge-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Click to edit</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>
                </div>

                <Separator className="border-orange-500/20"/>

                <div className="text-center">
                    <p className="text-sm bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                        Ready to create your memorable moment?
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Review;