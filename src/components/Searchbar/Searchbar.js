import { useState } from 'react';
import PropTypes from 'prop-types';
import { GoSearch } from 'react-icons/go';
import { toast } from 'react-toastify';
import {
  SearchbarBox,
  SearchbarInput,
  SearchButton,
  SearchForm,
} from './Searchbar.styled';

export default function SearchBar({ searchQuery, onSubmit }) {
  const [newSearchQuery, setNewSearchQuery] = useState('');

  function handleChange(e) {
    setNewSearchQuery(e.currentTarget.value.trim());
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (newSearchQuery === '') {
      return toast.warning('Please enter a search term');
    }

    if (newSearchQuery === searchQuery) {
      toast.info('Enter another request');
    }

    if (newSearchQuery !== searchQuery) {
      onSubmit(newSearchQuery);
      setNewSearchQuery('');
    }
  }

  return (
    <SearchbarBox>
      <SearchForm onSubmit={handleSubmit}>
        <SearchButton type="submit">
          <GoSearch />
        </SearchButton>

        <SearchbarInput
          type="text"
          autocomplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={newSearchQuery}
          onChange={handleChange}
        />
      </SearchForm>
    </SearchbarBox>
  );
}

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
