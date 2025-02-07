import React from 'react';
import dayjs from 'dayjs';

function Review({formInfo, nullFields, handleFieldChange}) {

    return (
        <div className="mb-5 space-y-6">
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
                        <p>{dayjs(formInfo.startDate).format("MMM D, YYYY")}</p>
                        <p className="text-gray-600">Start Time:</p>
                        <p>{dayjs(`2024-01-01T${formInfo.startTime}`).format("h:mm A")}</p>
                        <p className="text-gray-600">End Time:</p>
                        <p>{dayjs(`2024-01-01T${formInfo.endTime}`).format("h:mm A")}</p>
                        {nullFields?.wheelchair_accessible === null && (
                            <div>
                                <p className="text-gray-600">Wheelchair Accessible:</p>
                                <select
                                    value={formInfo.wheelchair_accessible}
                                    onChange={(e) => handleFieldChange('wheelchair_accessible', e.target.value === 'true')}
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Venue Information</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <p className="text-gray-600">Venue Name:</p>
                        <p>{formInfo.venue}</p>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Review;