import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {Textarea} from '../../components/ui/textarea';
import {Input} from '../../components/ui/input';
import {Button} from "../../components/ui/button";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem,} from '../../components/ui/select';

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
    const [venues, setVenues] = useState<Array<{
        name: string;
        description: string;
        street_address: string;
        zip_code: number;
        city_name: string;
        state_name: string;
    }>>([]);

    const [categories, setCategories] = useState([]); // Categories from DB
    const [interests, setInterests] = useState([]); // Interests from DB
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // User selected Interests
    const [isNewVenue, setIsNewVenue] = useState(false);
    const [venueSearch, setVenueSearch] = useState('');
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [step, setStep] = useState(1);

    // Venue search handling - filers based on user search input
    const handleVenueSearch = async (searchTerm: string) => {
        try {
            setVenueSearch(searchTerm);
            const response = await axios.get('/api/event/search', {
                params: {
                    searchInput: searchTerm,
                }
            });
            console.log('searching for...', searchTerm);
            console.log('just made a requst: ', response.data);


            console.log('do we set this? ', venues);
            setFilteredVenues(response.data);
        } catch (error) {
            console.error('oops', error);
        }
    };


    // handle venue selection from user search input
    const handleVenueSelect = async (venue) => {
        // if venue is from foursquare api
        if (venue.fsq_id) {
            try {
                // request venue details from foursquare api
                const response = await axios.get(`/api/event/venue/${venue.fsq_id}`);
                // update venue form info state
                setFormInfo(prev => ({
                    ...prev,
                    venue: venue.name,
                    venueDescription: response.data.description || '',
                    streetAddress: venue.street_address,
                    zipCode: venue.zip_code,
                    cityName: venue.city_name,
                    stateName: venue.state_name
                }));
            } catch (error) {
                console.error('Error fetching venue details:', error);
            }
        } else {
            // for user input venue update form state
            setFormInfo(prev => ({
                ...prev,
                venue: venue.name,
                venueDescription: venue.description,
                streetAddress: venue.street_address,
                zipCode: venue.zip_code,
                cityName: venue.city_name,
                stateName: venue.state_name
            }));
        }

        // clear states
        setVenueSearch('');
        setFilteredVenues([]);
    };


    /**
     * // const filtered = venues.filter(venue =>
     *             //     venue.name.toLowerCase().includes(searchTerm.toLowerCase())
     *             // );
     *
     */


    // navigation handling
    function handlePrev() {
        if (step > 1) setStep((step) => step - 1);
    }

    function handleNext() {
        if (step < 4) setStep((step) => step + 1);
    }


    // handling toggle selection for interests
    const toggleInterest = (interest: string) => {
        // filter through interests to see which one is checked
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );

        // update form data with mew interests
        setFormInfo(prev => ({
            ...prev,
            interests: formInfo.interests.includes(interest)
                ? formInfo.interests.filter(i => i !== interest)
                : [...formInfo.interests, interest]
        }));
    };

    // handle category selection
    const selectCategory = (value: string) => {
        // update form info
        setFormInfo(prev => ({
            ...prev, category: value
        }));
    }


    // generic handle change for zip code
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormInfo((prevState) => ({
            ...prevState,
            [name]: name === 'zipCode' ? Number(value) : value,
        }));
    };


    // form submission handling
    const onSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const formattedData = {
                title: formInfo.title,
                description: formInfo.description,
                category: formInfo.category,
                interests: formInfo.interests,
                startDate: formInfo.startDate,
                endDate: formInfo.endDate,
                startTime: formInfo.startTime,
                endTime: formInfo.endTime,
                venue: formInfo.venue,
                venueDescription: formInfo.venueDescription,
                streetAddress: formInfo.streetAddress,
                zipCode: Number(formInfo.zipCode),
                cityName: formInfo.cityName,
                stateName: formInfo.stateName.toUpperCase()
            };

            const response = await axios.post('/api/event', formattedData);
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error creating event:', error.response?.data || error);
        }
    };


    // get list of venues from db
    const getVenues = async () => {
        try {
            const allVenues = await axios.get('/api/event/venues');
            setVenues(allVenues.data);
        } catch (error) {
            console.error('Error getting venues from DB', error);
        }
    };


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


            <div className="w-[550px] mx-auto bg-white p-4 px-8 rounded-lg">


                <div className="flex justify-between my-4 relative">
                    <div className="bg-[#630cf1] absolute top-1/2 left-0 h-1 -translate-y-1/2 z-10"></div>
                    {[1, 2, 3, 4].map((num) => (
                        <div key={num}
                             className={`bg-gray-300 h-[30px] w-[30px] flex justify-center items-center rounded-full z-10 ${
                                 step >= num ? 'bg-[#43766c] text-white' : ''
                             }`}>
                            {num}
                        </div>
                    ))}
                </div>


                <div className="space-y-4">
                    {step === 1 && (
                        <>
                            <Input
                                name="title"
                                placeholder="Event Title"
                                value={formInfo.title}
                                onChange={handleChange}
                            />
                            <Textarea
                                name="description"
                                placeholder="Description"
                                value={formInfo.description}
                                onChange={handleChange}
                            />
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
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                {interests.map((interest, index) => (
                                    <div
                                        key={index}
                                        onClick={() => toggleInterest(interest)}
                                        className={`p-2 rounded cursor-pointer ${
                                            selectedInterests.includes(interest)
                                                ? 'bg-[#43766c] text-white'
                                                : 'bg-gray-100'
                                        }`}
                                    >
                                        {interest}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Date & Time</label>
                                    <Input
                                        name="startDate"
                                        type="date"
                                        value={formInfo.startDate}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="startTime"
                                        type="time"
                                        value={formInfo.startTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Date & Time</label>
                                    <Input
                                        name="endDate"
                                        type="date"
                                        value={formInfo.endDate}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="endTime"
                                        type="time"
                                        value={formInfo.endTime}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Button
                                    onClick={() => setIsNewVenue(false)}
                                    variant={!isNewVenue ? "default" : "outline"}
                                >
                                    Search Venue
                                </Button>
                                <Button
                                    onClick={() => setIsNewVenue(true)}
                                    variant={isNewVenue ? "default" : "outline"}
                                >
                                    Create New Venue
                                </Button>
                            </div>

                            {!isNewVenue ? (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Input
                                            placeholder="Search for a venue..."
                                            value={venueSearch}
                                            onChange={(e) => handleVenueSearch(e.target.value)}
                                            className="w-full"
                                        />
                                        {venueSearch && filteredVenues.length > 0 && (
                                            <div
                                                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                {filteredVenues.map((venue, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                                        onClick={() => handleVenueSelect(venue)}
                                                    >
                                                        <div className="font-medium">{venue.name}</div>
                                                        <div className="text-sm text-gray-600">
                                                            {venue.street_address}, {venue.city_name}, {venue.state_name}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {venueSearch && filteredVenues.length === 0 && (
                                            <div
                                                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-3 text-gray-500">
                                                No venues found. Would you like to create a new venue?
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Input
                                        name="venue"
                                        placeholder="Venue Name"
                                        value={formInfo.venue}
                                        onChange={handleChange}
                                    />
                                    <Textarea
                                        name="venueDescription"
                                        placeholder="Venue Description"
                                        value={formInfo.venueDescription}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="streetAddress"
                                        placeholder="Street Address"
                                        value={formInfo.streetAddress}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="zipCode"
                                        type="number"
                                        placeholder="Zip Code"
                                        value={formInfo.zipCode || ''}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="cityName"
                                        placeholder="City"
                                        value={formInfo.cityName}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="stateName"
                                        placeholder="State (e.g., LA)"
                                        value={formInfo.stateName}
                                        onChange={handleChange}
                                        maxLength={2}
                                    />
                                </div>
                            )}
                        </div>
                    )}


                </div>


                {step === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Confirm Your Event Details</h2>
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-2">Event Information</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <p className="text-gray-600">Title:</p>
                                    <p>{formInfo.title}</p>
                                    <p className="text-gray-600">Description:</p>
                                    <p>{formInfo.description}</p>
                                    <p className="text-gray-600">Category:</p>
                                    <p>{formInfo.category}</p>
                                    <p className="text-gray-600">Interests:</p>
                                    <p>{formInfo.interests.join(', ')}</p>
                                    <p className="text-gray-600">Start Date:</p>
                                    <p>{new Date(formInfo.startDate).toLocaleDateString()}</p>
                                    <p className="text-gray-600">Start Time:</p>
                                    <p>{new Date(formInfo.startTime).toLocaleTimeString()}</p>
                                    <p className="text-gray-600">End Date:</p>
                                    <p>{new Date(formInfo.endDate).toLocaleDateString()}</p>
                                    <p className="text-gray-600">End Time:</p>
                                    <p>{new Date(formInfo.endTime).toLocaleTimeString()}</p>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-2">Venue Information</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <p className="text-gray-600">Venue Name:</p>
                                    <p>{formInfo.venue}</p>

                                        <>
                                            <p className="text-gray-600">Description:</p>
                                            <p>{formInfo.venueDescription}</p>
                                            <p className="text-gray-600">Address:</p>
                                            <p>{formInfo.streetAddress}</p>
                                            <p className="text-gray-600">City:</p>
                                            <p>{formInfo.cityName}</p>
                                            <p className="text-gray-600">State:</p>
                                            <p>{formInfo.stateName}</p>
                                            <p className="text-gray-600">Zip Code:</p>
                                            <p>{formInfo.zipCode}</p>
                                        </>

                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-6">
                    <Button onClick={handlePrev} disabled={step === 1}>
                        Prev
                    </Button>
                    {step === 4 ? (
                        <Button onClick={onSubmit} variant="default">
                            Submit Event
                        </Button>
                    ) : (
                        <Button onClick={handleNext}>
                            {step === 3 ? "Review" : "Next"}
                        </Button>
                    )}
                </div>


            </div>


        </>
    )
        ;
}

export default CreateEvents;
