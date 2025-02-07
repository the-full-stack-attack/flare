import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/seperator';

function FormStart({ formInfo, handleChange }) {
    return (
        <div>
            <div className='mb-5 text-2xl font-semibold'>
                Your next favorite memory starts with this moment.
            </div>
            <Separator
                className='my-5 bg-color-5'>
            </Separator>
            <Input
                className='bg-color-0 mb-5'
                name="title"
                placeholder="Event Title"
                value={formInfo.title}
                onChange={handleChange}
            />
            <Textarea
                className='bg-color-10 mb-5'
                name="description"
                placeholder="Description"
                value={formInfo.description}
                onChange={handleChange}
            />
            <div
                className='mb-5 font-semibold text-center'>
                Remember, everyone here started exactly where you are.
            </div>
        </div>
    )
}

export default FormStart;