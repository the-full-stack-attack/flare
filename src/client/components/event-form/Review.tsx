import React from 'react';
import {useState, useEffect, useRef} from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/seperator';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Check, X, Pencil, ChevronDown, AlertCircle } from 'lucide-react';
import axios from 'axios';
import ImageSelection from './ImageSelection';
import ItemSelection from './ItemSelection';
import EditableField from './EditableField';
import dayjs from 'dayjs';


// review is the final step of the event creation flow
// it shows all entered data and lets users edit any field before submitting
// it receives formInfo (current data), nullFields (missing data), and handleFieldChange (update function)
function Review({formInfo, nullFields, handleFieldChange, setFormInfo}) {
    // tracks which fields are currently being edited
    const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
    // holds temporary values while user is editing, before saving
    const [tempValues, setTempValues] = useState<Record<string, any>>({});
    // state for venue categories dropdown
    const [categories, setCategories] = useState([]);
    // state for interests selection
    const [allInterests, setAllInterests] = useState([]);
    const [suggestedInterests, setSuggestedInterests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [venueTags, setVenueTags] = useState([]);
    const [newTagInput, setNewTagInput] = useState('');

    // fetch categories and interests when component mounts
    useEffect(() => {
        getCategories();
        getInterests();
    }, []);

    // get venue tags whenever the venue changes
    useEffect(() => {
        const getVenueTags = async () => {
            if (formInfo.Venue?.id) {
                try {
                    const response = await axios.get(`/api/venue/tags/${formInfo.Venue.id}`);
                    setVenueTags(response.data);
                } catch (error) {
                    console.error('Error getting venue tags:', error);
                }
            }
        };

        getVenueTags();
    }, [formInfo.Venue?.id]);

    // get all possible categories for the dropdown
    const getCategories = async () => {
        try {
            const response = await axios.get('/api/event/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // get all possible interests for the multiselect
    const getInterests = async () => {
        try {
            const response = await axios.get('/api/signup/interests');
            setAllInterests(response.data);
        } catch (error) {
            console.error('Error fetching interests:', error);
        }
    };

    // handles toggling edit mode and saving changes
    const toggleEdit = (fieldName: string, save: boolean = false) => {
        // if saving, update the main form data
        if (save) {
            // if editing tags, update the form data with the selected tags + display order
            if (fieldName === 'tags') {
                setFormInfo(prev => ({
                    ...prev,
                    selectedTags: tempValues.tags.map((tag, index) => ({
                        ...tag,
                        display_order: index 
                    }))
                }));
            // if editing other fields, update the form data with the new value
            } else {
                handleFieldChange(fieldName, tempValues[fieldName]);
            }
        }

        // if entering edit mode
        if (!editingFields[fieldName]) {
            if (fieldName === 'tags') {
                // sort tags to show selected ones at top
                const sortedTags = [...venueTags].sort((a, b) => {
                    const aSelected = formInfo.selectedTags?.some(tag => tag.id === a.id) ?? false;
                    const bSelected = formInfo.selectedTags?.some(tag => tag.id === b.id) ?? false;
                    if (aSelected && !bSelected) return -1;
                    if (!aSelected && bSelected) return 1;
                    return 0;
                });
                
                setVenueTags(sortedTags);
                setTempValues(prev => ({
                    ...prev,
                    tags: formInfo.selectedTags || []
                }));
            } else if (fieldName === 'interests') {
                // initialize temp tags with current selection
                setTempValues(prev => ({
                    ...prev,
                    interests: formInfo.interests || []
                }));
            } else {
                // handle other fields normally
                setTempValues(prev => ({
                    ...prev,
                    [fieldName]: formInfo[fieldName]
                }));
            }
        }

        // toggle edit mode for this field
        setEditingFields(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    // update temporary values as user selects
    const handleTempChange = (fieldName: string, value: any) => {
        setTempValues(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    // filters interests based on user search input
    const handleInterestSearch = (searchValue: string) => {
        setSearchTerm(searchValue);
        if (searchValue.trim()) {
            const filtered = allInterests.filter(interest =>
                interest.toLowerCase().includes(searchValue.toLowerCase()) &&
                !tempValues.interests?.includes(interest)
            );
            setSuggestedInterests(filtered);
        } else {
            setSuggestedInterests([]);
        }
    };

    // adds a new interest to the temporary selection
    const addInterest = (interest: string) => {
        const newInterests = [...(tempValues.interests || [])];
        if (!newInterests.includes(interest)) {
            newInterests.push(interest);
            handleTempChange('interests', newInterests);
        }
        setSearchTerm('');
        setSuggestedInterests([]);
    };

    // removes an interest from the temporary selection
    const removeInterest = (interestToRemove: string) => {
        const newInterests = tempValues.interests.filter(interest => interest !== interestToRemove);
        handleTempChange('interests', newInterests);
    };

    // upfdate required fields to include date and time
    const isRequiredEmpty = (fieldName) => {
        const requiredFields = [
            'title', 
            'description', 
            'category', 
            'interests',
            'venue',
            'venueDescription',
            'phone',
            'website',
            'startDate',   
            'startTime',
            'endTime'
        ];
        
        // check if this field is required and empty/null
        return requiredFields.includes(fieldName) && 
               (formInfo[fieldName] === null || 
                formInfo[fieldName] === undefined || 
                formInfo[fieldName] === '' ||
                (Array.isArray(formInfo[fieldName]) && formInfo[fieldName].length === 0));
    };

    // helper function to check if venue images are missing
    const isMissingVenueImages = () => {
        return !formInfo.selectedImages || formInfo.selectedImages.length === 0;
    };

    // helper function to check if venue tags are missing
    const isMissingVenueTags = () => {
        return !formInfo.selectedTags || formInfo.selectedTags.length === 0;
    };

    // helper function to render field notification if needed
    const renderFieldNotification = (fieldName, message) => {
        if (isRequiredEmpty(fieldName)) {
            return (
                <div className="flex items-center gap-1 text-sm text-orange-400 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{message || 'Required field'}</span>
                </div>
            );
        }
        return null;
    };

    // handle adding a new custom tag
    const handleAddCustomTag = (e) => {
        // vhevck if Enter key was pressed or if there's a comma in the input
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            
            // get the tag text (remove comma if present)
            const tagText = newTagInput.replace(',', '').trim();
            
            if (tagText) {
                // create a tag object
                const newTag = {
                    id: Date.now(), 
                    tag: tagText,   
                };
                
                // add to temp values
                const updatedTags = [...(tempValues.tags || []), newTag];
                handleTempChange('tags', updatedTags);
                
                // clear the input
                setNewTagInput('');
            }
        }
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

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="backdrop-blur-lg bg-black/30 rounded-xl border border-orange-500/20 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        Event Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <EditableField
                                label="Title"
                                value={formInfo.title}
                                fieldName="title"
                                onSave={(fieldName, value) => handleFieldChange(fieldName, value)}
                            />
                            {renderFieldNotification('title', 'Please add a title')}
                        </div>

                        <div>
                            <EditableField
                                label="Description"
                                value={formInfo.description}
                                fieldName="description"
                                type="textarea"
                                onSave={(fieldName, value) => handleFieldChange(fieldName, value)}
                            />
                            {renderFieldNotification('description', 'Please add a description')}
                        </div>

                        <div>
                            <p className="text-gray-400">Category:</p>
                            <div className="relative group">
                                {editingFields.category ? (
                                    <div className="flex gap-2 items-center">
                                        <Select
                                            value={tempValues.category ?? formInfo.category}
                                            onValueChange={(value) => handleTempChange('category', value)}
                                            className="flex-1"
                                        >
                                            <SelectTrigger className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white text-sm sm:text-base min-h-[2.5rem]">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900/95 border-orange-500/30">
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.name}
                                                        className="text-white hover:bg-orange-500/30"
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => toggleEdit('category', false)}
                                                className="p-2 hover:bg-orange-500/20 rounded-md"
                                            >
                                                <X className="w-5 h-5 text-gray-400 hover:text-white"/>
                                            </button>
                                            <button
                                                onClick={() => toggleEdit('category', true)}
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
                                                    onClick={() => toggleEdit('category')}
                                                >
                                                    <p className="text-white flex-1">{formInfo.category || 'Not specified'}</p>
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
                            {renderFieldNotification('category', 'Please select a category')}
                        </div>

                        <div>
                            <p className="text-gray-400">Interests:</p>
                            <div className="relative group">
                                {editingFields.interests ? (
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <ItemSelection
                                            items={allInterests.map(interest => ({
                                                id: interest,
                                                interest: interest
                                            }))}
                                            selectedItems={tempValues.interests?.map(interest => ({
                                                id: interest,
                                                interest: interest
                                            })) || []}
                                            onSelect={(interests) => handleTempChange('interests', interests.map(i => i.interest))}
                                            labelField="interest"
                                        />
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => toggleEdit('interests', false)}
                                                className="p-2 hover:bg-orange-500/20 rounded-md"
                                            >
                                                <X className="w-5 h-5 text-gray-400 hover:text-white"/>
                                            </button>
                                            <button
                                                onClick={() => toggleEdit('interests', true)}
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
                                                    onClick={() => toggleEdit('interests')}
                                                >
                                                    <p className="text-white flex-1">
                                                        {formInfo.interests?.join(', ') || 'Not specified'}
                                                    </p>
                                                    <Pencil className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Click to edit</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                            {renderFieldNotification('interests', 'Please select at least one interest')}
                        </div>

                        <div>
                            <p className="text-gray-400">Event Date:</p>
                            <div className="relative group">
                                {editingFields.startDate ? (
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="date"
                                            value={tempValues.startDate || ''}
                                            onChange={(e) => handleTempChange('startDate', e.target.value)}
                                            className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white text-sm sm:text-base min-h-[2.5rem]"
                                        />
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => toggleEdit('startDate', false)}
                                                className="p-2 hover:bg-orange-500/20 rounded-md"
                                            >
                                                <X className="w-5 h-5 text-gray-400 hover:text-white"/>
                                            </button>
                                            <button
                                                onClick={() => toggleEdit('startDate', true)}
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
                                                    onClick={() => toggleEdit('startDate')}
                                                >
                                                    <p className="text-white flex-1">
                                                        {formInfo.startDate 
                                                            ? dayjs(formInfo.startDate).format('MMMM D, YYYY') 
                                                            : 'Not specified'}
                                                    </p>
                                                    <Pencil className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Click to edit</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                            {renderFieldNotification('startDate', 'Please select a date')}
                        </div>

                        <div>
                            <p className="text-gray-400">Start Time:</p>
                            <div className="relative group">
                                {editingFields.startTime ? (
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="time"
                                            value={tempValues.startTime || ''}
                                            onChange={(e) => handleTempChange('startTime', e.target.value)}
                                            className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white text-sm sm:text-base min-h-[2.5rem]"
                                        />
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => toggleEdit('startTime', false)}
                                                className="p-2 hover:bg-orange-500/20 rounded-md"
                                            >
                                                <X className="w-5 h-5 text-gray-400 hover:text-white"/>
                                            </button>
                                            <button
                                                onClick={() => toggleEdit('startTime', true)}
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
                                                    onClick={() => toggleEdit('startTime')}
                                                >
                                                    <p className="text-white flex-1">
                                                        {formInfo.startTime 
                                                            ? dayjs(`2000-01-01T${formInfo.startTime}`).format('h:mm A')
                                                            : 'Not specified'}
                                                    </p>
                                                    <Pencil className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Click to edit</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                            {renderFieldNotification('startTime', 'Please select a start time')}
                        </div>

                        <div>
                            <p className="text-gray-400">End Time:</p>
                            <div className="relative group">
                                {editingFields.endTime ? (
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="time"
                                            value={tempValues.endTime || ''}
                                            onChange={(e) => handleTempChange('endTime', e.target.value)}
                                            className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white text-sm sm:text-base min-h-[2.5rem]"
                                        />
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => toggleEdit('endTime', false)}
                                                className="p-2 hover:bg-orange-500/20 rounded-md"
                                            >
                                                <X className="w-5 h-5 text-gray-400 hover:text-white"/>
                                            </button>
                                            <button
                                                onClick={() => toggleEdit('endTime', true)}
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
                                                    onClick={() => toggleEdit('endTime')}
                                                >
                                                    <p className="text-white flex-1">
                                                        {formInfo.endTime 
                                                            ? dayjs(`2000-01-01T${formInfo.endTime}`).format('h:mm A')
                                                            : 'Not specified'}
                                                    </p>
                                                    <Pencil className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Click to edit</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                            {renderFieldNotification('endTime', 'Please select an end time')}
                        </div>
                    </div>
                </div>


                <div className="backdrop-blur-lg bg-black/30 rounded-xl border border-orange-500/20 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        Venue Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <EditableField
                                label="Venue Name"
                                value={formInfo.venue}
                                fieldName="venue"
                                onSave={(fieldName, value) => handleFieldChange(fieldName, value)}
                            />
                            {renderFieldNotification('venue', 'Please select or enter a venue')}
                        </div>

                        <div>
                            <EditableField
                                label="Description"
                                value={formInfo.venueDescription}
                                fieldName="venueDescription"
                                type="textarea"
                                placeholder="Not specified"
                                forceReadOnly={!!formInfo.venueDescription}
                                onSave={(fieldName, value) => handleFieldChange(fieldName, value)}
                            />
                            {renderFieldNotification('venueDescription', 'Please add a venue description')}
                        </div>

                        <div>
                            <EditableField
                                label="Phone"
                                value={formInfo.phone}
                                fieldName="phone"
                                onSave={(fieldName, value) => handleFieldChange(fieldName, value)}
                            />
                            {renderFieldNotification('phone', 'Please add a phone number')}
                        </div>

                        <div>
                            <EditableField
                                label="Website"
                                value={formInfo.website}
                                fieldName="website"
                                onSave={(fieldName, value) => handleFieldChange(fieldName, value)}
                            />
                            {renderFieldNotification('website', 'Please add a website')}
                        </div>

                        <div>
                            <p className="text-gray-400">Wheelchair Accessible:</p>
                            <div className="relative group">
                                {editingFields.wheelchair_accessible ? (
                                    <div className="flex gap-2 items-center">
                                        <Select
                                            value={tempValues.wheelchair_accessible === null ? "unknown" : tempValues.wheelchair_accessible ? "1" : "0"}
                                            onValueChange={(value) => handleTempChange('wheelchair_accessible', value === "unknown" ? null : value === "1")}
                                            className="flex-1"
                                        >
                                            <SelectTrigger className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white text-sm sm:text-base min-h-[2.5rem]">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900/95 border-orange-500/30">
                                                <SelectItem value="1" className="text-white hover:bg-orange-500/30">Yes</SelectItem>
                                                <SelectItem value="0" className="text-white hover:bg-orange-500/30">No</SelectItem>
                                                <SelectItem value="unknown" className="text-white hover:bg-orange-500/30">Not Sure</SelectItem>
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
                                                    <Pencil className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
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

                        <div>
                            <p className="text-gray-400">Serves Alcohol:</p>
                            <div className="relative group">
                                {editingFields.serves_alcohol ? (
                                    <div className="flex gap-2 items-center">
                                        <Select
                                            value={tempValues.serves_alcohol === null ? "unknown" : tempValues.serves_alcohol ? "1" : "0"}
                                            onValueChange={(value) => handleTempChange('serves_alcohol', value === "unknown" ? null : value === "1")}
                                            className="flex-1"
                                        >
                                            <SelectTrigger className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white text-sm sm:text-base min-h-[2.5rem]">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900/95 border-orange-500/30">
                                                <SelectItem value="1" className="text-white hover:bg-orange-500/30">Yes</SelectItem>
                                                <SelectItem value="0" className="text-white hover:bg-orange-500/30">No</SelectItem>
                                                <SelectItem value="unknown" className="text-white hover:bg-orange-500/30">Not Sure</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => toggleEdit('serves_alcohol', false)}
                                                className="p-2 hover:bg-orange-500/20 rounded-md"
                                            >
                                                <X className="w-5 h-5 text-gray-400 hover:text-white"/>
                                            </button>
                                            <button
                                                onClick={() => toggleEdit('serves_alcohol', true)}
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
                                                    <Pencil className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
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

                        <div>
                            <p className="text-gray-400">Dog Friendly:</p>
                            <div className="relative group">
                                {editingFields.is_dog_friendly ? (
                                    <div className="flex gap-2 items-center">
                                        <Select
                                            value={tempValues.is_dog_friendly === null ? "unknown" : tempValues.is_dog_friendly ? "1" : "0"}
                                            onValueChange={(value) => handleTempChange('is_dog_friendly', value === "unknown" ? null : value === "1")}
                                            className="flex-1"
                                        >
                                            <SelectTrigger className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white text-sm sm:text-base min-h-[2.5rem]">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900/95 border-orange-500/30">
                                                <SelectItem value="1" className="text-white hover:bg-orange-500/30">Yes</SelectItem>
                                                <SelectItem value="0" className="text-white hover:bg-orange-500/30">No</SelectItem>
                                                <SelectItem value="unknown" className="text-white hover:bg-orange-500/30">Not Sure</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => toggleEdit('is_dog_friendly', false)}
                                                className="p-2 hover:bg-orange-500/20 rounded-md"
                                            >
                                                <X className="w-5 h-5 text-gray-400 hover:text-white"/>
                                            </button>
                                            <button
                                                onClick={() => toggleEdit('is_dog_friendly', true)}
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
                                                    onClick={() => toggleEdit('is_dog_friendly')}
                                                >
                                                    <p className="text-white flex-1">
                                                        {formInfo.is_dog_friendly === null
                                                            ? 'Not specified'
                                                            : formInfo.is_dog_friendly
                                                                ? 'Yes'
                                                                : 'No'}
                                                    </p>
                                                    <Pencil className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
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

                        <div>
                            <p className="text-gray-400">Vegan Friendly:</p>
                            <div className="relative group">
                                {editingFields.is_vegan_friendly ? (
                                    <div className="flex gap-2 items-center">
                                        <Select
                                            value={tempValues.is_vegan_friendly === null ? "unknown" : tempValues.is_vegan_friendly ? "1" : "0"}
                                            onValueChange={(value) => handleTempChange('is_vegan_friendly', value === "unknown" ? null : value === "1")}
                                            className="flex-1"
                                        >
                                            <SelectTrigger className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white text-sm sm:text-base min-h-[2.5rem]">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900/95 border-orange-500/30">
                                                <SelectItem value="1" className="text-white hover:bg-orange-500/30">Yes</SelectItem>
                                                <SelectItem value="0" className="text-white hover:bg-orange-500/30">No</SelectItem>
                                                <SelectItem value="unknown" className="text-white hover:bg-orange-500/30">Not Sure</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => toggleEdit('is_vegan_friendly', false)}
                                                className="p-2 hover:bg-orange-500/20 rounded-md"
                                            >
                                                <X className="w-5 h-5 text-gray-400 hover:text-white"/>
                                            </button>
                                            <button
                                                onClick={() => toggleEdit('is_vegan_friendly', true)}
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
                                                    onClick={() => toggleEdit('is_vegan_friendly')}
                                                >
                                                    <p className="text-white flex-1">
                                                        {formInfo.is_vegan_friendly === null
                                                            ? 'Not specified'
                                                            : formInfo.is_vegan_friendly
                                                                ? 'Yes'
                                                                : 'No'}
                                                    </p>
                                                    <Pencil className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
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

                        <div>
                            <p className="text-gray-400 mb-2">Venue Tags:</p>
                            <div className="relative group mt-1">
                                {editingFields.tags ? (
                                    <div className="flex flex-col gap-3">
                                        {tempValues.tags && tempValues.tags.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {tempValues.tags.map((tag) => (
                                                    <div 
                                                        key={tag.id} 
                                                        className="bg-orange-500/20 text-white px-2 py-1 rounded-md flex items-center gap-1"
                                                    >
                                                        <span>{tag.tag || tag.name}</span>
                                                        <button
                                                            onClick={() => {
                                                                const updatedTags = tempValues.tags.filter(t => t.id !== tag.id);
                                                                handleTempChange('tags', updatedTags);
                                                            }}
                                                            className="text-gray-400 hover:text-white"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                        
                                        {venueTags && venueTags.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <p className="text-sm text-gray-400 w-full mb-2">Select from venue tags:</p>
                                                {venueTags.map((tag) => {
                                                    const isSelected = tempValues.tags?.some(t => t.id === tag.id);
                                                    return (
                                                        <button
                                                            key={tag.id}
                                                            onClick={() => {
                                                                let updatedTags;
                                                                if (isSelected) {
                                                                    updatedTags = tempValues.tags.filter(t => t.id !== tag.id);
                                                                } else {
                                                                    updatedTags = [...(tempValues.tags || []), tag];
                                                                }
                                                                handleTempChange('tags', updatedTags);
                                                            }}
                                                            className={`px-2 py-1 rounded-md text-sm ${
                                                                isSelected 
                                                                    ? 'bg-orange-500 text-white' 
                                                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                            }`}
                                                        >
                                                            {tag.tag || tag.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : null}
                                        
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm text-gray-400">
                                                {venueTags && venueTags.length > 0 
                                                    ? 'Or add your own tags:' 
                                                    : 'Add your own tags:'}
                                            </p>
                                            <Input
                                                value={newTagInput}
                                                onChange={(e) => setNewTagInput(e.target.value)}
                                                onKeyDown={handleAddCustomTag}
                                                placeholder="Type and press Enter to add"
                                                className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Press Enter or use comma to add multiple tags</p>
                                        </div>
                                        
                                        <div className="flex gap-1 mt-3 justify-end">
                                            <button
                                                onClick={() => toggleEdit('tags', false)}
                                                className="p-2 hover:bg-orange-500/20 rounded-md"
                                            >
                                                <X className="w-5 h-5 text-gray-400 hover:text-white"/>
                                            </button>
                                            <button
                                                onClick={() => toggleEdit('tags', true)}
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
                                                    onClick={() => toggleEdit('tags')}
                                                >
                                                    <div className="text-white flex-1">
                                                        {formInfo.selectedTags && formInfo.selectedTags.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {formInfo.selectedTags.map((tag) => (
                                                                    <span 
                                                                        key={tag.id}
                                                                        className="bg-orange-500/20 text-white px-2 py-0.5 rounded-md text-sm"
                                                                    >
                                                                        {tag.tag || tag.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">No tags selected</span>
                                                        )}
                                                    </div>
                                                    <Pencil className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Click to edit</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                            {isMissingVenueTags() && (
                                <div className="flex items-center gap-1 text-sm text-orange-400 mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>Please add at least one tag</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-gray-400 mb-2">Venue Images:</p>
                        <ImageSelection
                            venueImages={formInfo.Venue?.Venue_Images || []}
                            selectedImages={formInfo.selectedImages}
                            onSelectImages={(images) => setFormInfo(prev => ({ ...prev, selectedImages: images }))}
                        />
                        {isMissingVenueImages() && (
                            <div className="flex items-center gap-1 text-sm text-orange-400 mt-1">
                                <AlertCircle className="h-3 w-3" />
                                <span>Please select at least one image</span>
                            </div>
                        )}
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

export default React.memo(Review);