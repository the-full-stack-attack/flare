import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/seperator';

function FormStart({ formInfo, handleChange }) {
    return (
        <div className="flex-1">
            <div className="p-6 border-b border-orange-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    Create Your Event
                </h2>
                <p className="text-sm text-gray-400">
                    Your next favorite memory starts with this moment.
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <Input
                        name="title"
                        placeholder="Event Title"
                        value={formInfo.title}
                        onChange={handleChange}
                        className="bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                    />
                </div>

                <div>
                    <Textarea
                        name="description"
                        placeholder="Share the details that make your event special..."
                        value={formInfo.description}
                        onChange={handleChange}
                        className="bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400 min-h-[120px]"
                    />
                </div>

                <Separator className="border-orange-500/20"/>

                <div className="text-center">
                    <p className="text-sm bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                        Remember, everyone here started exactly where you are.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FormStart;