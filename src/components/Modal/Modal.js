import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalBox, Overlay } from './Modal.styled';
import PropTypes from 'prop-types';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ onCloseModal, imgUrl, tags }) {
  useEffect(() => {
    function handleEscDown(e) {
      if (e.code === 'Escape') {
        onCloseModal();
      }
    }
    window.addEventListener('keydown', handleEscDown);
    console.log("открылась модалка")
    return () => {
      window.removeEventListener('keydown', handleEscDown);
      console.log("зыкрылась модалка")
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
  children: PropTypes.node,
};
