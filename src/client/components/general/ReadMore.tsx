import { StringToBoolean } from 'class-variance-authority/dist/types';
import React, { useState } from 'react';

type ReadMoreProps = {
  children: string;
  maxLength: number;
  className: string;
};

function ReadMore({ children, maxLength, className }: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  /*
    Wrap the text you want to collapse in the ReadMore component:
      - Children refers to the text between the ReadMore tags
  */
  const text = children;
  // Will check if the ReadMore button needs to be used.
  const isLongText = text.length > maxLength;

  const toggleIsExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={className}>
      {isExpanded
        ? text
        : isLongText
          ? text.substring(0, maxLength) + '... '
          : text}
      {isLongText ? (
        <button
          onClick={toggleIsExpanded}
          className="font-semibold hover:font-bold hover:underline"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      ) : null}
    </div>
  );
}

export default ReadMore;
