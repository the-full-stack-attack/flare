import React from 'react';
import {useState, useEffect} from 'react';
import {Toggle} from '@/components/ui/toggle';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/components/ui/select';
import {Separator} from '@/components/ui/seperator';
import axios from 'axios';


function CategoryInterest({handleCategoryInterests, formInfo}) {
    // initialize with formInfo values
    const [selectedCategory, setSelectedCategory] = useState(formInfo.category || '');
    const [selectedInterests, setSelectedInterests] = useState(formInfo.interests || []);
    const [categories, setCategories] = useState([]);
    const [interests, setInterests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestedInterests, setSuggestedInterests] = useState([]);

    useEffect(() => {
        getInterests();
        getCategories();
    }, []);

    useEffect(() => {
        handleCategoryInterests({
            category: selectedCategory,
            interests: selectedInterests
        });
    }, [selectedCategory, selectedInterests]);

    // get interests from db
    const getInterests = async () => {
        try {
            const allInterests = await axios.get('/api/signup/interests');
            setInterests(allInterests.data);
        } catch (error) {
            console.error('Error getting interests from DB', error);
        }
    };

    // get categories from db
    const getCategories = async () => {
        try {
            const allCategories = await axios.get('/api/event/categories');
            setCategories(allCategories.data);
        } catch (error) {
            console.error('Error getting categories from DB', error);
        }
    };

    const toggleInterest = (interest) => {
        const newInterests = selectedInterests.includes(interest)
            ? selectedInterests.filter(i => i !== interest)
            : [...selectedInterests, interest];

        setSelectedInterests(newInterests);
        // pass updated selections to parent
        handleCategoryInterests({
            category: selectedCategory,
            interests: newInterests,
        });
    };

    const selectCategory = (value) => {
        setSelectedCategory(value);
        // pass updated selections to parent
        handleCategoryInterests({
            category: value,
            interests: selectedInterests, // pass the current interests
        });
    };


    return (
        <div className="flex-1">
            <div className="p-6 border-b border-orange-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    Categories & Interests
                </h2>
                <p className="text-sm text-gray-400">
                    Connect through what you love most
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-4">
                    <Select
                        value={selectedCategory}
                        onValueChange={selectCategory}
                    >
                        <SelectTrigger
                            className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white">
                            <SelectValue placeholder="Select A Category"/>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900/95 border-orange-500/30">
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.name}
                                    className="text-white hover:bg-orange-500/30 focus:bg-orange-500/30"
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Separator className="border-orange-500/20"/>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {interests.map((interest, index) => (
                        <Toggle
                            key={index}
                            pressed={selectedInterests.includes(interest)}
                            onPressedChange={() => toggleInterest(interest)}
                            variant="outline"
                            size="lg"
                            className={`h-12 border-orange-500/30 hover:bg-orange-500/30 
                                ${selectedInterests.includes(interest)
                                ? 'bg-orange-500/40 text-white font-medium'
                                : 'text-gray-100'}`}
                        >
                            {interest}
                        </Toggle>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-sm bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                        Where shared interests become shared moments
                    </p>
                </div>
            </div>
        </div>

    )
};


export default CategoryInterest;