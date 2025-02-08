import React from 'react';
import dayjs from 'dayjs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/seperator';

function Review({formInfo, nullFields, handleFieldChange}) {

    return (
        <div className="flex-1">
            <div className="p-6 border-b border-orange-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    Review Details
                </h2>
                <p className="text-sm text-gray-400">
                    Confirm your event details before creating
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="backdrop-blur-lg bg-black/30 rounded-xl border border-orange-500/20 p-6">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        Event Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <p className="text-gray-400">Title:</p>
                        <p className="text-white">{formInfo.title}</p>
                        <p className="text-gray-400">Description:</p>
                        <p className="text-white">{formInfo.description}</p>
                        <p className="text-gray-400">Category:</p>
                        <p className="text-white">{formInfo.category}</p>
                        <p className="text-gray-400">Interests:</p>
                        <p className="text-white">{formInfo.interests.join(', ')}</p>
                        <p className="text-gray-400">Start Date:</p>
                        <p className="text-white">{dayjs(formInfo.startDate).format("MMM D, YYYY")}</p>
                        <p className="text-gray-400">Start Time:</p>
                        <p className="text-white">{dayjs(`2024-01-01T${formInfo.startTime}`).format("h:mm A")}</p>
                        <p className="text-gray-400">End Time:</p>
                        <p className="text-white">{dayjs(`2024-01-01T${formInfo.endTime}`).format("h:mm A")}</p>

                        {nullFields?.wheelchair_accessible === null && (
                            <>
                                <p className="text-gray-400">Wheelchair Accessible:</p>
                                <Select
                                    value={formInfo.wheelchair_accessible ? "1" : "0"}
                                    onValueChange={(value) => handleFieldChange('wheelchair_accessible', value === "1")}
                                >
                                    <SelectTrigger
                                        className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900/95 border-orange-500/30">
                                        <SelectItem value="1"
                                                    className="text-white hover:bg-orange-500/30">Yes</SelectItem>
                                        <SelectItem value="0"
                                                    className="text-white hover:bg-orange-500/30">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </>
                        )}

                        {nullFields?.serves_alcohol === null && (
                            <>
                                <p className="text-gray-400">Serves Alcohol:</p>
                                <Select
                                    value={formInfo.serves_alcohol ? "1" : "0"}
                                    onValueChange={(value) => handleFieldChange('serves_alcohol', value === "1")}
                                >
                                    <SelectTrigger
                                        className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900/95 border-orange-500/30">
                                        <SelectItem value="1"
                                                    className="text-white hover:bg-orange-500/30">Yes</SelectItem>
                                        <SelectItem value="0"
                                                    className="text-white hover:bg-orange-500/30">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </>
                        )}
                    </div>
                </div>

                <div className="backdrop-blur-lg bg-black/30 rounded-xl border border-orange-500/20 p-6">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        Venue Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <p className="text-gray-400">Venue Name:</p>
                        <p className="text-white">{formInfo.venue}</p>
                        {!nullFields?.description && (
                            <>
                                <p className="text-gray-400">Description:</p>
                                <p className="text-white">{formInfo.venueDescription}</p>
                            </>
                        )}
                        <p className="text-gray-400">Address:</p>
                        <p className="text-white">{formInfo.streetAddress}</p>
                        <p className="text-gray-400">City:</p>
                        <p className="text-white">{formInfo.cityName}</p>
                        <p className="text-gray-400">State:</p>
                        <p className="text-white">{formInfo.stateName}</p>
                        <p className="text-gray-400">Zip Code:</p>
                        <p className="text-white">{formInfo.zipCode}</p>
                    </div>
                </div>

                <Separator className="border-orange-500/20"/>

                <div className="text-center">
                    <p className="text-sm bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                        Ready to create your memorable moment?
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Review;