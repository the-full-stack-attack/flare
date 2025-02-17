import React, {useContext} from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {Button} from "../../components/ui/button";
import {Card} from '../../components/ui/card';
import {Separator} from '../../components/ui/seperator';
import VenueSearch from '../components/event-form/VenueSearch';
import DateTime from '../components/event-form/DateTime';
import CategoryInterest from '../components/event-form/CategoryInterest';
import FormStart from '../components/event-form/FormStart'
import Review from '../components/event-form/Review';
import {UserContext} from "@/client/contexts/UserContext";
import { BackgroundGlow } from '../../components/ui/background-glow';

type EventData = {
    title: string;
    description: string;
    startDate: string;
    startTime: string;
    endTime: string;
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
        startDate: '',
        startTime: '',
        endTime: '',
        venue: '',
        venueDescription: '',
        streetAddress: '',
        cityName: '',
        stateName: '',
        zipCode: null,
        interests: [],
        category: '',
    });

    const { user } = useContext(UserContext);

    const [step, setStep] = useState(1);
    const [geoLocation, setGeoLocation] = useState();
    const [nullFields, setNullFields] = useState({});


    // temp geolocation call to see if this fixes bug
    const getUserLoc = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const {latitude, longitude} = position.coords;
                setGeoLocation({latitude, longitude});
            })
        } else {
            console.error('Geolocation not allowed');
        }
    }

    const handleFieldChange = async (field, value) => {
        try {
            await axios.put(`/api/event/venue/${formInfo.venueId}/${field}`, {
                [field]: value,
                userId: user.id
            });
            setFormInfo(prev => ({...prev, [field]: value}));
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };


    const handleVenueSelect = async (venueData) => {
        const { venue, nullFields } = venueData;
        console.log('this is user');
        try {

            setFormInfo(prev => ({
                ...prev,
                venue: venue.name,
                venueDescription: venue.description || '',
                streetAddress: venue.street_address,
                zipCode: venue.zip_code,
                cityName: venue.city_name,
                stateName: venue.state_name,
                fsq_id: venue.fsq_id,
                venueId: venue.id,
                phone: venue.phone,
                website: venue.website,
                rating: venue.rating,
                total_reviews: venue.total_reviews,
                pricing: venue.pricing,
                popularTime: venue.popularTime,
                peak_hour: venue.peak_hour,
                wheelchair_accessible: venue.wheelchair_accessible,
                serves_alcohol: venue.serves_alcohol,
                google_place_id: venue.google_place_id,
            }));
            setNullFields(nullFields);
            setStep(5);
        } catch (error) {
            console.error('Error updating form with venue:', error);
        }
    };


    // navigation handling
    function handlePrev() {
        if (step > 1) setStep((step) => step - 1);
    }

    function handleNext() {
        if (step < 5) setStep((step) => step + 1);
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
                startTime: formInfo.startTime,
                endTime: formInfo.endTime,
                venue: formInfo.venue,
                venueDescription: formInfo.venueDescription,
                streetAddress: formInfo.streetAddress,
                zipCode: Number(formInfo.zipCode),
                cityName: formInfo.cityName,
                stateName: formInfo.stateName.toUpperCase(),
                fsq_id: formInfo.fsq_id,
            };
            await axios.post('/api/event', formattedData);
            setStep(1);
            setFormInfo({
                title: '',
                description: '',
                startDate: '',
                startTime: '',
                endTime: '',
                venue: '',
                venueDescription: '',
                streetAddress: '',
                cityName: '',
                stateName: '',
                zipCode: null,
                interests: [],
                category: '',
            });
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    useEffect(() => {
        getUserLoc();
    }, []);


    return (
        <div
            className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20">
            <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none"/>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <Card className="backdrop-blur-lg bg-white/5 rounded-xl border border-orange-500/20 max-w-2xl mx-auto">
                    <div className="flex flex-col h-full">
                        <div className="flex-1">
                            {step === 1 && (
                                <FormStart formInfo={formInfo} handleChange={handleChange}/>
                            )}
                            {step === 2 && (
                                <CategoryInterest
                                    handleCategoryInterests={({category, interests}) => {
                                        setFormInfo(prev => ({
                                            ...prev,
                                            category: category,
                                            interests: interests,
                                        }));
                                    }}
                                />
                            )}
                            {step === 3 && (
                                <DateTime
                                    formInfo={formInfo}
                                    handleChange={handleChange}
                                />
                            )}
                            {step === 4 && (
                                <div>
                                    <VenueSearch handleVenueSelect={handleVenueSelect}/>
                                    <Separator className="my-6"/>
                                </div>
                            )}
                            {step === 5 && (
                                <Review
                                    formInfo={formInfo}
                                    nullFields={nullFields}
                                    handleFieldChange={handleFieldChange}
                                />
                            )}
                        </div>

                        <div className="p-6 border-t border-orange-500/20">
                            <div className="flex flex-col gap-4">
                                {step === 5 ? (
                                    <Button
                                        onClick={onSubmit}
                                        className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-black"
                                    >
                                        Submit Event
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-black"
                                    >
                                        {step === 4 ? "Review" : "Continue"}
                                    </Button>
                                )}
                                <Button
                                    onClick={handlePrev}
                                    disabled={step === 1}
                                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-black"
                                >
                                    Go Back
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default CreateEvents;
