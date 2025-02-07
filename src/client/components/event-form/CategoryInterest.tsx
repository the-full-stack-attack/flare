import React from 'react';
import { useState, useEffect } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/seperator';
import axios from 'axios';


function CategoryInterest({ handleCategoryInterests }) {
    const [categories, setCategories] = useState([]);
    const [interests, setInterests] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');


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
            interests: selectedInterests, // Pass the current interests
        });
    };



    return (
        <div>
            <div className='mb-5 text-2xl font-semibold'>
                Connect through what you love most
            </div>
            <Separator className='my-5 bg-color-5'/>

            <Select
                value={selectedCategory}
                onValueChange={selectCategory}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select A Category"/>
                </SelectTrigger>
                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="my-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {interests.map((interest, index) => (
                    <Toggle
                        key={index}
                        pressed={selectedInterests.includes(interest)}
                        onPressedChange={() => toggleInterest(interest)}
                        variant="outline"
                        size="lg"
                        className='h-12 w-26'
                    >
                        {interest}
                    </Toggle>
                ))}
            </div>

            <div className='my-5 font-semibold text-center'>
                Where shared interests become shared moments
            </div>
        </div>
    )
};





export default CategoryInterest;