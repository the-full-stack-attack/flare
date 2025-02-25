import { StringToBoolean } from 'class-variance-authority/dist/types';
import React, { useState } from 'react';

type ReadMoreProps = {
  children: string;
  maxLength: number;
  className: string;
};

function ReadMore({ children, maxLength, className }: ReadMoreProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const text = children;
  const isLongText = text.length > maxLength;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={className}>
      {expanded ? text : isLongText ? text.substring(0, maxLength) + '...' : text}
      {isLongText ? (
        <button onClick={toggleExpanded}>
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      ) : null}
    </div>
  );
}

export default ReadMore;
