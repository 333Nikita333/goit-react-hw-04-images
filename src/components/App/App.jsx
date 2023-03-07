import { useState, useEffect } from 'react';
import { fetchImagesByName } from 'services/imagesApi';
import ImageGallery from 'components/ImageGallery';
import Searchbar from 'components/Searchbar';
import ButtonLoadMore from 'components/ButtonLoadMore';
import Loader from 'components/Loader';
import { Wrapper } from './App.styled';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default function App() {
  const [status, setStatus] = useState(Status.IDLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [isBtnLoadMoreVisible, setIsBtnLoadMoreVisible] = useState(false);

  useEffect(() => {
    if (searchQuery === '') return;

    setStatus(Status.PENDING);
    setIsBtnLoadMoreVisible(false);

    fetchImagesByName(page, searchQuery)
      .then(images => {
        setImages(prevImages => [...prevImages, ...images.hits]);
        setStatus(Status.RESOLVED);
        setTotalHits(images.totalHits);
        setIsBtnLoadMoreVisible(true);
      })
      .catch(() => {
        setStatus(Status.REJECTED);
      });
  }, [searchQuery, page]);

  useEffect(() => {
    if (status !== Status.RESOLVED) return;

    if (images.length === 0) {
      setStatus(Status.REJECTED);
      setIsBtnLoadMoreVisible(false);
      toast.error(`Oops! Nothing found. Enter another request`);
      return;
    }

    if (totalHits > 0 && page === 1 && images.length > 0) {
      setStatus(Status.IDLE);
      toast.success(`Success! Found ${totalHits} images`);
    }

    if (totalHits <= images.length && page !== 1) {
      setStatus(Status.REJECTED);
      setIsBtnLoadMoreVisible(false);
      toast.warning("Sorry, there's nothing more to show");
    }
  }, [status, page, images, totalHits]);

  function onBtnLoadMore() {
    setPage(prevPage => prevPage + 1);
  }

  return (
    <Wrapper>
      <Searchbar
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        resetPage={setPage}
        resetImages={setImages}
        setIsBtnLoadMoreVisible={setIsBtnLoadMoreVisible}
      />
      <ImageGallery images={images} page={page} />

      {isBtnLoadMoreVisible && <ButtonLoadMore onBtnLoadMore={onBtnLoadMore} />}

      {status === Status.PENDING && <Loader />}
      <ToastContainer autoClose={3000} theme="dark" />
    </Wrapper>
  );
}
