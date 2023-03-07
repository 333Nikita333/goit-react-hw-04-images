import PropTypes from 'prop-types';
import { ErrorMessage, Formik } from 'formik';
import { object, string } from 'yup';
import { toast } from 'react-toastify';
import { GoSearch } from 'react-icons/go';
import {
  SearchbarBox,
  SearchbarInput,
  SearchButton,
  SearchForm,
} from './Searchbar.styled';

const initialValues = { query: '' };
const userSchema = object({ query: string() });

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  setIsBtnLoadMoreVisible,
  resetPage,
  resetImages,
}) {
  function handleSubmit({ query }, { resetForm }) {
    const currentQuery = query.trim();

    if (currentQuery === '') {
      toast.warning('Please enter your request');
      return;
    }
    if (searchQuery !== currentQuery && currentQuery !== '') {
      setSearchQuery(query);
      setIsBtnLoadMoreVisible(true);
      resetPage(1);
      resetImages([]);
      resetForm();
    }
  }

  return (
    <SearchbarBox>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={userSchema}
      >
        <SearchForm>
          <SearchButton type="submit">
            <GoSearch />
          </SearchButton>

          <SearchbarInput
            type="text"
            name="query"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
          <ErrorMessage name="query" />
        </SearchForm>
      </Formik>
    </SearchbarBox>
  );
}

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  setIsBtnLoadMoreVisible: PropTypes.func.isRequired,
  resetPage: PropTypes.func.isRequired,
  resetImages: PropTypes.func.isRequired,
};
