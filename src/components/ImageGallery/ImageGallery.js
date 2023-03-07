import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchImagesByName } from 'services/imagesApi';
import { ImageGalleryBox } from './ImageGallery.styled';
import ImageGalleryItem from 'components/ImageGalleryItem';
import ButtonLoadMore from 'components/ButtonLoadMore';
import Loader from 'components/Loader';
import { toast } from 'react-toastify';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default function ImageGallery({
  searchQuery,
  onCardClick,
  onOpenModal,
}) {
  const [status, setStatus] = useState(Status.IDLE);
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [totalHits, setTotalHits] = useState(null);

  useEffect(() => {
    if (searchQuery === '') return;
    
    setStatus(Status.PENDING);

    fetchImagesByName(page, searchQuery)
      .then(images => {
        setStatus(Status.RESOLVED);
        setImages(prevImages => [...prevImages, ...images.hits]);
        setTotalHits(images.totalHits);

        if (images.totalHits === 0) {
          toast.error(`Oops! Nothing found. Enter another request`);
        }

        if (images.totalHits > 0 && page === 1) {
          toast.success(`Success! Found ${images.totalHits} images`);
        }

        if (images.totalHits > 0 && images.totalHits <= 10) {
          toast.warning("Sorry, there's nothing more to show");
        }

        if (
          images.totalHits === images.length ||
          images.totalHits < images.length + images.hits.length
        ) {
          toast.error(`Sorry we have nothing more to show you.`);
        }
      })
      .catch(() => {
        setStatus(Status.REJECTED);
      });
  }, [page, searchQuery]);

  function onBtnLoadMore() {
    setPage(prevPage => prevPage + 1);
  }

  function handleCardClick(e) {
    if (e.currentTarget !== e.target) {
      const currentImageUrl = e.target.currentSrc;
      const imageArr = images.filter(
        ({ webformatURL }) => webformatURL === currentImageUrl
      );
      const largeImageURL = imageArr[0].largeImageURL;
      const imageTags = imageArr[0].tags;

      onCardClick(largeImageURL, imageTags);
      onOpenModal();
    }
  }

  return (
    <>
      <ImageGalleryBox onClick={handleCardClick}>
        {images.map(({ id, webformatURL, tags }) => {
          return (
            <ImageGalleryItem
              key={id}
              smallImageURL={webformatURL}
              tags={tags}
            />
          );
        })}
      </ImageGalleryBox>
      {status === Status.RESOLVED &&
        images.length !== totalHits &&
        images.length < totalHits && (
          <ButtonLoadMore onBtnLoadMore={onBtnLoadMore} />
        )}
      {status === Status.PENDING && <Loader />}
    </>
  );
}

ImageGallery.propTypes = {
  onCardClick: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onOpenModal: PropTypes.func.isRequired,
};
