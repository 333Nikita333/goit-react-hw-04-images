import { useState } from 'react';
import ImageGallery from 'components/ImageGallery';
import Searchbar from 'components/Searchbar';
import Modal from 'components/Modal';
import { Wrapper } from './App.styled';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [tags, setTags] = useState('');
  const [showModal, setShowModal] = useState(false);

  function handleSubmit(searchQuery) {
    setSearchQuery(searchQuery);
  }

  function toggleModal() {
    setShowModal(!showModal);
  }

  function onCardClick(largeImageUrl, imageTags) {
    setImgUrl(largeImageUrl);
    setTags(imageTags);
  }

  return (
    <Wrapper>
      <Searchbar onSubmit={handleSubmit} searchQuery={searchQuery} />
      <ImageGallery
        onCardClick={onCardClick}
        searchQuery={searchQuery}
        onOpenModal={toggleModal}
      />
      {showModal && (
        <Modal onCloseModal={toggleModal}>
          {<img src={imgUrl} alt={tags} />}
        </Modal>
      )}
      <ToastContainer autoClose={3000} theme="dark" />
    </Wrapper>
  );
}
