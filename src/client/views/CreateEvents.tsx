import React from 'react';
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
            const venue = formInfo.venue;
            await axios.put(`/api/event/venue/${formInfo.venueId}/accessibility`, {
                wheelchair_accessible: value
            });
            setFormInfo(prev => ({...prev, [field]: value}));
        } catch (error) {
            console.error('Error updating accessibility:', error);
        }
    };


    const handleVenueSelect = async (venueData) => {
        const { venue, nullFields } = venueData;
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
            console.error('Error creating event:', error.response?.data || error);
        }
    };

    useEffect(() => {
        getUserLoc();
    }, []);


    return (
        <div
            className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20'>
            <div
                className='min-h-screen pt-20 flex items-center justify-center'>
                <Card className='p-5 w-[550px] mx-auto bg-blue-500 p-4 px-8 rounded-lg'>


                    {/* BEGINNING OF FORM */}
                    {step === 1 && (
                        <FormStart formInfo={formInfo} handleChange={handleChange}/>
                    )}


                    {/* CATEGORY AND INTERESTS SELECTION */}
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


                    {/* TIME AND DATE INFORMATION */}
                    {step === 3 && (
                        <DateTime
                            formInfo={formInfo}
                            handleChange={handleChange}
                        />
                    )}


                    {/* VENUE SELECTION */}
                    {step === 4 && (
                        <div>
                            <VenueSearch
                                handleVenueSelect={handleVenueSelect}
                            />
                            <div className='mt-10'>
                                <Separator/>
                            </div>
                        </div>
                    )}


                    {/* CONFIRM DETAILS */}
                    {step === 5 && (
                        <Review formInfo={formInfo} nullFields={nullFields}
                                handleFieldChange={handleFieldChange}/>
                    )}


                    {/* BUTTONS */}
                    <div className='flex flex-col justify-center items-center gap-4 '>
                        {step === 5 ? (
                            <Button
                                onClick={onSubmit}
                                className='bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-xl'
                            >
                        <span className='text-lg font-medium text-black !normal-case'>
                            Submit Event
                        </span>
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className='bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-xl'
                            >
                        <span className='text-lg font-medium text-black !normal-case'>
                            {step === 4 ? "Review" : "Continue"}
                        </span>
                            </Button>
                        )}
                        <Button
                            onClick={handlePrev}
                            disabled={step === 1}
                            className='bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-xl'>
                    <span className='text-lg font-medium text-black !normal-case'>
                        Go Back
                    </span>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default CreateEvents;
