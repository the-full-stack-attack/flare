import React from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/seperator';

function DateTime({ formInfo, handleChange }) {

    return (
        <div>
            <div className='mb-5 text-2xl font-semibold'>
                Pick your perfect moment to connect
            </div>
            <Separator
                className='my-5 bg-color-5'>
            </Separator>



            <label className="block text-sm font-medium mb-1">Date</label>
            <Input
                name="startDate"
                type="date"
                value={formInfo.startDate}
                onChange={handleChange}
                className='mb-5'
            />


            <label className="block text-sm font-medium mb-1">Start Time</label>
            <Input
                name="startTime"
                type="time"
                value={formInfo.startTime}
                onChange={handleChange}
                className='mb-5'
            />
            <label className="block text-sm font-medium mb-1">End Time</label>
            <Input
                name="endTime"
                type="time"
                value={formInfo.endTime}
                onChange={handleChange}
            />
            <div
                className='my-5 font-semibold text-center'>
                Set the stage for connection - your moment, your pace, your Flare.
            </div>
        </div>
    )
}

export default DateTime;