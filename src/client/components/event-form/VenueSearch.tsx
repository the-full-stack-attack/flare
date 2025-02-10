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
            if (!geoLocation) {
                return;
            }


            const params = {
                searchInput: searchTerm
            };

            if (geoLocation) {
                params.latitude = geoLocation.latitude;
                params.longitude = geoLocation.longitude;
            }

            const response = await axios.get('/api/event/search', { params });
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
        <div className="flex-1">
            <div className="p-6 border-b border-orange-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    Choose Venue
                </h2>
                <p className="text-sm text-gray-400">
                    Choose where your story unfolds
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="relative">
                    <Input
                        placeholder="Search for a venue..."
                        value={venueSearch}
                        onChange={(e) => handleVenueSearch(e.target.value)}
                        className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                    />

                    {isLoadingVenue && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
                            <Card
                                className="relative w-64 h-64 bg-gradient-to-br from-gray-900/90 to-black/90 border border-orange-500/30">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Ripple
                                        className="opacity-100"
                                        mainCircleSize={100}
                                        mainCircleOpacity={0.4}
                                        numCircles={6}
                                        speed={1.5}
                                        color="rgb(249, 115, 22)"
                                    />
                                </div>
                                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                                    <h3 className="text-lg font-medium text-white">
                                        Gathering Venue Data
                                    </h3>
                                    <p className="text-sm text-gray-300 mt-2">
                                        Just a moment...
                                    </p>
                                </div>
                            </Card>
                        </div>
                    )}

                    {venueSearch && filteredVenues.length > 0 && (
                        <div
                            className="absolute z-10 w-full mt-1 bg-gray-900/95 border border-orange-500/30 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredVenues.map((venue, index) => (
                                <div
                                    key={index}
                                    className="p-3 hover:bg-orange-500/30 cursor-pointer border-b border-orange-500/20 last:border-b-0"
                                    onClick={() => onVenueSelect(venue)}
                                >
                                    <div className="font-medium text-white">{venue.name}</div>
                                    <div className="text-sm text-gray-300">
                                        {venue.street_address}, {venue.city_name}, {venue.state_name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {venueSearch && filteredVenues.length === 0 && (
                        <div
                            className="absolute z-10 w-full mt-1 bg-gray-900/95 border border-orange-500/30 rounded-md shadow-lg p-3 text-gray-300">
                            No venues found. Would you like to create a new venue?
                        </div>
                    )}
                </div>

                <Separator className="border-orange-500/20"/>

                <div className="text-center">
                    <p className="text-sm bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                        The perfect space awaits your perfect moment
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VenueSearch;