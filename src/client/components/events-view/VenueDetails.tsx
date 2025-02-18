import React, { useMemo } from 'react';
import dayjs from 'dayjs';

import { IoArrowBack } from "react-icons/io5";

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
    Venue_Tags: {
      count: number;
      tag: string;
    }[];
    Venue_Images: {
      path: string;
    }[];
  };
  closeVenueDetails: () => void;
}

function VenueDetails({ venue, closeVenueDetails }: VenueDetailsProps) {
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
    Venue_Tags,
  } = venue;

  const tags: string = useMemo(() => (
    Venue_Tags
      .sort((a, b) => b.count - a.count)
      .map(({ tag }) => tag)
      .join(', ')
  ), [Venue_Tags]);

  const venueDetailsTTS: string = useMemo(() => (
    `
      Venue Name: ${name}
      Venue Description: ${description}
      ${phone ? `Phone Number: ${phone.split('').join('-')}` : ''}
      ${website ? `Website: ${website}` : ''}
      ${category ? `Category: ${category}` : ''}
      ${popularTime ? `Popular Time: ${dayjs(new Date(popularTime)).format('h:mm A')}` : ''}
      ${pricing ? `Pricing: ${pricing}` : ''}
      ${serves_alcohol !== null ? `Serves Alcohol? ${serves_alcohol ? 'Yes.' : 'No.'}` : ''}
      ${wheelchair_accessible !== null ? `Wheelchair Accessible? ${wheelchair_accessible ? 'Yes.' : 'No.'}` : ''}
      ${Venue_Tags.length > 0 ? `Tags: ${tags}` : ''}
    `
  ), [venue, tags])

  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="text-xl">
          <div className="grid grid-cols-12">
            <div>
              <button
                onClick={closeVenueDetails}
              >
                <IoArrowBack
                  className="text-black hover:text-gray-700"
                />
              </button>
            </div>
            <div className="col-span-11 inline text-center">
              {name}
              <TTSButton
                text={venueDetailsTTS}
                className="ml-2"
                iconClassName="text-lg text-black hover:text-gray-700"
              />
            </div>
          </div>
        </DrawerTitle>
        <DrawerDescription className="text-gray-700 text-md">{description}</DrawerDescription>
      </DrawerHeader>
      <div className="p-4 pb-0 max-h-[300px] overflow-y-scroll">
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
                <b>Website:</b>
                <p className="hover:underline truncate overflow-visible">
                  <a
                    href={website}
                    target="_blank"
                  >
                    {website}
                  </a>
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
                <b>Serves Alcohol?</b>
                <p>{serves_alcohol ? 'Yes' : 'No'}</p>
              </div>
            ) : null
          }
          {
            wheelchair_accessible !== null ? (
              <div>
                <b>Wheelchair Accessible?</b>
                <p>{wheelchair_accessible ? 'Yes' : 'No'}</p>
              </div>
            ) : null
          }
          {
            Venue_Tags.length > 0 ? (
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
