import React from 'react';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/seperator';

function DateTime({formInfo, handleChange}) {

    return (
        <div className="flex-1">
            <div className="p-6 border-b border-orange-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    Date & Time
                </h2>
                <p className="text-sm text-gray-400">
                    Pick your perfect moment to connect
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm text-gray-200 font-medium">Date</label>
                    <Input
                        name="startDate"
                        type="date"
                        value={formInfo.startDate}
                        onChange={handleChange}
                        className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm text-gray-200 font-medium">Start Time</label>
                    <Input
                        name="startTime"
                        type="time"
                        value={formInfo.startTime}
                        onChange={handleChange}
                        className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm text-gray-200 font-medium">End Time</label>
                    <Input
                        name="endTime"
                        type="time"
                        value={formInfo.endTime}
                        onChange={handleChange}
                        className="bg-black/80 border-orange-500/30 focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                    />
                </div>

                <Separator className="border-orange-500/20"/>

                <div className="text-center">
                    <p className="text-sm bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                        Set the stage for connection - your moment, your pace, your Flare.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DateTime;