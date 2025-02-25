import React, { useState } from 'react';
import { Checkbox } from '../../../components/ui/checkbox';

function ImageSelection({ venueImages, selectedImages, onSelectImages }) {

    console.log('venueImages', venueImages);
    console.log('selectedImages', selectedImages);

    
    const handleImageToggle = (imageId) => {
        const isSelected = selectedImages.some(img => img.id === imageId);
        
        if (isSelected) {
            // remove already selected image
            onSelectImages(selectedImages.filter(img => img.id !== imageId));
        } else {
            // add image with display order
            const nextOrder = selectedImages.length;
            onSelectImages([...selectedImages, { id: imageId, display_order: nextOrder }]);
        }
    };


    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {venueImages.map((image) => (
                <div key={image.id} className="relative group">
                    <img 
                        src={image.path} 
                        className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                        <Checkbox
                            checked={selectedImages.some(img => img.id === image.id)}
                            onCheckedChange={() => handleImageToggle(image.id)}
                            className="bg-white/90 border-orange-500 data-[state=checked]:bg-orange-500"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ImageSelection;