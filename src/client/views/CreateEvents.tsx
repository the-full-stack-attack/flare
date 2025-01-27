import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { Separator } from '../../components/ui/seperator';
import {Container} from '../../components/ui/container';
import MultiStep from '../components/multistep'
import { Textarea } from '../../components/ui/textarea';

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

    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (!api) return;

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);


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

            <MultiStep />
            <div>
                Your next favorite memory starts with this moment.
            </div>
            <div>
                Remember, everyone here started exactly where you are.
            </div>

            <div>
                Shared passions are the seeds of real connection - let's grow yours.
            </div>

            <div>
                Set the stage for connection - your moment, your pace, your Flare. 'your Flare' addition seems weird but I like this just needs more work.
            </div>

            <div>
                Find your tribe before you arrive - we'll handle the matchmaking. GROSSSS
            </div>

            <div>
                A picture paints safe pace - show them what comfort looks like. This puts so much pressure on the user NO
            </div>

            <div>
                Hit 'Create' - the first hello is easier than you think. This is okay.
            </div>

            <div>
                You've just built a bridge. Watch how kindly the world walks across it. SO encouraging! Acknowledges user did something outstanding, communicates that the poeple on the other side of the screen are kind, and sets the tone that the event creator is THE show.
            </div>

            <div>
                Pssst...73% of first-time creators say this felt safer than a text message. You've got this. NO - CREEPY.
            </div>

            <div>
                This isn't just an event - it's the universe conspiraring to meet you halfway. EW the universe? What a weird thing to say and 'Thisisn't just an event' is SUCH a cliche!
            </div>

            <div>
                Your next favorite memory starts with this moment. Sets the stage really well I like this.
            </div>

            <div>
                Small steps lead to big connections. This is okay good for maybe some accent text somewhere.
            </div>

            <div>
                Plant the seed for something extraordinary. THIS IS SO BAD. Puts too much pressure on the user.
            </div>

            <div>
                Every event starts with someone just like you
            </div>

            <div>
                Where your passions meet your people. This is good, simple and cute.
            </div>

            <div>
                The things you love, shared. This is nice too very cute and simple.
            </div>

            <div>
                Shared passions are the seeds of real connection
            </div>
            <div>
                The community you're looking for is looking for you too. Kind of creepy? Is it? Not sure but maybe coule be improved.
            </div>

            <div>
                Write the first line of your next chapter.
            </div>

            <div>
                Pick your perfect moment to connect
            </div>

            <div>
                Choose when your story unfolds
            </div>

            <div>
                Where shared interests become shared moments
            </div>

            <div>
                Connect through what you love most
            </div>

            <div>
                Add your colors to the community canvas
            </div>

            <div>
                Every interest has its gathering
            </div>

            <div>
                Give your event its Flare
            </div>

            <div>
                The things you love, shared
            </div>

            <div>
                Where your passions meet your people
            </div>

            <div>
                Small steps lead to big connections
            </div>






            <div className='mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 mt-32 mb-32'>
                <Carousel
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent>
                        <CarouselItem>
                            <Card
                            className='h-[300px] bg-blue-400'>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div
                                        className='text-4xl font-bold text-gray-900 mb-4'>General Info</div>
                                        <Separator/>
                                        <Input
                                            className='bg-color-white'
                                            name="title"
                                            placeholder="Event Title"
                                            value={formInfo.title}
                                            onChange={handleChange}
                                        />
                                        <Textarea
                                            className='bg-color-white text-black'
                                            name="description"
                                            placeholder="Description"
                                            value={formInfo.description}
                                            onChange={handleChange}
                                        >

                                        </Textarea>
                                        {/*<Input*/}
                                        {/*    name="description"*/}
                                        {/*    placeholder="Description"*/}
                                        {/*    value={formInfo.description}*/}
                                        {/*    onChange={handleChange}*/}
                                        {/*    className='h-56'*/}
                                        {/*/>*/}

                                        <div className="flex justify-end">
                                            <Button
                                                variant="outline"
                                                onClick={() => api?.scrollNext()}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>

                        <CarouselItem>
                            <Card
                                className='h-[300px] bg-blue-400'>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div
                                        className='text-4xl font-bold text-gray-900 mb-4'>When should people arrive?</div>
                                        <Separator/>
                                        <Input
                                            className='bg-color-white'
                                            name="startDate"
                                            type="date"
                                            value={formInfo.startDate}
                                            onChange={handleChange}
                                        />
                                        <Input
                                            className='bg-color-white'
                                            name="startTime"
                                            type="time"
                                            value={formInfo.startTime}
                                            onChange={handleChange}
                                        />
                                        <div className="flex justify-between">
                                            <Button
                                                variant="outline"
                                                onClick={() => api?.scrollPrev()}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => api?.scrollNext()}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>

                        <CarouselItem>
                            <Card
                                className='h-[300px] bg-blue-400'>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <Input
                                            className='bg-color-white'
                                            name="venue"
                                            placeholder="Venue Name"
                                            value={formInfo.venue}
                                            onChange={handleChange}
                                        />
                                        <Input
                                            className='bg-color-white'
                                            name="streetAddress"
                                            placeholder="Address"
                                            value={formInfo.streetAddress}
                                            onChange={handleChange}
                                        />
                                        <div className="flex justify-between">
                                            <Button
                                                variant="outline"
                                                onClick={() => api?.scrollPrev()}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={onSubmit}
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </div>


            <div className='mx-6 sm:mx-12 md:mx-16 lg:mx-24 xl:mx-32'>
                <Card
                    className='h-[300px]'>
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
                                            className='align-text-top'
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


            <div className="mt-4 text-center">
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    onClick={onSubmit}
                >
                    Create Event
                </button>
            </div>


            <div className='mx-6 sm:mx-12 md:mx-16 lg:mx-24 xl:mx-32'>

            </div>


        </>
    )
        ;
}

export default CreateEvents;