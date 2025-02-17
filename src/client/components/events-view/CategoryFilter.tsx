import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

type Category = {
  name: string;
  id: number;
};

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

function CategoryFilter() {
  const [catList, setCatList] = useState<Category[]>([]);

  const [selectedCats, setSelectedCats] = useState<string[]>([]);

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

  const handleCheckboxChange = ({ target }: ChangeEvent) => {
    const catName = target.value;
    const isChecked = target.checked;

    if (isChecked) {
      setSelectedCats([...selectedCats, catName]);
    } else {
      setSelectedCats(selectedCats.filter((cat) => cat !== catName));
    }
  }

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
          <div key={cat.id}>
            <label className="text-gray-200">
              <input
                type="checkbox"
                value={cat.name}
                checked={selectedCats.includes(cat.name)}
                onChange={handleCheckboxChange}
              />
              {` ${cat.name}`}
            </label>
          </div>
        ))
      }
    </div>
  );
}

export default CategoryFilter;
