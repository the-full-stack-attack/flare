import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import { Button } from '@/components/ui/button';

type Category = {
  name: string;
  id: number;
};

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

type CategoryFilterProps = {
  catFilter: string[];
  handleSetCatFilter: (cats: string[]) => void;
}

function CategoryFilter({ catFilter, handleSetCatFilter }: CategoryFilterProps) {
  const [catList, setCatList] = useState<Category[]>([]);

  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const [changeCatFilter, setChangeCatFilter] = useState<boolean>(false);

  const buttonColor = 'bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white px-4 py-4 rounded-xl text-md';

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
  };

  const handleChangeCatFilterForm = () => {
    setChangeCatFilter(!changeCatFilter);
  };

  const handleSetCatFilterClick = () => {
    handleSetCatFilter(selectedCats);
    setChangeCatFilter(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (catFilter === null) {
      setSelectedCats([]);
    } else {
      setSelectedCats(catFilter);
    }
  }, [catFilter]);

  return (
    <div className="container mx-auto px-4 mt-4">
      {
        changeCatFilter ? (
          <div className="grid grid-cols-2 gap-4 ">
            <div>
              <Button
                className={buttonColor}
                onClick={handleSetCatFilterClick}
              >
                Set Filter
              </Button>
            </div>
            <div>
              <Button
                className={buttonColor}
                onClick={handleChangeCatFilterForm}
              >
                Cancel
              </Button>

            </div>
          </div>
        ) : (
          <Button
            className={buttonColor}
            onClick={handleChangeCatFilterForm}
          >
            Select Categories
          </Button>
        )
      }
      {
        changeCatFilter ? catList.map((cat) => (
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
        )) : (
          <p className="text-gray-200 mt-2">
            {catFilter.length === 0 ? '' : `Showing Categories: ${catFilter.join(', ')}`}
          </p>
        )
      }
    </div>
  );
}

export default CategoryFilter;
