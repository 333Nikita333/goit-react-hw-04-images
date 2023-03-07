import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { ModalBox, Overlay } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ onCloseModal, imgUrl, tags }) {
  useEffect(() => {
    function handleEscDown(e) {
      if (e.code === 'Escape') {
        onCloseModal();
      }
    }
    window.addEventListener('keydown', handleEscDown);

    return () => {
      window.removeEventListener('keydown', handleEscDown);
    };
  }, [onCloseModal]);

  function handleBackdropClick(e) {
    if (e.currentTarget === e.target) {
      onCloseModal();
    }
  }

  return createPortal(
    <Overlay onClick={handleBackdropClick}>
      <ModalBox>
        <img src={imgUrl} alt={tags} />
      </ModalBox>
    </Overlay>,
    modalRoot
  );
}

Modal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  imgUrl: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};
