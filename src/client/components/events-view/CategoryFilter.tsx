import React, { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';

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

type CategoryFilterProps = {
  catFilter: string[];
  handleSetCatFilter: (cats: string[]) => void;
}

function CategoryFilter({ catFilter, handleSetCatFilter }: CategoryFilterProps) {
  const [catList, setCatList] = useState<Category[]>([]);

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

  useEffect(() => {
    getCategories();
  }, []);

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
          itemType="Category"
          title="Filter by Category"
          description="Choose which categories you want to filter upcoming events by."
          setFilter={handleSetCatFilter}
        />
      </Dialog>
    </div>
  );
}

export default CategoryFilter;
