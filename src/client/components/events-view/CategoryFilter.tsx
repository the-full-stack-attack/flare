import React, { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';

import FilterButtonsDialog from './FilterButtonsDialog';

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

  const simpleCatList = useMemo(() => (
    catList.map(category => category.name)
  ), [catList]);

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
    selectedCats.length === 0 ? toast('Category filter cleared.') : toast('Set category filter.');
    handleSetCatFilter(selectedCats);
    setChangeCatFilter(false);
  };

  const handleClearCatFilter = () => {
    toast('Category filter cleared.');
    handleSetCatFilter([]);
    setChangeCatFilter(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setSelectedCats(catFilter);
  }, [catFilter]);

  return (
    <div className="container mx-auto px-4 mt-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={buttonColor}
          >
            Select Categories
          </Button>
        </DialogTrigger>
        <FilterButtonsDialog 
          choicesList={simpleCatList}
          initialSelection={catFilter}
          title="Filter by Category"
          description="Choose which categories you want to filter upcoming events by."
          setFilter={handleSetCatFilter}
        />
      </Dialog>

      
    </div>
  );
}

export default CategoryFilter;
