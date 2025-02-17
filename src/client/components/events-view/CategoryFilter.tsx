import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

type Category = {
  name: string;
  id: number;
};

function CategoryFilter() {
  const [catList, setCatList] = useState<Category[]>([]);

  const [changeCatFilter, setChangeCatFilter] = useState<boolean>(false);

  const getCategories = useCallback(() => {
    axios.get('/api/event/categories')
      .then(({ data }) => {
        setCatList(data);
      })
      .catch((error: unknown) => {
        console.error('Failed to getCategories:', error);
      });
  }, []);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 mt-4">
      <p className="text-gray-200">
        Event Category:
      </p>
      {
        catList.map((cat) => (
          <div className="text-gray-200">{cat.name}</div>
        ))
      }
    </div>
  );
}

export default CategoryFilter;
