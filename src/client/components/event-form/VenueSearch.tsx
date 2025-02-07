import React from 'react';
import { useState, useEffect} from 'react';
import {Input} from '@/components/ui/input';
import {Card} from '@/components/ui/card';
import {Ripple} from '@/components/ui/ripple';
import {Separator} from '@/components/ui/seperator';
import axios from 'axios';

function VenueSearch({ handleVenueSelect }) {

    const [venueSearch, setVenueSearch] = useState('');
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [isLoadingVenue, setIsLoadingVenue] = useState(false);
    const [geoLocation, setGeoLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setGeoLocation({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting location: ', error);
                }
            );
        }
        setVenueSearch('');
        setFilteredVenues([]);
        setIsLoadingVenue(false);
    }, []);


    // handle venue selection from user search input
    const handleVenueSearch = async (searchTerm) => {
        try {
            setVenueSearch(searchTerm);
            const response = await axios.get('/api/event/search', {
                params: {
                    searchInput: searchTerm,
                    latitude: geoLocation?.latitude || null,
                    longitude: geoLocation?.longitude || null,
                }
            });
            setFilteredVenues(response.data);
            } catch (error) {
            console.error('Error searching venues: ', error);
        } finally {
            setIsLoadingVenue(false);
        }
    };

    const onVenueSelect = async (venue) => {
        setIsLoadingVenue(true);
        try {

            // request venue details from foursquare api
            const response = await axios.get(`/api/event/venue/${venue.fsq_id}`);

            // pass to CreateEvents
            await handleVenueSelect(response.data);
        } catch (error) {
            console.error('Error fetching venue details:', error);
        } finally {
            setIsLoadingVenue(false);
        }
        setVenueSearch('');
        setFilteredVenues([]);
    }


    return (
        <div
            className=''>
            <div className="space-y-4">
                <div className='mb-5 text-2xl font-semibold'>
                    Choose where your story unfolds
                </div>
                <Separator
                    className='my-5 bg-color-5'>
                </Separator>
                <div className="relative">
                    <Input
                        placeholder="Search for a venue..."
                        value={venueSearch}
                        onChange={(e) => handleVenueSearch(e.target.value)}
                        className="w-full [&::placeholder]:!text-black "  // override default styling
                    />

                    {isLoadingVenue && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
                            <Card
                                className="relative w-64 h-64 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                <Ripple
                                    className="opacity-80"
                                    mainCircleSize={100}
                                    mainCircleOpacity={0.3}
                                    numCircles={6}
                                />
                                <div className="relative z-10 text-center">
                                    <h3 className="text-lg font-medium text-gray-800">Gathering Venue
                                        Data</h3>
                                    <p className="text-sm text-gray-600 mt-2">Just a moment...</p>
                                </div>
                            </Card>
                        </div>

                    )}
                    {venueSearch && filteredVenues.length > 0 && (
                        <div
                            className="placeholder-black absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredVenues.map((venue, index) => (
                                <div
                                    key={index}
                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                    onClick={() => onVenueSelect(venue)}
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
        </div>
    )
}

export default VenueSearch;