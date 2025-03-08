import React, { useMemo } from 'react';
import dayjs from 'dayjs';

import { IoArrowBack } from "react-icons/io5";

import { Button } from '@/components/ui/button';

import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';

import TTSButton from '../a11y/TTSButton';

type VenueDetailsProps = {
  venue: {
    id: number;
    name: string;
    description: string | null;
    street_address: string | null;
    city_name: string | null;
    state_name: string | null;
    zip_code: number | null;
    category: string | null;
    phone: string | null;
    popularTime: Date | null;
    pricing: string | null;
    serves_alcohol: boolean | null;
    website: string | null;
    wheelchair_accessible: boolean | null;
    is_dog_friendly: boolean | null;
    is_vegan_friendly: boolean | null;
  };
  eventVenueTags: {
    count: number;
    tag: string;
    Event_Venue_Tag: {
      display_order: number;
    };
  }[];
  closeVenueDetails: () => void;
}

function VenueDetails({ venue, eventVenueTags, closeVenueDetails }: VenueDetailsProps) {
  const {
    name,
    description,
    street_address,
    city_name,
    state_name,
    zip_code,
    category,
    phone,
    popularTime,
    pricing,
    serves_alcohol,
    website,
    wheelchair_accessible,
    is_dog_friendly,
    is_vegan_friendly,
  } = venue;

  const normalDrawerButton = 'bg-gradient-to-r from-black via-gray-900 to-pink-900 hover:from-black hover:via-gray-700 hover:to-pink-700 text-white';

  const reverseNormalDrawerButton = 'bg-gradient-to-r from-pink-900 via-gray-900 to-black hover:from-pink-700 hover:via-gray-700 hover:to-black text-white flex items-center';
  
  const scrollbarStyle = `
    [&::-webkit-scrollbar]:[width:15px]
    [&::-webkit-scrollbar-thumb]:bg-gradient-to-br from-pink-900/50 via-gray-900/50 to-black/50 hover:from-pink-900/80 hover:via-gray-900/80 hover:to-black/80
    [&::-webkit-scrollbar-thumb]:rounded-lg
  `;

  const tags: string = useMemo(() => (
    eventVenueTags
      .sort((a, b) => a.Event_Venue_Tag.display_order - b.Event_Venue_Tag.display_order)
      .map(({ tag }) => tag)
      .join(', ')
  ), [eventVenueTags]);

  const venueDetailsTTS: string = useMemo(() => (
    `
      Venue Name: ${name}
      ${description !== null ? `Venue Description: ${description}` : ''}
      ${phone ? `Phone Number: ${phone.split('').join('-')}` : ''}
      ${website ? `Website: ${website}` : ''}
      ${category ? `Category: ${category}` : ''}
      ${popularTime ? `Popular Time: ${dayjs(new Date(popularTime)).format('h:mm A')}` : ''}
      ${pricing ? `Pricing: ${pricing}` : ''}
      ${serves_alcohol !== null ? `Serves Alcohol: ${serves_alcohol ? 'Yes.' : 'No.'}` : ''}
      ${wheelchair_accessible !== null ? `Wheelchair Accessible: ${wheelchair_accessible ? 'Yes.' : 'No.'}` : ''}
      ${is_dog_friendly !== null ? `Dog Friendly: ${is_dog_friendly ? 'Yes.' : 'No.'}` : ''}
      ${is_vegan_friendly !== null ? `Vegan Friendly: ${is_vegan_friendly ? 'Yes.' : 'No.'}` : ''}
      ${eventVenueTags.length > 0 ? `Tags: ${tags}` : ''}
    `
  ), [venue, tags]);

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="text-xl">
          <div className="grid grid-cols-12">
            <div className="flex items-center justify-center">
              <button
                onClick={closeVenueDetails}
                className="pt-1"
              >
                <IoArrowBack
                  className="text-black hover:text-gray-700"
                />
              </button>
            </div>
            <div className="col-span-11 flex items-center justify-center">
              {name}
              <TTSButton
                text={venueDetailsTTS}
                className="ml-2 pb-1"
                iconClassName="text-lg text-black hover:text-gray-700"
              />
            </div>
          </div>
        </DrawerTitle>
        <DrawerDescription className="text-gray-700 text-md">{description}</DrawerDescription>
      </DrawerHeader>
      <div className={'p-4 pb-0 max-h-[300px] overflow-y-scroll ' + scrollbarStyle}>
        <div className="grid grid-cols-2 gap-2 flex-wrap">
          {/* <div className="col-span-2">
            <b>Address:</b>
            <p>
              {street_address
                ? `${street_address}, ${city_name}, ${state_name} ${zip_code}`
                : ''}
            </p>
          </div> */}
          {
            phone ? (
              <div>
                <b>Phone:</b>
                <p>{`(${phone.slice(0, 3)}) ${phone.slice(3, 6)} - ${phone.slice(6)}`}</p>
              </div>
            ) : null
          }
          {
            website ? (
              <div>
                <Button
                  className={reverseNormalDrawerButton + ' ' + 'h-[20px] mt-1'}
                  onClick={() => { openInNewTab(website); }}
                  title={website}
                >
                  Visit Website
                </Button>
                <p className="truncate">
                  {website.split('/')[2].includes('www.') ? website.split('/')[2].slice(4) : website.split('/')[2]}
                </p>
              </div>
            ) : null
          }
          {
            category ? (
              <div>
                <b>Category:</b>
                <p>{category}</p>
              </div>
            ) : null
          }
          {
            popularTime ? (
              <div>
                <b>Popular Time:</b>
                <p>{dayjs(new Date(popularTime)).format('h:mm A')}</p>
              </div>
            ): null
          }
          {
            pricing ? (
              <div>
                <b>Pricing:</b>
                <p>{pricing}</p>
              </div>
            ) : null
          }
          {
            serves_alcohol !== null ? (
              <div>
                <b>Serves Alcohol:</b>
                <p>{serves_alcohol ? 'Yes' : 'No'}</p>
              </div>
            ) : null
          }
          {
            wheelchair_accessible !== null ? (
              <div>
                <b>Wheelchair Accessible:</b>
                <p>{wheelchair_accessible ? 'Yes' : 'No'}</p>
              </div>
            ) : null
          }
          {
            is_dog_friendly !== null ? (
              <div>
                <b>Dog Friendly:</b>
                <p>{is_dog_friendly ? 'Yes' : 'No'}</p>
              </div>
            ) : null
          }
          {
            is_vegan_friendly !== null ? (
              <div>
                <b>Vegan Friendly:</b>
                <p>{is_vegan_friendly ? 'Yes' : 'No'}</p>
              </div>
            ) : null
          }
          {
            eventVenueTags.length > 0 ? (
              <div className="col-span-2">
                <b>Tags:</b>
                <p>{tags}</p>
              </div>
            ) : null
          }
        </div>
      </div>
    </>
  );
}

export default VenueDetails;
