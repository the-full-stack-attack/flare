import React from 'react';
import {useState, useEffect} from 'react';
import {Toggle} from '@/components/ui/toggle';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/components/ui/select';
import {Separator} from '@/components/ui/seperator';
import axios from 'axios';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';


function CategoryInterest({ handleCategoryInterests, formInfo }) {
    const [selectedCategory, setSelectedCategory] = useState(formInfo.category || '');
    const [selectedInterests, setSelectedInterests] = useState(formInfo.interests || []);
    const [categories, setCategories] = useState([]);
    const [interests, setInterests] = useState([]);

    useEffect(() => {
        getInterests();
        getCategories();
    }, []);


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

    const selectCategory = (category: string) => {
        setSelectedCategory(category);
        handleCategoryInterests({
            category: category,
            interests: selectedInterests
        });
    };

    const handleInterestSelect = (interest: string) => {
        const newInterests = [...selectedInterests, interest];
        setSelectedInterests(newInterests);
        handleCategoryInterests({
            category: selectedCategory,
            interests: newInterests
        });
    };

    const handleInterestRemove = (interest: string) => {
        const newInterests = selectedInterests.filter(i => i !== interest);
        setSelectedInterests(newInterests);
        handleCategoryInterests({
            category: selectedCategory,
            interests: newInterests
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
                        <SelectTrigger className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white">
                            <SelectValue placeholder="Select A Category"/>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900/95 border-orange-500/30">
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.name}
                                    className="text-gray-200 data-[highlighted]:text-white !important data-[highlighted]:bg-orange-500/30 cursor-pointer"
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label className="text-gray-200 mb-2 block">
                            Available Interests
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {interests
                                .filter(interest => !selectedInterests.includes(interest))
                                .map((interest, index) => (
                                    <Button
                                        key={`interest-${index}`}
                                        onClick={() => handleInterestSelect(interest)}
                                        type="button"
                                        className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border border-orange-500/30 hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30"
                                    >
                                        {interest}
                                    </Button>
                                ))}
                        </div>
                    </div>

                    <div>
                        <Label className="text-gray-200 mb-2 block">
                            Selected Interests
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {selectedInterests.map((interest, index) => (
                                <Button
                                    key={`selected-${index}`}
                                    name="selectedInterest"
                                    onClick={() => handleInterestRemove(interest)}
                                    type="button"
                                    className="bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border border-orange-500/50 hover:from-yellow-500/50 hover:via-orange-500/50 hover:to-pink-500/50"
                                >
                                    {interest}
                                </Button>
                            ))}
                        </div>
                    </div>
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