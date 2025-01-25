import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    useCarousel
} from '../../components/ui/carousel';

import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from '../../components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import {Input} from '../../components/ui/input';
import {Button} from "../../components/ui/button";

type EventData = {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    startTime: Date;
    endTime: Date;
    venue: string;
    venueDescription: string;
    streetAddress: string;
    zipCode: number | null;
    cityName: string;
    stateName: string;
    interests: string[];
    category: string;
};

function CreateEvents() {
    const [formInfo, setFormInfo] = useState<EventData>({
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        venue: '',
        venueDescription: '',
        streetAddress: '',
        cityName: '',
        stateName: '',
        zipCode: null,
        interests: [],
        category: '',
    });
    const [categories, setCategories] = useState([]); // Categories from DB
    const [interests, setInterests] = useState([]); // Interests from DB
    const [venues, setVenues] = useState(); // Venues from DB
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // User selected Interests


    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );

        setFormInfo(prev => ({
            ...prev,
            interests: formInfo.interests.includes(interest)
                ? formInfo.interests.filter(i => i !== interest)
                : [...formInfo.interests, interest]
        }));
    };

    const selectCategory = (value: string) => {
        setFormInfo(prev => ({
            ...prev, category: value
        }));
    }


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormInfo((prevState) => ({
            ...prevState,
            [name]: name === 'zipCode' ? Number(value) : value,
        }));
    };


    const onSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await axios.post('/api/event', formInfo);
        } catch (error) {
            console.error('Error creating event', error);
        }
    };


    const getVenues = async () => {
        try {
            const allVenues = await axios.get('/api/event/venues');
            setVenues(allVenues.data);
        } catch (error) {
            console.error('Error getting venues from DB', error);
        }
    };


    const getInterests = async () => {
        try {
            const allInterests = await axios.get('/api/signup/interests');
            setInterests(allInterests.data);
        } catch (error) {
            console.error('Error getting interests from DB', error);
        }
    };


    const getCategories = async () => {
        try {
            const allCategories = await axios.get('/api/event/categories');
            setCategories(allCategories.data);
        } catch (error) {
            console.error('Error getting categories from DB', error);
        }
    };


    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        getInterests();
        // noinspection JSIgnoredPromiseFromCall
        getCategories();
        // noinspection JSIgnoredPromiseFromCall
        getVenues();
    }, [formInfo]);


    return (
        <>
            <div className='mx-6 sm:mx-12 md:mx-16 lg:mx-24 xl:mx-32'>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-center">
                            Create Your Event
                        </CardTitle>
                        <CardDescription>
                            <form onSubmit={onSubmit} className="max-w-sm mx-auto">
                                <div className="mb-5">
                                    <label>
                                        Title
                                        <Input
                                            name="title"
                                            value={formInfo.title}
                                            onChange={handleChange}
                                        />
                                    </label>
                                    <label>
                                        Description
                                        <Input
                                            name="description"
                                            value={formInfo.description}
                                            onChange={handleChange}
                                        />
                                    </label>

                                    <label>
                                        Start Date
                                        <Input
                                            name="startDate"
                                            value={formInfo.startDate}
                                            onChange={handleChange}
                                            type="date"
                                        />
                                    </label>
                                    <label>
                                        End Date
                                        <Input
                                            name="endDate"
                                            value={formInfo.endDate}
                                            onChange={handleChange}
                                            type="date"
                                        />
                                    </label>
                                    <label>
                                        Start Time
                                        <Input
                                            name="startTime"
                                            value={formInfo.startTime}
                                            onChange={handleChange}
                                            type="time"
                                        />
                                    </label>
                                    <label>
                                        End Time
                                        <Input
                                            name="endTime"
                                            value={formInfo.endTime}
                                            onChange={handleChange}
                                            type="time"
                                        />
                                    </label>

                                    <label>
                                        Venue Name
                                        <Input
                                            name="venue"
                                            value={formInfo.venue}
                                            onChange={handleChange}
                                        />
                                    </label>

                                    <label>
                                        Venue Description
                                        <Input
                                            name="venueDescription"
                                            value={formInfo.venueDescription}
                                            onChange={handleChange}
                                        />
                                    </label>

                                    <label>
                                        Venue Address
                                        <Input
                                            name="streetAddress"
                                            value={formInfo.streetAddress}
                                            onChange={handleChange}
                                        />
                                    </label>

                                    <label>
                                        Venue Zip Code
                                        <Input
                                            name="zipCode"
                                            value={formInfo.zipCode}
                                            onChange={handleChange}
                                        />
                                    </label>

                                    <label>
                                        Venue City Location
                                        <Input
                                            name="cityName"
                                            value={formInfo.cityName}
                                            onChange={handleChange}
                                        />
                                    </label>

                                    <label>
                                        Venue State Location
                                        <Input
                                            name="stateName"
                                            value={formInfo.stateName}
                                            onChange={handleChange}
                                        />
                                    </label>

                                    <div>
                                        <Select
                                            value={formInfo.category}
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
                                    </div>
                                    <div>Interest</div>

                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                        {interests.map((interest, index) => (
                                            <Card
                                                key={index}
                                                role="button"
                                                onClick={() => toggleInterest(interest)}
                                                className={
                                                    selectedInterests.includes(interest)
                                                        ? 'text-white bg-green-600'
                                                        : 'text-white bg-black'
                                                }
                                            >
                                                <CardContent>{interest}</CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Submit
                                </button>
                            </form>
                        </CardDescription>
                    </CardHeader>
                </Card>





                <div className='mx-4 sm:mx-8 md:mx-12 lg:mx-16'>



                </div>

            </div>
        </>
    );
}

export default CreateEvents;